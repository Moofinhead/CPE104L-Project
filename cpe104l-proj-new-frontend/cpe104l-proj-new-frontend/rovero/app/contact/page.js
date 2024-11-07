import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";

const page = () => {
  return (
    <RoveroLayout> 
      <Breadcrumb
        pageName="Contact"
        bgImage="images/bg/contact-page-bg.jpg"
        pageTitle="Contact Us"
        pageSubTitle="Reach Out to Us Without Any Worries."
      /> {/* breadcrumb */}
      <div className="contact-area contact-page mt-120"> 
        <div className="container"> 
          <div className="row contact-info-wrapper justify-content-center align-items-center"> 
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30">
              <div className="contact-page-info contact-location position-relative text-center"> 
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                </div> {/* end address icon */}
                <div className="contact-text">
                  <h4 className="mb-15">Address</h4>
                  <p className="mb-0">
                    658 Muralla St, Intramuros,<br /> Manila, 1002 Metro Manila
                  </p>
                </div> {/* end address text */}
              </div> {/* end address info */}
            </div> {/* end address section */}
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30">
              <div className="contact-page-info contact-phone position-relative text-center"> 
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-phone-alt" />
                  </span>
                </div> {/* end phone icon */}
                <div className="contact-text">
                  <h4 className="mb-3">Phone Number</h4>
                  <p className="mb-0">
                    <a className="d-block" href="tell:+639321234567">
                      +63 932 1234 567
                    </a>
                    <a className="d-block" href="tell:(02)8123-4567">
                      (02) 8123-4567
                    </a>
                  </p>
                </div> {/* end phone text */}
              </div> {/* end phone info */}
            </div> {/* end phone section */}
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8 col-12 contact-info-sep position-relative mb-30"> 
              <div className="contact-page-info contact-email text-center">
                <div className="contact-icon theme-bg d-inline-block text-center mb-30 mr-0">
                  <span className="d-inline-block">
                    <i className="fas fa-envelope" />
                  </span>
                </div> {/* end email icon */}
                <div className="contact-text"> 
                  <h4 className="mb-3">Email Address</h4>
                  <p className="mb-0">
                    <a className="d-block" href="mailto:thefilipinas@fhc.com">
                      thefilipinas@fhc.com
                    </a>
                    <a className="d-block" href="#">
                      thefilipinas-customerservice@fhc.com
                    </a>
                  </p>
                </div> {/* end email text */}
              </div> {/* end email info */}
            </div> {/* end email section */}
          </div> {/* end contact info wrapper */}
        </div> {/* end container */}
        <div className="over-hidden contact-page-map mt-100 mb-120"> 
          <div className="container"> 
            <div className="map-wrapper w-100 z-index1 rounded-0" id="mapwrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.9598836294203!2d120.97756537057258!3d14.588456918562752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca1877b11c59%3A0x29725a0f0cac1fa!2sMap%C3%BAa%20University!5e0!3m2!1sen!2sph!4v1729257854493!5m2!1sen!2sph"
                width="1175"
                height="450"
                style={{ border: '0' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" // no referrer policy
              ></iframe> {/* map iframe */}
            </div> {/* end map wrapper */}
          </div> {/* end container for map */}
        </div> {/* end map section */}
      </div> {/* end contact area */}
    </RoveroLayout>
  );
};

export default page;
