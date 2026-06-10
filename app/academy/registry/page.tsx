import type { Metadata } from 'next';
import AcademyPathPage, { generateMetadata as baseGenerateMetadata } from '../[academyPath]/page';

const REGISTRY_PARAMS = Promise.resolve({ academyPath: 'registry' });

export async function generateMetadata(): Promise<Metadata> {
  return baseGenerateMetadata({ params: REGISTRY_PARAMS });
}

export default function AcademyRegistryPage() {
  return AcademyPathPage({ params: REGISTRY_PARAMS });
}
