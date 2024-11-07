"use client";
import HomeBanner from "@/components/HomeBanner";
import HotelIntroduction from "@/components/HotelIntroduction";
import RoomPreview from '@/components/RoomPreview';
import Testimonial from "@/components/Testimonial";
import RoveroLayout from "@/layouts/RoveroLayout";

const page = () => {
  return (
    <RoveroLayout>
      <main className="over-hidden">
        <HomeBanner /> {/* end slider-area */}
        <HotelIntroduction /> {/* end hotel about */}
        <RoomPreview /> {/* end room preview */}
      </main>

      <Testimonial /> {/* end testimonials */}
    </RoveroLayout>
  );
};

export default page;