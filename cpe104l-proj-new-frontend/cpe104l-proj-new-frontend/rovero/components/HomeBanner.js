"use client";
import { sliderProps } from "@/utility/sliderProps"; 
import Link from "next/link"; 
import Slider from "react-slick"; 

const Content = () => {
  return (
    <div className="slider-content slider-content1 mt-50 text-center px-sm--3">
      <span className="text-white text-uppercase fontNoto f-700">
        The Filipinas
      </span>
      <h1
        className="text-white mb-30 f-700"
        data-aos="fade-up"
        data-aos-duration={2000}
        data-aos-delay={150}
      >
        Where Hospitality Meets Heritage
      </h1>
      <p
        className="text-white mb-55"
        data-aos="fade-up"
        data-aos-duration={1700}
      >
        Enjoy your next stay here at The Filipinas, where comfort meets luxury and unforgettable memories await.
      </p>
      <div className="my-btn d-inline-block">
        <Link href="booking" className="btn theme-bg">
          book now
        </Link>
      </div>
    </div>
  );
}; // Content component

const HomeBanner = () => {
  return (
    <div className="slider-area hm2 position-relative over-hidden">
      <Slider {...sliderProps.home1} className="slider-active">
        <div
          className="single-slider slider-height2 d-flex align-items-center z-index1 black-overly"
          data-background="images/hero/hm2-hero-bg-img1.jpg"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                <Content />
              </div>
            </div>
          </div>
        </div> {/* first slider */}
        <div
          className="single-slider slider-height2 d-flex align-items-center z-index1 black-overly"
          data-background="images/hero/hm2-hero-bg-img2.jpg"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                <Content />
              </div>
            </div>
          </div>
        </div> {/* second slider */}
        <div
          className="single-slider slider-height2 d-flex align-items-center z-index1 black-overly"
          data-background="images/hero/hm2-hero-bg-img3.jpg"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                <Content />
              </div>
            </div>
          </div>
        </div> {/* third slider */}
      </Slider> {/* slider */}
    </div>
  );
}; // HomeBanner component

export default HomeBanner; 
