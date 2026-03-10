import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import type { AuthorOption } from '@/components/admin/blog/postEditorTypes';
import { POST_AUTHOR_ROLES, type PostAuthorAssignment, type PostAuthorRole } from '@/lib/blog/authors';

export default function PostAuthorsPanel({
  authorOptions,
  authors,
  readingTime,
  onAddAuthor,
  onUpdateAuthor,
  onRemoveAuthor,
}: {
  authorOptions: AuthorOption[];
  authors: PostAuthorAssignment[];
  readingTime: number;
  onAddAuthor: () => void;
  onUpdateAuthor: (index: number, next: Partial<PostAuthorAssignment>) => void;
  onRemoveAuthor: (index: number) => void;
}) {
  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Authors</p>
        <h2 className="admin-h2">Byline and contributors</h2>
        <p className="admin-body">Keep a primary author set, then layer in editors or contributors as the post evolves.</p>
      </div>

      <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <p className="admin-micro">Estimated reading time: {readingTime} min read</p>
      </div>

      {authors.length > 0 ? (
        <div className="space-y-3">
          {authors.map((assignment, index) => {
            const selectedAuthor = authorOptions.find((option) => option.id === assignment.userId) ?? null;

            return (
              <div key={`${assignment.userId}-${index}`} className="space-y-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <AdminField label="Author" htmlFor={`post-author-${index}`}>
                    <AdminSelect
                      id={`post-author-${index}`}
                      value={assignment.userId}
                      onChange={(event) => onUpdateAuthor(index, { userId: event.target.value })}
                    >
                      {authorOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </AdminSelect>
                  </AdminField>

                  <AdminField label="Role" htmlFor={`post-author-role-${index}`}>
                    <AdminSelect
                      id={`post-author-role-${index}`}
                      value={assignment.role}
                      onChange={(event) => onUpdateAuthor(index, { role: event.target.value as PostAuthorRole })}
                    >
                      {POST_AUTHOR_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </AdminSelect>
                  </AdminField>
                </div>

                {(selectedAuthor?.bio || (selectedAuthor?.expertiseAreas.length ?? 0) > 0) ? (
                  <div className="space-y-2 rounded-[20px] border border-black/8 bg-black/[0.02] p-4">
                    {selectedAuthor?.bio ? <p className="admin-body">{selectedAuthor.bio}</p> : null}
                    {selectedAuthor && selectedAuthor.expertiseAreas.length > 0 ? (
                      <p className="admin-micro">Expertise: {selectedAuthor.expertiseAreas.join(' • ')}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <AdminButton type="button" variant="ghost" size="sm" onClick={() => onRemoveAuthor(index)} disabled={authors.length === 1}>
                    Remove author
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="admin-micro">No authors assigned yet.</p>
      )}

      <div className="flex justify-start">
        <AdminButton type="button" variant="secondary" size="sm" onClick={onAddAuthor} disabled={authorOptions.length <= authors.length}>
          Add author
        </AdminButton>
      </div>
    </AdminSurface>
  );
}
