type StructuredDataValue = Record<string, unknown>;

export default function AcademyStructuredData({
  data,
}: {
  data: StructuredDataValue | StructuredDataValue[];
}) {
  const entries = Array.isArray(data) ? data : [data];

  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={`academy-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
