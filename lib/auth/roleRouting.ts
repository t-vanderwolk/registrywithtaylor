export function getDashboardPathForRole(role: string | null | undefined): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'REVIEWER':
      return '/dashboard/reviewer';
    case 'USER':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
