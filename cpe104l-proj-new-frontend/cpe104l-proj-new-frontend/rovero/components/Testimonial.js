"use client";
import { sliderProps } from "@/utility/sliderProps";
import Slider from "react-slick";

const Testimonial = () => {
  return (
    <div className="testimonial-area testimonial-bg position-relative mb-100"> {/* testimonial area */}
      <div className="container hm1-testi-padding pt-110"> {/* container */}
        <div className="row justify-content-center"> {/* row */}
          <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 col-12"> {/* column */}
            <div className="title text-center"> {/* title section */}
              <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                Testimonial &amp; Review
              </span>
              <h2 className="mb-22">What Our Guests Say</h2>
              <p>
                Discover the experiences shared by our guests at Filipinas Hotel Corporation.
              </p>
            </div> {/* title content */}
          </div> {/* column */}
        </div> {/* row */}
        
        <div
          className="testimonial-wrapper aos-init aos-animate"
          data-aos="fade-up"
          data-aos-duration={1000}
        >
          <Slider
            {...sliderProps.testimonialActive}
            className="row testimonial-active main-style mt-65 pb-65 justify-content-center"
          >
            <div className="px-3"> {/* testimonial item */}
              <div className="single-testimonial bg-white text-center position-relative pt-30 pb-45 pl-30 pr-30 mt-50 mb-20 transition5"> {/* single testimonial */}
                <div className="client-img rounded-circle text-center position-absolute">
                  <img
                    className="rounded-circle"
                    src="images/testimonial/hm1-author-img1.jpg"
                    alt="Guest 1"
                  />
                </div> {/* testimonial avatar */}
                <ul className="review-ratting mt-45 mb-20">
                  <li>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                  </li>
                </ul> {/* review rating */}
                <p>
                  "My stay was absolutely delightful. The staff was exceptionally friendly, and the rooms were immaculate."
                </p>
                <div className="testi-info text-center mt-30">
                  <h5 className="mb-1">Alex Johnson</h5>
                  <span className="meta-text-color mb-0">Corporate Manager</span>
                </div> {/* testimonial info */}
              </div> {/* single testimonial */}
            </div> {/* testimonial item */}
            
            <div className="px-3"> {/* testimonial item */}
              <div className="single-testimonial bg-white text-center position-relative pt-30 pb-45 pl-30 pr-30 mt-50 mb-20 transition5"> {/* single testimonial */}
                <div className="client-img rounded-circle text-center position-absolute">
                  <img
                    className="rounded-circle"
                    src="images/testimonial/hm1-author-img2.jpg"
                    alt="Guest 2"
                  />
                </div> {/* testimonial avatar */}
                <ul className="review-ratting mt-45 mb-20">
                  <li>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                  </li>
                </ul> {/* review rating */}
                <p>
                  "A wonderful experience! The amenities were top-notch, and I felt like royalty during my entire stay."
                </p>
                <div className="testi-info text-center mt-30">
                  <h5 className="mb-1">Emily Carter</h5>
                  <span className="meta-text-color mb-0">World Traveler</span>
                </div> {/* testimonial info */}
              </div> {/* single testimonial */}
            </div> {/* testimonial item */}
            
            <div className="px-3"> {/* testimonial item */}
              <div className="single-testimonial bg-white text-center position-relative pt-30 pb-45 pl-30 pr-30 mt-50 mb-20 transition5"> {/* single testimonial */}
                <div className="client-img rounded-circle text-center position-absolute">
                  <img
                    className="rounded-circle"
                    src="images/testimonial/hm1-author-img3.jpg"
                    alt="Guest 3"
                  />
                </div> {/* testimonial avatar */}
                <ul className="review-ratting mt-45 mb-20">
                  <li>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                  </li>
                </ul> {/* review rating */}
                <p>
                  "The location is perfect for exploring the city. I loved every moment of my stay at FHC!"
                </p>
                <div className="testi-info text-center mt-30">
                  <h5 className="mb-1">Nathan Green</h5>
                  <span className="meta-text-color mb-0">Creative Director</span>
                </div> {/* testimonial info */}
              </div> {/* single testimonial */}
            </div> {/* testimonial item */}
            
            <div className="px-3"> {/* testimonial item */}
              <div className="single-testimonial bg-white text-center position-relative pt-30 pb-45 pl-30 pr-30 mt-50 mb-20 transition5"> {/* single testimonial */}
                <div className="client-img rounded-circle text-center position-absolute">
                  <img
                    className="rounded-circle"
                    src="images/testimonial/hm1-author-img4.jpg"
                    alt="Guest 4"
                  />
                </div> {/* testimonial avatar */}
                <ul className="review-ratting mt-45 mb-20">
                  <li>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                    <span>
                      <i className="fa fa-star" />
                    </span>
                  </li>
                </ul> {/* review rating */}
                <p>
                  "I would highly recommend Filipinas Hotel to anyone looking for a luxurious getaway!"
                </p>
                <div className="testi-info text-center mt-30">
                  <h5 className="mb-1">Sofia Lee</h5>
                  <span className="meta-text-color mb-0">Interior Designer</span>
                </div> {/* testimonial info */}
              </div> {/* single testimonial */}
            </div> {/* testimonial item */}
          </Slider>
        </div> {/* testimonial slider */}
      </div> {/* container */}
    </div>
  );
};

export default Testimonial;
