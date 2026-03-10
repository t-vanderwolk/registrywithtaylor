import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';

type SocialSnippetInput = {
  title: string;
  excerpt?: string | null;
  shareTitle?: string | null;
  shareDescription?: string | null;
  category?: string | null;
  content?: string | null;
};

function cleanCopy(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pickHook(input: SocialSnippetInput) {
  const description = cleanCopy(input.shareDescription) ?? cleanCopy(input.excerpt);
  if (description) {
    return description;
  }

  const leadParagraph = input.content ? extractLeadParagraphs(input.content, 1)[0] : null;
  if (leadParagraph) {
    return stripMarkdown(leadParagraph);
  }

  return "Baby prep should feel calmer than the internet makes it seem.";
}

function trimSnippet(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}...`;
}

export function generateSocialSnippets(input: SocialSnippetInput) {
  const title = cleanCopy(input.shareTitle) ?? input.title.trim();
  const description = cleanCopy(input.shareDescription) ?? cleanCopy(input.excerpt) ?? pickHook(input);
  const normalizedDescription = trimSnippet(description, 220);
  const category = cleanCopy(input.category);

  return {
    instagramCaption: `${pickHook(input)}\n\n${title}\n\n${normalizedDescription}\n\n${category ? `${category} • ` : ''}Taylor-Made Baby Co.`,
    pinterestDescription: trimSnippet(
      `${title} — ${normalizedDescription}${category ? ` ${category}.` : ''} Practical baby planning guidance from Taylor-Made Baby Co.`,
      400,
    ),
    redditSummary: trimSnippet(
      `${title}\n\n${normalizedDescription}\n\nBuilt for parents who want clear recommendations without the noise.`,
      350,
    ),
  };
}
