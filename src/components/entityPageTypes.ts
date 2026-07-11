export interface Feature {
  title: string;
  desc: string;
  icon?: string;
}

export interface EntityPageProps {
  title: string;
  tagline: string;
  intro: string;
  heroImage?: string;
  overviewImage?: string;
  secondaryImage?: string;
  features: Feature[];
}
