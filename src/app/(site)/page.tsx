import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyAlekhya } from "@/components/home/WhyAlekhya";
import { FeaturedWork } from "@/components/home/FeaturedWork";
// import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getSelectedHeroSlides } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const heroSlides = await getSelectedHeroSlides();

  return (
    <>
      <Hero slides={heroSlides} />
      <ServicesOverview />
      <WhyAlekhya />
      <FeaturedWork />
      {/* <Testimonials /> */}
      <FinalCTA />
    </>
  );
}
