"use client";

import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute } from "next-sanity";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";

import { dataset, projectId, studioUrl } from "@/config";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import type { PageBuilderBlockTypes, PagebuilderType } from "@/types";

// Hero is kept static for above-the-fold LCP optimization
import { HeroBlock } from "./sections/hero";

// Block loading skeleton
function BlockSkeleton() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

// Dynamic imports for all non-hero blocks to reduce initial bundle size
const CTABlock = dynamic(() => import("./sections/cta").then((mod) => mod.CTABlock), {
  loading: () => <BlockSkeleton />,
});
const ContactForm = dynamic(() => import("./sections/contact-form").then((mod) => mod.ContactForm), {
  loading: () => <BlockSkeleton />,
});
const FaqAccordion = dynamic(() => import("./sections/faq-accordion").then((mod) => mod.FaqAccordion), {
  loading: () => <BlockSkeleton />,
});
const FeatureCardsScreenshot = dynamic(
  () => import("./sections/feature-cards-screenshot").then((mod) => mod.FeatureCardsScreenshot),
  { loading: () => <BlockSkeleton /> }
);
const FeatureCardsWithIcon = dynamic(
  () => import("./sections/feature-cards-with-icon").then((mod) => mod.FeatureCardsWithIcon),
  { loading: () => <BlockSkeleton /> }
);
const ImageLinkCards = dynamic(
  () => import("./sections/image-link-cards").then((mod) => mod.ImageLinkCards),
  { loading: () => <BlockSkeleton /> }
);
const LatestPosts = dynamic(() => import("./sections/latest-posts").then((mod) => mod.LatestPosts), {
  loading: () => <BlockSkeleton />,
});
const LogoCloud = dynamic(() => import("./sections/logo-cloud").then((mod) => mod.LogoCloud), {
  loading: () => <BlockSkeleton />,
});
const MacbookScroll = dynamic(
  () => import("./sections/macbook-scroll").then((mod) => mod.MacbookScroll),
  { ssr: false, loading: () => <BlockSkeleton /> }
);
const StatsSection = dynamic(() => import("./sections/stats-section").then((mod) => mod.StatsSection), {
  loading: () => <BlockSkeleton />,
});
const SubscribeNewsletter = dynamic(
  () => import("./sections/subscribe-newsletter").then((mod) => mod.SubscribeNewsletter),
  { loading: () => <BlockSkeleton /> }
);
const TeamFinder = dynamic(() => import("./sections/team-finder").then((mod) => mod.TeamFinder), {
  loading: () => <BlockSkeleton />,
});
const TeamFinderTeaser = dynamic(
  () => import("./sections/team-finder-teaser").then((mod) => mod.TeamFinderTeaser),
  { loading: () => <BlockSkeleton /> }
);
const Testimonials = dynamic(() => import("./sections/testimonials").then((mod) => mod.Testimonials), {
  loading: () => <BlockSkeleton />,
});
const TextBlock = dynamic(() => import("./sections/text-block").then((mod) => mod.TextBlock), {
  loading: () => <BlockSkeleton />,
});
const VideoSection = dynamic(() => import("./sections/video-section").then((mod) => mod.VideoSection), {
  ssr: false,
  loading: () => <BlockSkeleton />,
});

// More specific and descriptive type aliases
type PageBuilderBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

export interface PageBuilderProps {
  readonly pageBuilder?: PageBuilderBlock[];
  readonly id: string;
  readonly type: string;
}

interface PageData {
  readonly _id: string;
  readonly _type: string;
  readonly pageBuilder?: PageBuilderBlock[];
}

interface SanityDataAttributeConfig {
  readonly id: string;
  readonly type: string;
  readonly path: string;
}

// Block types that should span full viewport width
const FULL_WIDTH_BLOCKS = new Set<string>([
  "hero",
  "statsSection",
  "macbookScroll",
  "cta",
  "videoSection",
  "teamFinderTeaser",
]);

// Component mapping for page builder blocks
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  cta: CTABlock,
  contactForm: ContactForm,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  textBlock: TextBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  featureCardsScreenshot: FeatureCardsScreenshot,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  testimonials: Testimonials,
  logoCloud: LogoCloud,
  statsSection: StatsSection,
  macbookScroll: MacbookScroll,
  videoSection: VideoSection,
  latestPosts: LatestPosts,
  teamFinder: TeamFinder,
  teamFinderTeaser: TeamFinderTeaser,
};

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: studioUrl,
    projectId,
    dataset,
    type: config.type,
    path: config.path,
  }).toString();
}

/**
 * Error fallback component for unknown block types
 */
function UnknownBlockError({
  blockType,
  blockKey,
}: {
  blockType: string;
  blockKey: string;
}) {
  return (
    <div
      key={`${blockType}-${blockKey}`}
      className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20"
      role="alert"
      aria-label={`Unknown block type: ${blockType}`}
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="font-mono text-sm bg-background px-2 py-1 rounded">
          {blockType}
        </code>
      </div>
    </div>
  );
}

/**
 * Hook to handle optimistic updates for page builder blocks
 */
function useOptimisticPageBuilder(
  initialBlocks: PageBuilderBlock[],
  documentId: string,
) {
  return useOptimistic<PageBuilderBlock[], any>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document?.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentBlocks;
    },
  );
}

/**
 * Custom hook for block component rendering logic
 */
function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type],
  );

  const renderBlock = useCallback(
    (block: PageBuilderBlock, index: number) => {
      const Component =
        BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS];

      if (!Component) {
        return (
          <UnknownBlockError
            key={`${block._type}-${block._key}`}
            blockType={block._type}
            blockKey={block._key}
          />
        );
      }

      const isFullWidth = FULL_WIDTH_BLOCKS.has(block._type);
      const wrapperClasses = isFullWidth
        ? "w-full"
        : "max-w-7xl mx-auto px-4 my-4 md:my-16 first:mt-4";

      return (
        <div
          key={`${block._type}-${block._key}`}
          className={wrapperClasses}
          data-sanity={createBlockDataAttribute(block._key)}
        >
          <Component {...(block as any)} />
        </div>
      );
    },
    [createBlockDataAttribute],
  );

  return { renderBlock };
}

/**
 * PageBuilder component for rendering dynamic content blocks from Sanity CMS
 */
export function PageBuilder({
  pageBuilder: initialBlocks = [],
  id,
  type,
}: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id);
  const { renderBlock } = useBlockRenderer(id, type);

  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: "pageBuilder" }),
    [id, type],
  );

  if (!blocks.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col"
      data-sanity={containerDataAttribute}
      aria-label="Page content"
    >
      {blocks.map(renderBlock)}
    </section>
  );
}
