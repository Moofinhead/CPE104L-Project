import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import PhotoGallery from '@/components/PhotoGallery';
import Ammenities from '@/components/Ammenities';

export default function AboutPage() {
  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="About"
        pageTitle="About us"
        pageSubTitle="Creating Lasting Memories with Every Stay"
      />
      <div className="about-page-area mt-115"> {/* About Page Area */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12">
              <div className="section-content-title text-center">
                <span className="text-uppercase theme-color f-700 fontNoto pb- d-block mb-6">
                  Your Gateway to Unmatched Hospitality
                </span>
                <h2 className="mb-0">Welcome to The Filipinas Corporation!</h2>
              </div> {/* Section Title */}
            </div> {/* Column */}
          </div> {/* Row */}
          <div className="row about-page-wrapper d-flex mt-55">
            <div className="col-xl-5 col-lg-6 col-md-5 col-sm-12 col-12">
              <div className="about-page-left position-relative">
                <p style={{ textAlign: 'justify' }}>
                  The Filipinas Corporation is dedicated to providing exceptional service and unparalleled experiences at our flagship hotel, The Filipinas. Nestled in a prime location, The Filipinas offers a blend of modern luxury and traditional Filipino hospitality, making it the perfect destination for leisure and business travelers alike. With elegant accommodations, world-class amenities, and a commitment to excellence, we invite you to discover a unique escape that caters to your every need.≈{" "}
                </p>
              </div> {/* About Page Left */}
            </div> {/* Column */}
            <div className="col-xl-6 offset-xl-1 col-lg-6 col-md-7 col-sm-12 col-12">
              <div className="about-page-right">
                <p className="mb-30" style={{ textAlign: 'justify' }}>
                  At The Filipinas, we pride ourselves on creating a welcoming atmosphere that reflects the rich culture and warmth of the Philippines. Our well-appointed rooms and suites are designed with your comfort in mind, featuring luxurious furnishings and stunning views. Whether you’re enjoying a relaxing day by our luxurious pool, dining at our exquisite restaurant, or exploring the nearby attractions, you’ll find that every detail has been thoughtfully curated to enhance your stay.{" "}
                </p>
                <p className="mb-0" style={{ textAlign: 'justify' }}>
                  In addition to our exceptional accommodations, The Filipinas Corporation is committed to offering a range of services and facilities that elevate your experience. From our 24/7 customer support to the delightful Kids Fantasy Park, we ensure that guests of all ages feel at home. We also provide convenient amenities like free car parking and special offers on select days, allowing you to focus on what truly matters—creating lasting memories with your loved ones.{" "}
                </p>
              </div> {/* About Page Right */}
            </div> {/* Column */}
          </div> {/* Row */}
        </div> {/* Container */}
      </div> {/* About Page Area End */}

      <PhotoGallery />
      <Ammenities />
    </RoveroLayout>
  );
}