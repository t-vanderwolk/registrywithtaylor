export type ServiceGroupIconName = 'planning' | 'homeSafety' | 'familySupport' | 'celebrations';

const groupIconAssets: Record<ServiceGroupIconName, string> = {
  planning: '/assets/icons/plan.png',
  homeSafety: '/assets/icons/safety.png',
  familySupport: '/assets/icons/family.png',
  celebrations: '/assets/icons/celebration.png',
};

export function getServiceGroupIconAsset(name: ServiceGroupIconName) {
  return groupIconAssets[name];
}
