"use client";

import * as React from "react";
import { DoctorScheduleDetailsView } from "./DoctorScheduleDetailsView";

interface DoctorScheduleDetailsContainerProps {
  scheduleId: string;
}

export function DoctorScheduleDetailsContainer({
  scheduleId,
}: DoctorScheduleDetailsContainerProps) {
  return <DoctorScheduleDetailsView scheduleId={scheduleId} />;
}

export default DoctorScheduleDetailsContainer;
