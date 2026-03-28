import prisma from '@/lib/server/prisma';

export async function listImageMediaLibrary(limit = 72) {
  return prisma.media.findMany({
    where: {
      fileType: {
        startsWith: 'image/',
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      url: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      createdAt: true,
    },
  });
}
