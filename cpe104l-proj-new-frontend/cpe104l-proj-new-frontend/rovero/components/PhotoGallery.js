import React from 'react';

const PhotoGallery = () => {
  return (
    <div className="about-photo-gallery-area mt-105 mb-100"> {/* Main gallery container */}
      <div className="container-fluid p-md-0"> {/* Responsive fluid container */}
        <ul className="about-gallery-active d-none"> {/* Active gallery list */}
          <li> {/* Slideshow item */}
            <div className="row d-flex about-photo-gallery-wrapper moveSlideshow about-gallery-activ no-gutters d-non align-items-center"> {/* Layout row */}
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12"> {/* First two images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* First image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img1.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img1.jpg"
                      alt="gallery image 01" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Second image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img2.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img2.jpg"
                      alt="gallery image 02" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> {/* Central image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Central image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img3.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img3.jpg"
                      alt="gallery image 03" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12"> {/* Last three images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fourth image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img4.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img4.jpg"
                      alt="gallery image 04" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fifth image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img5.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img5.jpg"
                      alt="gallery image 05" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12"> {/* Last image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Sixth image */}
                  <a data-fancybox="images" href="images/about-page/about-gallery-img6.jpg"> {/* Lightbox link */}
                    <img
                      className="w-100"
                      src="images/about-page/about-gallery-img6.jpg"
                      alt="gallery image 06" 
                    />
                    <span className="gallery-hover text-center theme-color position-absolute transition5 z-index11"> {/* Hover effect */}
                      <i className="fa-solid fa-plus" />
                    </span>
                  </a>
                </div>
              </div>
            </div> {/* End of row */}
          </li> {/* End of list item */}
          {/* Additional items can be added here */}
        </ul> {/* End of active gallery */}

        <div className="about-gallery-slider-active"> {/* Slider for the gallery */}
          <ul className="w-100 about-photo-gallery-wrapper"> {/* First slider section */}
            <li className="row d-flex about-photo-gallery-wrapper moveSlideshow no-gutters align-items-center"> {/* Layout row */}
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 d-md-inline-block d-sm-flex d-inline-block align-items-center"> {/* First two images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5 ab-g-img-width"> {/* First image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img1.jpg"
                    alt="gallery image 01" 
                  />
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5 ab-g-img-width"> {/* Second image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img2.jpg"
                    alt="gallery image 02" 
                  />
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> {/* Central image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Central image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img3.jpg"
                    alt="gallery image 03" 
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12"> {/* Fourth and fifth images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fourth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img4.jpg"
                    alt="gallery image 04" 
                  />
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fifth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img5.jpg"
                    alt="gallery image 05" 
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12"> {/* Last image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Sixth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img6.jpg"
                    alt="gallery image 06" 
                  />
                </div>
              </div>
            </li> {/* End of row */}
          </ul> {/* End of first slider section */}

          <ul className="w-100 about-photo-gallery-wrapper d-none d-md-inline-block"> {/* Second slider section (hidden on small screens) */}
            <li className="row d-flex about-photo-gallery-wrapper moveSlideshow no-gutters align-items-center"> {/* Layout row */}
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 d-md-inline-block d-sm-flex d-inline-block align-items-center"> {/* First two images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5 ab-g-img-width"> {/* First image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img1.jpg"
                    alt="gallery image 01" 
                  />
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5 ab-g-img-width"> {/* Second image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img2.jpg"
                    alt="gallery image 02" 
                  />
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> {/* Central image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Central image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img3.jpg"
                    alt="gallery image 03" 
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12"> {/* Fourth and fifth images column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fourth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img4.jpg"
                    alt="gallery image 04" 
                  />
                </div>
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Fifth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img5.jpg"
                    alt="gallery image 05" 
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12"> {/* Last image column */}
                <div className="about-photo-gallery-img gallery-img-hover position-relative transition5"> {/* Sixth image */}
                  <img
                    className="w-100"
                    src="images/about-page/about-gallery-img6.jpg"
                    alt="gallery image 06" 
                  />
                </div>
              </div>
            </li> {/* End of row */}
          </ul> {/* End of second slider section */}
        </div> {/* End of gallery slider */}
      </div> {/* End of fluid container */}
    </div> // End of gallery area
  );
}; // PhotoGallery component

export default PhotoGallery;