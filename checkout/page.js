"use client";

import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const [bookingInfo, setBookingInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve booking info from router or local storage
    const bookingData = JSON.parse(localStorage.getItem('bookingInfo'));
    if (bookingData) {
      setBookingInfo(bookingData);
    }
  }, []);

  const handlePayNow = () => {
    // Here you would typically handle the payment process
    // For now, we'll just show the confirmation popup
    setShowPopup(true);
  };

  if (!bookingInfo) return <div>Loading...</div>;

  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="Checkout"
        bgImage="images/bg/booking-hero.jpg"
        pageTitle="Checkout"
      />
      <div className="booking-page-area checkout-page mt-120 mb-120">
        <div className="container">
          <div className="row booking-page-wrapper">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="booking-page-content">
                <div className="checkout-your-info-area mt-40">
                  <h2 className="mb-30">Your Information</h2>
                  <ul>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">First name :</span>{" "}
                      {bookingInfo.userInfo.firstName}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Last name :</span>{" "}
                      {bookingInfo.userInfo.lastName}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Email address :</span>{" "}
                      {bookingInfo.userInfo.email}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Phone no :</span>{" "}
                      {bookingInfo.userInfo.phoneNo}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Address :</span>{" "}
                      {bookingInfo.userInfo.address}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">City :</span>{" "}
                      {bookingInfo.userInfo.city}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Country :</span>{" "}
                      {bookingInfo.userInfo.country}
                    </li>
                    <li className="text-color d-inline-block mb-15">
                      <span className="main-color d-inline-block">Zip code :</span>{" "}
                      {bookingInfo.userInfo.zipCode}
                    </li>
                  </ul>
                  {bookingInfo.additionalMessage && (
                    <ul>
                      <li className="d-block mb-15 w-100">
                        <span>Additional message :</span>
                        <p className="mb-0 mt-2">{bookingInfo.additionalMessage}</p>
                      </li>
                    </ul>
                  )}
                  {bookingInfo.couponCode && (
                    <ul>
                      <li className="text-color d-block mb-15 w-100">
                        <span className="main-color d-inline-block">Coupon code :</span>{" "}
                        {bookingInfo.couponCode}
                      </li>
                    </ul>
                  )}
                </div>
                <div className="payment-method mt-40">
                  <h2 className="mb-22">Payment Options</h2>
                  <ul>
                    <li>
                      <div className="d-flex align-items-center mb-10">
                        <input type="radio" name="paymentMethod" value="cash" />
                        <span className="main-color pl-20">Cash on Spot</span>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center mb-3">
                        <input type="radio" name="paymentMethod" value="bank" />
                        <span className="main-color pl-15">Bank Transfer</span>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center mb-3">
                        <input type="radio" name="paymentMethod" value="credit" />
                        <span className="main-color pl-15">Credit Card</span>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center mb-3">
                        <input type="radio" name="paymentMethod" value="paypal" />
                        <span className="main-color pl-15">Paypal</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="my-btn d-block mt-45">
                  <button onClick={handlePayNow} className="btn theme-bg">
                    pay now
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="row booking-page-left-sidebar mt-5 mt-lg-0 pt-3 pt-lg-0">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget sidebar-search-area rp-booking-area section-bg pl-30 pr-30 pt-50 pb-45">
                    <div className="rpb-price text-center">
                      <span className="d-block text-color">sub total</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ${bookingInfo.total}
                      </span>
                    </div>
                    <div className="form-hotel-search pb-50">
                      <div>
                        <label className="meta-text-color d-block fontNoto f-700 mb-10 mt-35">
                          CHECK IN
                        </label>
                        <div className="check-in mb-25 position-relative">
                          {bookingInfo.checkInDate}
                        </div>
                      </div>
                      <div>
                        <label className="meta-text-color d-block fontNoto f-700 mb-10 mt-35">
                          CHECK OUT
                        </label>
                        <div className="check-out mb-40 position-relative">
                          {bookingInfo.checkOutDate}
                        </div>
                      </div>
                      <div className="check-guests-form">
                        <div className="course-filter">
                          <label className="main-color d-block fontNoto f-700 mb-10">
                            GUESTS
                          </label>
                          <div className="mb-25">
                            {bookingInfo.guestCount}
                          </div>
                        </div>
                      </div>
                    </div>
                    {Array.isArray(bookingInfo.addons) && bookingInfo.addons.length > 0 ? (
                      <div className="sidebar-widget checkout-ex-service">
                        <h5 className="sidebar-title f-700 fontNoto text-uppercase mb-22 mr-xl-2 d-inline-block">
                          Extra Service
                        </h5>
                        <ul>
                          {bookingInfo.addons.map((addon, index) => (
                            <li key={index} className="d-flex align-items-center justify-content-between mb-12">
                              <div className="d-flex align-items-center">
                                <img src={`images/icon/check-ser-icon${index + 1}.png`} alt="" className="rd-info-icon" />
                                <span className="d-inline-block text-color ml-20">{addon}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Booking Successful!</h2>
            <p>Thank you for your booking. Here are your booking details:</p>
            <ul>
              <li>Booking ID: {bookingInfo.bookingId}</li>
              <li>Booking Time: {bookingInfo.bookingTime}</li>
              <li>Room ID: {bookingInfo.roomId}</li>
              <li>Total: ₱{bookingInfo.total}</li>
            </ul>
            <p>{bookingInfo.message}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </RoveroLayout>
  );
};

export default CheckoutPage;
