const DOCTOR_TITLE_PREFIX = /^\s*dr(?:\.\s*|\s+)/i;

/**
 * Normalises a doctor name so it renders with a single "Dr." prefix,
 * e.g. "Dr. Dr. Sarah Jenkins" -> "Dr. Sarah Jenkins".
 */
export function formatDoctorName(name?: string | null): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "Doctor";

  const withoutPrefix = trimmed.replace(DOCTOR_TITLE_PREFIX, "").trim();
  return `Dr. ${withoutPrefix || trimmed}`;
}

export default formatDoctorName;
