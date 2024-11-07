import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";

//TODO: once backend is fully working

const page = () => {
  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="Confirmation"
        bgImage="images/bg/booking-hero.jpg"
        pageTitle="Thank You !"
      />
      <div className="confirmation-page-area mt-120 mb-120">
        <div className="container">
          <div className="booking-page-wrapper">
            <div className="confirmation-content text-center section-bg pt-40 pb-40 px-4 mb-55">
              <span className="con-icon theme-color d-block rounded-circle theme-border mx-auto mb-18">
                <span>
                  <i className="fa-solid fa-check" />
                </span>
              </span>
              <h2>Your Payment has been Confirmed !</h2>
              <p className="mb-0 pt-2">Thank you for being with us</p>
            </div>
            {/* /cnfirmation-content */}
            <div className="booking-room-info-area confirmation-page ">
              <h2 className="mb-30">Your Room</h2>
              <div className="row justify-content-center img-hover-effect-wrapper">
                <div className="col-xl-3  col-lg-4 col-md-4 col-sm-12 col-12 img-hover-effect2">
                  <img
                    className="confirmation-img mb-30 w-100"
                    src="images/bg/confirmation-img.jpg"
                    alt="checkout image"
                  />
                </div>
                {/* /col */}
                <div className="col-xl-5  col-lg-4 col-md-5 col-sm-7 col-12">
                  <div className="booking-room-info-left mt--5 mb-30">
                    <div className="title">
                      <h2 className="mb-0">
                        <Link href="rooms-details">Luxury Super Delux</Link>
                      </h2>
                    </div>
                    {/* /title */}
                    <ul className="booking-total-time mt-22">
                      <li className="text-color d-block mb-6">
                        <span className="main-color d-inline-block">
                          Check in:
                        </span>{" "}
                        December 24, 2024
                      </li>
                      <li className="text-color d-block mb-6 ">
                        <span className="main-color d-inline-block">
                          Check Out:
                        </span>{" "}
                        December 27, 2024
                      </li>
                      <li className="text-color d-block mb-6 ">
                        <span className="main-color d-inline-block">
                          Guests:
                        </span>{" "}
                        04
                      </li>
                      <li className="text-color d-block mb-6 ">
                        <span className="main-color f-700 d-inline-block">
                          Total:
                        </span>{" "}
                        4 Days 3 Nights
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /col */}
                <div className="col-xl-4  col-lg-4  col-md-3  col-sm-5 col-12">
                  <div className="con-room-d-right mt--5 mb-30">
                    <h4 className="sidebar-title mb-22">Extra Service</h4>
                    <ul className="booking-r-info">
                      <li className="single-rd-info mb-1">
                        <span className="d-inline-block text-color">
                          Enable Wifi
                        </span>
                      </li>
                      <li className="single-rd-info mb-1">
                        <span className="d-inline-block text-color">
                          Smoking Zone
                        </span>
                      </li>
                      <li className="single-rd-info mb-1">
                        <span className="d-inline-block text-color">
                          Swimming Pool
                        </span>
                      </li>
                      <li className="single-rd-info mb-1">
                        <span className="d-inline-block text-color">
                          Service Boy
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /col */}
              </div>
              {/* /row */}
              <div className="amount-paid-area primary-border2-top">
                <div className="row justify-content-end">
                  <div className="col-xl-4 col-lg-4 col-md-4  col-sm-5 col- pr-lg-1">
                    <div className="amount-paid text-right text-sm-left mt-10">
                      <p>
                        Amount Paid{" "}
                        <span className="d-inline-block fontNoto f-700 main-color ml-20">
                          $500
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* /col */}
                </div>
                {/* /row */}
              </div>
              {/* /amount-paid-area */}
              <div className="row confirmation-your-info flex-column-reverse flex-lg-row">
                <div className="col-xl-8  col-lg-8 col-md-12  col-sm- col-">
                  <div className="checkout-your-info-area mt-30">
                    <h2 className="mb-30">Add Your Information</h2>
                    <ul>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          First name :
                        </span>{" "}
                        Hafiz uddin
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Last name :
                        </span>{" "}
                        Juwel
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Email address :
                        </span>{" "}
                        xuwelkhan@gmail.com
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Phone no :
                        </span>{" "}
                        +880 1234 567890
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Address :
                        </span>{" "}
                        20 Bordeshi, Amin Bazar, Savar
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          City :
                        </span>{" "}
                        Dhaka
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Country :
                        </span>{" "}
                        Bangladesh
                      </li>
                      <li className="text-color d-inline-block mb-15">
                        <span className="main-color d-inline-block">
                          Zip code :
                        </span>{" "}
                        1348
                      </li>
                    </ul>
                    <ul>
                      <li className="d-block mb-15 w-100">
                        <span>Additional message :</span>
                        <p className="mb-0 mt-2">
                          Toenim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea com modo
                          consequat. Duis aute irure dolor in reprehenderit in
                          voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non
                        </p>
                      </li>
                    </ul>
                    <ul>
                      <li className="text-color d-block mb-15 w-100">
                        <span className="main-color d-inline-block">
                          Coupon code :
                        </span>{" "}
                        Chrismas2024
                      </li>
                    </ul>
                    <div className="con-btn mt-55 d-sm-flex align-items-center">
                      <div className="my-btn d-block">
                        <Link href="booking" className="btn theme-bg">
                          Download Pdf
                        </Link>
                      </div>
                      {/* / btn */}
                      <div className="my-btn d-block ml-sm-3 mt-3 mt-sm-0">
                        <Link
                          href="booking"
                          className="btn bg-transparent main-color"
                        >
                          Print
                        </Link>
                      </div>
                      {/* / btn */}
                    </div>
                  </div>
                  {/* /booking-your-info-area */}
                </div>
                {/* /col */}
                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                  <div className="booking-room-info-left mt-3 pb-md-3 pb-lg-0">
                    <div className="title">
                      <h2 className="mb-0">Reservation Details</h2>
                    </div>
                    {/* /title */}
                    <ul className="booking-total-time mt-20">
                      <li className="text-color d-block mb-6">
                        <span className="main-color d-inline-block">
                          Order No:
                        </span>{" "}
                        2018Dec25-213
                      </li>
                      <li className="text-color d-block mb-6 ">
                        <span className="main-color d-inline-block">
                          Order Date:
                        </span>{" "}
                        December 27, 2024
                      </li>
                      <li className="text-color d-block mb-6 ">
                        <span className="main-color d-inline-block">
                          Transaction ID:
                        </span>{" "}
                        0546343244
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /col */}
              </div>
              {/* /row */}
            </div>
            {/* /booking-room-info-area */}
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
    </RoveroLayout>
  );
};
export default page;
