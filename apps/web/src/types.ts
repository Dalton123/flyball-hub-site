import type {
  QueryBlogIndexPageDataResult,
  QueryBlogSlugPageDataResult,
  QueryHomePageDataResult,
  QueryImageTypeResult,
} from "@/lib/sanity/sanity.types";

export type PageBuilderBlockTypes = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number]["_type"];

export type PagebuilderType<T extends PageBuilderBlockTypes> = Extract<
  NonNullable<NonNullable<QueryHomePageDataResult>["pageBuilder"]>[number],
  { _type: T }
>;

export type SanityButtonProps = NonNullable<
  NonNullable<PagebuilderType<"hero">>["buttons"]
>[number];

export type SanityImageProps = NonNullable<QueryImageTypeResult>;

export type SanityRichTextProps =
  NonNullable<QueryBlogSlugPageDataResult>["richText"];

export type SanityRichTextBlock = Extract<
  NonNullable<NonNullable<SanityRichTextProps>[number]>,
  { _type: "block" }
>;

export type Maybe<T> = T | null | undefined;

export type BlogCardProps = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

// Breed types - temporary until schema is deployed and types regenerated
// TODO: Remove these after running `pnpm sanity typegen generate` post-deploy
export interface BreedStats {
  size: "Small" | "Medium" | "Large" | null;
  energy: number | null;
  trainability: number | null;
  speed: "Slow" | "Medium" | "Fast" | "Very Fast" | null;
  heightDog: boolean | null;
}

export interface BreedImage {
  id: string | null;
  preview: string | null;
  alt: string | null;
  hotspot: { x: number; y: number } | null;
  crop: { bottom: number; left: number; right: number; top: number } | null;
}

export interface BreedCardData {
  _id: string;
  _type: "breed";
  name: string | null;
  slug: string | null;
  verdict: string | null;
  verdictRating: number | null;
  image: BreedImage | null;
  stats: BreedStats | null;
}

export interface BreedPageData extends BreedCardData {
  pros: string[] | null;
  cons: string[] | null;
  richText: SanityRichTextProps;
}
