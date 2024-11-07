import Link from "next/link";

const Breadcrumb = ({
  pageName, // current page name
  bgImage = "/images/about-page/about-page-hero.jpg", // default bg image
  pageTitle, // current page title
  pageSubTitle = "FHC", // default subtitle
}) => { // Breadcrumb component
  return (
    <div className="inner-page-hero-area"> {/* outer wrapper */}
      <div
        className="inner-page-height inner-page-bg d-flex align-items-center position-relative black-overly"
        style={{
          backgroundImage: `url(${bgImage})`, // dynamic bg image
        }}
      > {/* inner wrapper for background */}
        <div className="container"> {/* container for content */}
          <div className="row"> {/* row for content alignment */}
            <div className="col-12 d-flex align-items-center justify-content-center"> {/* column for centering */}
              <div className="inner-page-content text-center"> {/* content wrapper */}
                <h1
                  className="text-white mb-20 text-capitalize aos-init" // title
                  data-aos="fade-up" // animation effect
                  data-aos-duration={1800} // animation duration
                  data-aos-delay={50} // animation delay
                >
                  {pageTitle} 
                </h1>
                <p
                  className="text-white aos-init" // subtitle
                  data-aos="fade-up" // animation effect
                  data-aos-duration={2500} // animation duration
                  data-aos-delay={150} // animation delay
                >
                  {pageSubTitle} 
                </p>
              </div> {/* /inner-page-content */}
            </div> {/* /column */}
          </div> {/* /row */}
        </div> {/* /container */}
        <nav
          aria-label="breadcrumb" // accessibility label
          className="inner-hero-nav position-absolute bottom-0 mb-20"
        > {/* breadcrumb navigation */}
          <ol className="breadcrumb justify-content-center bg-transparent"> {/* breadcrumb list */}
            <li className="breadcrumb-item"> {/* home link */}
              <Link className="text-white" href="/"> {/* link to homepage */}
                Home
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-capitalize text-white"
              aria-current="page" // current page indicator
            >
              {pageName} 
            </li>
          </ol> {/* /breadcrumb list */}
        </nav> {/* /breadcrumb navigation */}
      </div> {/* /inner wrapper for background */}
    </div>
  ); // return statement
}; // Breadcrumb component

export default Breadcrumb; 