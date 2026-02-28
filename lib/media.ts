export const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MEDIA_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

export type AllowedMediaMimeType = (typeof ALLOWED_MEDIA_MIME_TYPES)[number];

export function isAllowedMediaMimeType(value: string): value is AllowedMediaMimeType {
  return ALLOWED_MEDIA_MIME_TYPES.includes(value as AllowedMediaMimeType);
}

export function isPdfMediaType(value: string) {
  return value === 'application/pdf';
}

export function isImageMediaType(value: string) {
  return value.startsWith('image/');
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const digits = size >= 10 ? 0 : 1;
  return `${size.toFixed(digits)} ${units[unitIndex]}`;
}
