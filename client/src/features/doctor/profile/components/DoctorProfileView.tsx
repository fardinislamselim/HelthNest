"use client";

import * as React from "react";
import { useDoctorProfile } from "../hooks/useDoctorProfile";
import { DoctorProfileCard } from "./DoctorProfileCard";
import { DoctorProfileForm } from "./DoctorProfileForm";
import { DoctorImageUpload } from "./DoctorImageUpload";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorProfileView() {
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile,
    isUpdating,
    uploadProfileImage,
    isUploadingImage,
  } = useDoctorProfile();

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Doctor Profile"
          description="Manage practitioner credentials and personal contact details"
        />
        <ErrorState
          title="Failed to load practitioner profile"
          message={error?.message || "Could not retrieve doctor account information."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Doctor Profile"
          description="Manage practitioner credentials and personal contact details"
        />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Profile"
        description="Manage practitioner credentials, clinic location, and contact information"
      />

      <DoctorImageUpload
        name={profile.name}
        currentImageUrl={profile.profileImageUrl}
        onUpload={uploadProfileImage}
        isUploading={isUploadingImage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DoctorProfileForm
          profile={profile}
          onSubmit={updateProfile}
          isSubmitting={isUpdating}
        />
        <DoctorProfileCard profile={profile} />
      </div>
    </div>
  );
}

export default DoctorProfileView;
