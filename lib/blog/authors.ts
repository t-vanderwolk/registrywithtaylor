export const POST_AUTHOR_ROLES = ['Primary Author', 'Co-Author', 'Contributor', 'Editor'] as const;

export type PostAuthorRole = (typeof POST_AUTHOR_ROLES)[number];

export type PostAuthorAssignment = {
  userId: string;
  role: PostAuthorRole;
};

export function normalizePostAuthorRole(value: unknown, fallback: PostAuthorRole = 'Contributor'): PostAuthorRole {
  if (typeof value !== 'string') {
    return fallback;
  }

  const match = POST_AUTHOR_ROLES.find((role) => role.toLowerCase() === value.trim().toLowerCase());
  return match ?? fallback;
}

export function normalizeAuthorAssignments(
  assignments: Array<{ userId?: string | null; role?: unknown }> | null | undefined,
  fallbackUserId?: string | null,
) {
  const deduped: PostAuthorAssignment[] = [];
  const seen = new Set<string>();

  for (const assignment of assignments ?? []) {
    const userId = assignment.userId?.trim();
    if (!userId || seen.has(userId)) {
      continue;
    }

    seen.add(userId);
    deduped.push({
      userId,
      role: normalizePostAuthorRole(assignment.role),
    });
  }

  const fallbackId = fallbackUserId?.trim();
  if (deduped.length === 0 && fallbackId) {
    return [{ userId: fallbackId, role: 'Primary Author' as const }];
  }

  if (deduped.length === 0) {
    return [];
  }

  const primaryIndex = deduped.findIndex((assignment) => assignment.role === 'Primary Author');
  const nextAssignments = deduped.map((assignment, index) => {
    if (primaryIndex === -1) {
      return index === 0 ? { ...assignment, role: 'Primary Author' as const } : assignment;
    }

    if (index !== primaryIndex && assignment.role === 'Primary Author') {
      return { ...assignment, role: 'Co-Author' as const };
    }

    return assignment;
  });

  return nextAssignments;
}
