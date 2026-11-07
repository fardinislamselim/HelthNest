"use client";

import * as React from "react";
import { usePatientProfile } from "@/features/patient/profile/hooks/usePatientProfile";
import {
  PatientProfileCard,
  PatientProfileForm,
  ProfileImageUpload,
} from "./index";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function PatientProfileView() {
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
  } = usePatientProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Patient Profile"
          description="Manage your contact details, residential address, and profile photo"
        />
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading profile records..." />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Patient Profile"
          description="Manage your contact details, residential address, and profile photo"
        />
        <ErrorState
          title="Failed to load profile"
          message={error?.message || "Could not retrieve your profile records from the server."}
          onRetry={() => refetch()}
          className="my-8"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Patient Profile"
        description="Manage your contact details, residential address, and profile photo"
      />

      <ProfileImageUpload
        currentImageUrl={profile.profileImageUrl}
        name={profile.name}
        onUpload={uploadProfileImage}
        isUploading={isUploadingImage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <PatientProfileCard profile={profile} />
        </div>
        <div className="lg:col-span-2">
          <PatientProfileForm
            profile={profile}
            onSubmit={updateProfile}
            isSubmitting={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}

export default PatientProfileView;
