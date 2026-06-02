export function getDashboardPathForRole(role: string | null | undefined): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'REVIEWER':
      return '/dashboard/reviewer';
    default:
      return '/';
  }
}
