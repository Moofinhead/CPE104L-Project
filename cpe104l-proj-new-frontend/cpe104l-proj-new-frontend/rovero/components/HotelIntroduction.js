import React from 'react'; 

const HotelIntroduction = () => (
    <section className="about-hm2-area hm2 mt-115 over-hidden position-relative">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-7 col-md-9">
                    <header className="title text-center">
                        <span className="sub-title f-500 text-uppercase primary-color position-relative d-inline-block pb-15 mb-2">
                            Redefining Filipino Hospitality
                        </span>
                        <h2 className="mb-0 text-uppercase">Welcome to Filipinas</h2>
                    </header> {/* end header */}
                </div> {/* end column */}
            </div> {/* end row */}

            <div className="row about-hm2-wrapper d-flex justify-content-center align-items-center mt-85 img-hover-effect-wrapper">
                <div className="col-xl-5 col-lg-6 col-md-5 col-sm-9">
                    <figure className="about-hm2-img position-relative over-hidden img-hover-effect2">
                        <img className="tilt" src="images/about/hm2-about-img.jpg" alt="about image" />
                    </figure> {/* end figure */}
                </div> {/* end column */}

                <div className="col-xl-6 offset-xl-1 col-lg-6 col-md-7 pl-lg-0 pl-xl-3">
                    <article className="about-hm2-content">
                        <div className="section-content-title mt--10">
                            <span className="text-uppercase theme-color f-700 fontNoto mb-2">The Filipinas</span>
                            <h2 className="mb-40">Embracing Tradition, Elevating Experiences</h2>
                            <p className="mb-25" style={{ textAlign: 'justify' }}>
                                At Filipinas Hotel Corporation, we believe that true hospitality goes beyond providing 
                                a place to stay—it's about creating an experience that reflects the genuine warmth and 
                                care that Filipinos are known for. Our commitment to 'Redefining Filipino Hospitality' 
                                means delivering personalized service, embracing our rich cultural heritage, and 
                                offering modern comforts that make every guest feel at home. Whether you're here for 
                                business, leisure, or a special occasion, we are dedicated to making your stay 
                                unforgettable. Welcome to Filipinas, where tradition meets innovation, and every visit 
                                is a celebration of Filipino heart and hospitality.
                            </p>
                        </div> {/* end section-content-title */}

                        <footer className="about-footer-content d-sm-flex align-items-center mt-20">
                            <div className="about-footer-content-right text-left" style={{ marginLeft: '50px' }}>
                                <h6 className="d-inline-block pr-2 mb-0">Carlos Javier Salcedo</h6>
                                <span className="meta-text-color">CEO</span>
                            </div> {/* end about-footer-content-right */}
                        </footer> {/* end footer */}
                    </article> {/* end article */}
                </div> {/* end column */}
            </div> {/* end row */}
        </div> {/* end container */}
    </section> 
);

export default HotelIntroduction;