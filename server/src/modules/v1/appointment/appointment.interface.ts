import { AppointmentStatus } from "../../../../generated/prisma/enums";

export interface ICreateAppointmentPayload {
  scheduleId: string;
  slotId: string;
}

export interface IAppointmentQuery {
  page?: number | string;
  limit?: number | string;
  status?: AppointmentStatus;
  date?: string;
}
