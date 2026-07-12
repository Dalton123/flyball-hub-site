import {
  SponsorPlacement,
  type SponsorPlacementValue,
} from "@/components/elements/sponsor-placement";

type SponsorSectionProps = SponsorPlacementValue;

export function SponsorSection(props: SponsorSectionProps) {
  return (
    <SponsorPlacement
      value={props}
      placementType="homepage_card"
      contentCategory="homepage"
    />
  );
}
