import {
  STARTER_TEMPLATES,
  type StarterTemplateId,
} from '@/components/admin/blog/starterTemplates';

export type ContentTemplateId = StarterTemplateId;

export type ContentTemplate = {
  id: ContentTemplateId;
  label: string;
  description: string;
  content: string;
};

export const CONTENT_TEMPLATES: ContentTemplate[] = STARTER_TEMPLATES.map((template) => ({
  id: template.id,
  label: template.label,
  description: template.description,
  content: template.content,
}));

export function getContentTemplate(templateId: ContentTemplateId) {
  return CONTENT_TEMPLATES.find((template) => template.id === templateId) ?? null;
}
