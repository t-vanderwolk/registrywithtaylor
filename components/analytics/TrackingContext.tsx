'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type BlogTrackingContextValue = {
  postId: string;
  slug: string;
  title: string;
};

export type GuideTrackingContextValue = {
  guideId: string;
  sourceRoute: string;
  slug: string;
  title: string;
};

const BlogTrackingContext = createContext<BlogTrackingContextValue | null>(null);
const GuideTrackingContext = createContext<GuideTrackingContextValue | null>(null);

export function BlogTrackingProvider({
  value,
  children,
}: {
  value: BlogTrackingContextValue;
  children: ReactNode;
}) {
  return <BlogTrackingContext.Provider value={value}>{children}</BlogTrackingContext.Provider>;
}

export function GuideTrackingProvider({
  value,
  children,
}: {
  value: GuideTrackingContextValue;
  children: ReactNode;
}) {
  return <GuideTrackingContext.Provider value={value}>{children}</GuideTrackingContext.Provider>;
}

export function useBlogTrackingContext() {
  return useContext(BlogTrackingContext);
}

export function useGuideTrackingContext() {
  return useContext(GuideTrackingContext);
}
