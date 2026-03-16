import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
}