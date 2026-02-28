const SUPABASE_URL =
  process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'blog-media';

type UploadToStorageInput = {
  fileName: string;
  fileType: string;
  fileBuffer: Buffer;
};

function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || 'upload';
}

function getSupabaseStorageConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_STORAGE_BUCKET) {
    throw new Error(
      'Supabase storage is not configured. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY. SUPABASE_STORAGE_BUCKET is optional and defaults to blog-media.',
    );
  }

  return {
    supabaseUrl: SUPABASE_URL.replace(/\/$/, ''),
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
    bucket: SUPABASE_STORAGE_BUCKET,
  };
}

export function isStorageConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_STORAGE_BUCKET);
}

export function getStorageBucketName() {
  return getSupabaseStorageConfig().bucket;
}

export async function uploadToStorage({
  fileName,
  fileType,
  fileBuffer,
}: UploadToStorageInput) {
  const { supabaseUrl, serviceRoleKey, bucket } = getSupabaseStorageConfig();
  const datedPath = new Date().toISOString().slice(0, 10);
  const safeName = sanitizeFileName(fileName);
  const storagePath = `${datedPath}/${crypto.randomUUID()}-${safeName}`;

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': fileType,
        'x-upsert': 'false',
      },
      body: new Uint8Array(fileBuffer),
    },
  );

  if (!response.ok) {
    const message = await response.text().catch(() => 'Unable to upload file to Supabase Storage.');
    throw new Error(message || 'Unable to upload file to Supabase Storage.');
  }

  return {
    storagePath,
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`,
  };
}

export async function deleteFromStorageByUrl(fileUrl: string) {
  const { supabaseUrl, serviceRoleKey, bucket } = getSupabaseStorageConfig();
  const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

  if (!fileUrl.startsWith(publicPrefix)) {
    throw new Error('Media URL does not match the configured storage bucket.');
  }

  const storagePath = fileUrl.slice(publicPrefix.length);
  if (!storagePath) {
    throw new Error('Media URL is missing a storage path.');
  }

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    },
  );

  if (!response.ok) {
    const message = await response.text().catch(() => 'Unable to delete file from Supabase Storage.');
    throw new Error(message || 'Unable to delete file from Supabase Storage.');
  }
}
