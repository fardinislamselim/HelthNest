# HelthNest পেমেন্ট ব্যবস্থা

এই ডকুমেন্টে অ্যাপয়েন্টমেন্টের পেমেন্ট কীভাবে পরিচালিত হচ্ছে তা বর্ণনা করা হয়েছে। পেমেন্টের জন্য **Stripe Checkout** ব্যবহার করা হয়েছে।

## পেমেন্টের সামগ্রিক ধাপ

1. রোগী একটি প্রকাশিত (published) সময়সূচির উপলভ্য slot নির্বাচন করে।
2. `POST /api/v1/appointments` অনুরোধে একটি `PENDING` appointment তৈরি হয় এবং slot সাময়িকভাবে reserved হয়।
3. একই অনুরোধে Stripe Checkout session তৈরি হয়। রোগীকে Stripe-এর `paymentUrl` দেওয়া হয়।
4. রোগী Stripe-এর hosted checkout পেজে পেমেন্ট সম্পন্ন করে।
5. Stripe server-এর webhook endpoint-এ event পাঠায়।
6. Backend `STRIPE_WEBHOOK_SECRET` দিয়ে webhook signature যাচাই করে। Frontend-এর success redirect-কে কখনও পেমেন্টের প্রমাণ হিসেবে গণ্য করা হয় না।
7. পেমেন্ট সফল হলে একটি transaction-এর মধ্যে:
   - Payment-এর status `PAID` হয়।
   - Appointment-এর status `BOOKED` হয়।
   - Schedule অনুযায়ী পরবর্তী serial number বরাদ্দ হয়।
   - Stripe transaction ID, invoice number এবং paid time সংরক্ষণ হয়।
8. Invoice PDF তৈরি করে রোগীর ইমেইলে attachment হিসেবে পাঠানো হয়।

## Payment status

Payment-এর সম্ভাব্য status:

- `PENDING`: Checkout session তৈরি হয়েছে, কিন্তু পেমেন্ট নিশ্চিত হয়নি।
- `PAID`: Stripe webhook-এর মাধ্যমে পেমেন্ট যাচাই হয়েছে।
- `FAILED`: পেমেন্ট ব্যর্থ হয়েছে।
- `EXPIRED`: Stripe Checkout session মেয়াদ শেষ করেছে।
- `REFUNDED`: ভবিষ্যৎ refund workflow-এর জন্য সংরক্ষিত status।

`PAID` না হওয়া পর্যন্ত appointment `BOOKED` হয় না এবং serial number বরাদ্দ হয় না।

## API endpoint

### Stripe Checkout session তৈরি

```http
POST /api/v1/payments/checkout/:appointmentId
Authorization: Bearer <patient-access-token>
```

এই endpoint শুধু সংশ্লিষ্ট রোগীর `PENDING` appointment-এর জন্য Checkout session তৈরি করে।

### Appointment তৈরি

```http
POST /api/v1/appointments
Authorization: Bearer <patient-access-token>
Content-Type: application/json
```

```json
{
  "scheduleId": "schedule-uuid",
  "slotId": "slot-uuid"
}
```

Response-এ Stripe-এর `paymentUrl` পাওয়া যাবে।

### Stripe webhook

```http
POST /api/v1/payments/stripe/webhook
Stripe-Signature: <stripe-signature>
Content-Type: application/json
```

Webhook route-এ raw request body ব্যবহার করা হয়, কারণ Stripe signature যাচাইয়ের জন্য মূল body অপরিবর্তিত থাকা প্রয়োজন।

সমর্থিত event:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

## নিরাপত্তা ও নির্ভরযোগ্যতা

- Frontend-এর payment success message বিশ্বাস করা হয় না।
- Stripe webhook signature server-side যাচাই করা হয়।
- একই webhook একাধিকবার এলে duplicate confirmation তৈরি হয় না।
- Serial number database transaction এবং serializable isolation-এর মধ্যে বরাদ্দ করা হয়।
- একই slot একাধিক active appointment-এ ব্যবহার করা যায় না।
- Failed বা expired payment হলে appointment বাতিল এবং slot release করা হয়।
- Payment credentials বা Stripe secret client-এ পাঠানো হয় না।

## Invoice

সফল পেমেন্টের পরে PDF invoice-এ নিচের তথ্য থাকে:

- Invoice number
- Appointment ID
- রোগীর নাম
- ডাক্তারের নাম
- Schedule date
- Slot-এর সময়
- Paid amount

Invoice রোগীর profile email-এ পাঠানো হয়। Invoice email পাঠানোর সময় `invoiceEmailedAt` সংরক্ষণ করা হয়, যাতে একই invoice অপ্রয়োজনীয়ভাবে পুনরায় পাঠানো না হয়।

## Environment variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://your-frontend.example/payment/success
STRIPE_CANCEL_URL=https://your-frontend.example/payment/cancel

EMAIL_USER=your-mail@example.com
EMAIL_PASS=your-mail-password-or-app-password
EMAIL_SENDER=your-mail@example.com
```

Production-এ Stripe-এর live key এবং production webhook secret ব্যবহার করতে হবে। Secret কোনো source code, Postman collection বা frontend bundle-এ রাখা যাবে না।

## Local webhook testing

Stripe CLI ব্যবহার করে local server-এ webhook forward করা যায়:

```bash
stripe listen --forward-to http://localhost:5000/api/v1/payments/stripe/webhook
```

CLI যে `whsec_...` secret দেবে, সেটি `STRIPE_WEBHOOK_SECRET` হিসেবে `.env`-এ রাখতে হবে।

## Database migration

Payment-এর জন্য নতুন `Payment` model এবং Appointment-এর payment relation যোগ করা হয়েছে। Migration চালানোর আগে database-এর migration history এবং বর্তমান schema মিল আছে কি না যাচাই করতে হবে।

Migration drift থাকলে সরাসরি `prisma migrate reset` চালানো যাবে না, কারণ এতে database-এর সব data মুছে যেতে পারে। Production database-এ reset-এর পরিবর্তে নিরাপদ, পর্যালোচিত migration ব্যবহার করতে হবে।

## Refund

বর্তমান cancellation flow appointment বাতিল করে slot release করে, কিন্তু Stripe refund স্বয়ংক্রিয়ভাবে শুরু করে না। Refund policy, cancellation deadline এবং refund amount নির্ধারিত হলে আলাদা authenticated refund workflow যোগ করতে হবে।
