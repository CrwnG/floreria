import { HeroSection } from '@/components/home/HeroSection';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { CategoryCards } from '@/components/home/CategoryCards';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandStory } from '@/components/home/BrandStory';
import { OccasionGrid } from '@/components/home/OccasionGrid';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CountdownTimer />
      <CategoryCards />
      <FeaturedProducts />
      <BrandStory />
      <OccasionGrid />
      <TestimonialsCarousel />
      <InstagramFeed />
      <NewsletterSignup />
    </>
  );
}
