export interface PatientRefundRecord {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
  reason: string;
  createdAt: string;
  payment?: {
    amount: number;
    currency: string;
    transactionId?: string | null;
    status: string;
    paidAt?: string | null;
  } | null;
  appointment?: {
    id: string;
    serialNumber?: number | null;
    status: string;
    cancelledAt?: string | null;
    schedule?: {
      date: string;
      startTime: string;
      endTime: string;
    };
    doctor?: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
}

export interface RefundQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}
