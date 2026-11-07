"use client";

import * as React from "react";
import { DoctorAppointmentDetailsView } from "./DoctorAppointmentDetailsView";

interface DoctorAppointmentDetailsContainerProps {
  appointmentId: string;
}

export function DoctorAppointmentDetailsContainer({
  appointmentId,
}: DoctorAppointmentDetailsContainerProps) {
  return <DoctorAppointmentDetailsView appointmentId={appointmentId} />;
}

export default DoctorAppointmentDetailsContainer;
