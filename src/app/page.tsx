import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyAlekhya } from "@/components/home/WhyAlekhya";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getHeroSlides } from "@/data/hero";

export default function HomePage() {
  const heroSlides = getHeroSlides();

  return (
    <>
      <Hero slides={heroSlides} />
      <ServicesOverview />
      <WhyAlekhya />
      <FeaturedWork />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
