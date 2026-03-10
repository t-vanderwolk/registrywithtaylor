import BlogCard from '@/components/blog/BlogCard';

type JournalCardProps = {
  title: string;
  slug: string;
  category: string;
  coverImage?: string | null;
  excerpt?: string | null;
  dateLabel: string;
  dateTime?: string;
  readingTime?: number | null;
  className?: string;
};

export default function JournalCard(props: JournalCardProps) {
  return <BlogCard {...props} />;
}
