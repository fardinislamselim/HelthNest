import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse, ApiMeta } from "@/types/api";
import type {
  DoctorScheduleItem,
  DoctorSchedulesListResponse,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  ScheduleFilterParams,
} from "../types/schedule.types";

interface ScheduleBackendPayload {
  schedule?: DoctorScheduleItem;
  schedules?: DoctorScheduleItem[];
  meta?: ApiMeta;
  [key: string]: unknown;
}

export const doctorScheduleService = {
  getMySchedules: async (
    params?: ScheduleFilterParams,
  ): Promise<ApiResponse<DoctorSchedulesListResponse>> => {
    const response = await apiClient.get<ApiResponse<ScheduleBackendPayload | DoctorScheduleItem[]>>(
      API_ENDPOINTS.SCHEDULES.MY_SCHEDULES,
      { params },
    );
    const rawData = response.data?.data;
    let schedules: DoctorScheduleItem[] = [];
    let meta = response.data?.meta;

    if (Array.isArray(rawData)) {
      schedules = rawData;
    } else if (rawData && typeof rawData === "object") {
      schedules = (rawData.schedules as DoctorScheduleItem[]) || [];
      meta = meta || (rawData.meta as ApiMeta);
    }

    return {
      ...response.data,
      data: { schedules, meta: meta || { page: 1, limit: 10, total: schedules.length, totalPage: 1 } },
    };
  },

  getScheduleById: async (
    scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleItem>> => {
    const response = await apiClient.get<ApiResponse<ScheduleBackendPayload>>(
      API_ENDPOINTS.SCHEDULES.BY_ID(scheduleId),
    );
    const rawData = response.data?.data;
    const schedule = (rawData?.schedule ?? rawData) as DoctorScheduleItem;
    return {
      ...response.data,
      data: schedule,
    };
  },

  createSchedule: async (
    payload: CreateSchedulePayload,
  ): Promise<ApiResponse<DoctorScheduleItem>> => {
    const response = await apiClient.post<ApiResponse<ScheduleBackendPayload>>(
      API_ENDPOINTS.SCHEDULES.CREATE,
      payload,
    );
    const rawData = response.data?.data;
    const schedule = (rawData?.schedule ?? rawData) as DoctorScheduleItem;
    return {
      ...response.data,
      data: schedule,
    };
  },

  updateSchedule: async (
    scheduleId: string,
    payload: UpdateSchedulePayload,
  ): Promise<ApiResponse<DoctorScheduleItem>> => {
    const response = await apiClient.patch<ApiResponse<ScheduleBackendPayload>>(
      API_ENDPOINTS.SCHEDULES.UPDATE(scheduleId),
      payload,
    );
    const rawData = response.data?.data;
    const schedule = (rawData?.schedule ?? rawData) as DoctorScheduleItem;
    return {
      ...response.data,
      data: schedule,
    };
  },

  publishSchedule: async (
    scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleItem>> => {
    const response = await apiClient.patch<ApiResponse<ScheduleBackendPayload>>(
      API_ENDPOINTS.SCHEDULES.PUBLISH(scheduleId),
    );
    const rawData = response.data?.data;
    const schedule = (rawData?.schedule ?? rawData) as DoctorScheduleItem;
    return {
      ...response.data,
      data: schedule,
    };
  },

  unpublishSchedule: async (
    scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleItem>> => {
    const response = await apiClient.patch<ApiResponse<ScheduleBackendPayload>>(
      API_ENDPOINTS.SCHEDULES.UNPUBLISH(scheduleId),
    );
    const rawData = response.data?.data;
    const schedule = (rawData?.schedule ?? rawData) as DoctorScheduleItem;
    return {
      ...response.data,
      data: schedule,
    };
  },

  deleteSchedule: async (
    scheduleId: string,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.SCHEDULES.DELETE(scheduleId),
    );
    return response.data;
  },
};

export default doctorScheduleService;
