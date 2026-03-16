interface GuideSidebarNavProps {
  sections: Array<{
    id: string;
    title: string;
    level: number;
  }>;
  currentSection?: string;
}

export default function GuideSidebarNav({ sections, currentSection }: GuideSidebarNavProps) {
  if (sections.length === 0) return null;

  return (
    <nav className="sticky top-8">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h3 className="text-lg font-serif text-charcoal mb-4">Guide Contents</h3>

        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                  currentSection === section.id
                    ? 'bg-blush-50 text-blush-700 font-medium'
                    : 'text-neutral-600 hover:text-charcoal hover:bg-neutral-50'
                } ${section.level === 2 ? 'ml-4' : ''}`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}