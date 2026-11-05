import * as React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Contact & Support
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Have questions regarding consultations, doctor applications, or refunds? Our support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h2 className="text-lg font-semibold text-foreground">HealthNest Support Desk</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>support@healthnest.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Sunday – Thursday: 9:00 AM – 6:00 PM (BST)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Emergency Notice</h3>
            <p>
              HealthNest is not an emergency response service. If you are experiencing a life-threatening medical emergency, call 999 or proceed to the nearest emergency department.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Send us a message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your Name</Label>
              <Input id="contact-name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input id="contact-email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" placeholder="Inquiry regarding consultation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <textarea
                id="contact-message"
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="How can we assist you?"
              />
            </div>
            <Button type="button" className="w-full">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

