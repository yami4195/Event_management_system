import HeroSection from "@/components/home/HeroSection";
import GlobalSearchSection from "@/components/home/GlobalSearchSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedEventsSection from "@/components/home/FeaturedEventsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedOrganizersSection from "@/components/home/TrustedOrganizersSection";
import GallerySection from "@/components/home/GallerySection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import "@/styles/home-layout.css";

export default function HomePage() {
  return (
    <div className="home-page w-full min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Global Search Floating Card */}
      <GlobalSearchSection />

      {/* 3. Featured Categories */}
      <CategoriesSection />

      {/* 4. Trending Events Grid */}
      <FeaturedEventsSection />

      {/* 5. Why Choose EventFlow */}
      <WhyChooseSection />

      {/* 6. How It Works 4-Step Timeline */}
      <HowItWorksSection />

      {/* 7. Statistics Section */}
      <StatisticsSection />

      {/* 8. Upcoming Events & Countdowns */}
      <UpcomingEventsSection />

      {/* 9. Testimonials Carousel */}
      <TestimonialsSection />

      {/* 10. Trusted Organizers */}
      <TrustedOrganizersSection />

      {/* 11. Event Photo Gallery */}
      <GallerySection />

      {/* 12. Accordion FAQ Section */}
      <FAQSection />

      {/* 13. Call To Action (CTA) */}
      <CTASection />
    </div>
  );
}
