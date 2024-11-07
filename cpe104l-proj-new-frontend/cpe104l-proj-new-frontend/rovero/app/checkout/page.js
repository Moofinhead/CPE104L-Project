"use client";
import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserInfo } from "@/components/checkout/userInfo";
import { PaymentMethods } from "@/components/checkout/paymentMethods";
import { PriceDetails } from "@/components/checkout/priceDetails";

const CheckoutPage = () => {
  const [bookingInfo, setBookingInfo] = useState(null); // state for booking info, success popup, payment method
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem('bookingInfo'));
    console.log('Booking data retrieved:', bookingData);
    if (bookingData) setBookingInfo(bookingData); // retrieve booking data from local storage
  }, []);

  const handlePayNow = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const bookingData = JSON.parse(localStorage.getItem('bookingInfo'));
      console.log('Current booking data:', bookingData);
      
      // Calculate total with coupon
      const calculateTotalResponse = await fetch('http://localhost:8080/calculate-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guestCount: bookingData.guestCount,
          addons: bookingData.addons,
          couponCode: bookingData.userInfo.couponCode || ''
        }),
      });

      const priceDetails = await calculateTotalResponse.json();
      console.log('Price details received:', priceDetails);

      // Keep the exact structure from the server
      const updatedBookingData = {
        ...bookingData,
        priceDetails: priceDetails, // Use the server response directly
        paymentMethod: selectedPaymentMethod,
        bookingTime: new Date().toISOString()
      };

      console.log('Updated booking data:', updatedBookingData);

      // Now make the booking with updated price details
      const response = await fetch('http://localhost:8080/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      // Update localStorage and state with the final booking info
      const finalBookingInfo = {
        ...updatedBookingData,
        ...data
      };

      localStorage.setItem('bookingInfo', JSON.stringify(finalBookingInfo));
      setBookingInfo(finalBookingInfo);
      setShowPopup(true);
    } catch (error) {
      console.error('Error during booking:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push('/'); // close popup, redirect to homepage
  };

  const handleBackToBooking = () => {
    // Keep the existing booking info in localStorage when going back
    // It's already there from the previous booking step
    router.push('/booking');
  };

  if (!bookingInfo) return <div>Loading...</div>; // show loading if no booking data

  return (
    <RoveroLayout>
      <Breadcrumb 
        pageName="Checkout"
        bgImage="images/bg/booking-hero.jpg"
        pageTitle="Checkout" 
        pageSubTitle="Finalize and Reserve Your Room"
      />
      <div className="booking-page-area checkout-page mt-120 mb-120">
        <div className="container">
          <div className="row booking-page-wrapper">
            <div className="col-xl-8">
              <UserInfo userInfo={bookingInfo.userInfo} additionalMessage={bookingInfo.additionalMessage} /> {/* user info display */}
              <PaymentMethods 
                selectedPaymentMethod={selectedPaymentMethod} 
                setSelectedPaymentMethod={setSelectedPaymentMethod} 
              /> {/* payment methods */}
              <PaymentButton 
                handlePayNow={handlePayNow} 
                selectedPaymentMethod={selectedPaymentMethod} 
                isProcessing={isProcessing}
                error={error}
                handleBackToBooking={handleBackToBooking}
              /> {/* payment button */}
            </div>
            <div className="col-xl-4">
              <PriceDetails bookingInfo={bookingInfo} /> {/* price details */}
            </div>
          </div>
        </div>
      </div>

      {showPopup && <BookingPopup bookingInfo={bookingInfo} onClose={handleClosePopup} />} {/* success popup */}
    </RoveroLayout>
  );
};

const PaymentButton = ({ handlePayNow, selectedPaymentMethod, isProcessing, error, handleBackToBooking }) => (
  <div className="my-btn d-block mt-45">
    <button 
      onClick={handlePayNow} 
      className={`btn theme-bg ${!selectedPaymentMethod || isProcessing ? 'disabled' : ''}`} 
      disabled={!selectedPaymentMethod || isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Pay Now'}
    </button>
    {!selectedPaymentMethod && (
      <span className="text-danger ml-3">Please select a payment method.</span>
    )}
    {error && (
      <span className="text-danger ml-3">{error}</span>
    )}
    <button 
      onClick={handleBackToBooking}
      className="btn outline-btn ml-3"
    >
      Back to Booking
    </button>
  </div>
);

const BookingPopup = ({ bookingInfo, onClose }) => {
  const finalTotal = bookingInfo.priceDetails.discountedTotal === 0 
    ? bookingInfo.priceDetails.discountedTotal 
    : bookingInfo.priceDetails.total;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Booking Successful!</h2>
        <p>Thank you for your booking. Here are your booking details:</p>
        <ul>
          <li>Booking ID: {bookingInfo.bookingId}</li>
          <li>Booking Time: {new Date(bookingInfo.bookingTime).toLocaleString()}</li>
          <li>Room ID: {bookingInfo.roomId}</li>
          <li>Total: ₱{finalTotal}</li>
          {bookingInfo.priceDetails.total !== bookingInfo.priceDetails.discountedTotal && (
            <>
              <li>Original Price: ₱{bookingInfo.priceDetails.total}</li>
              <li>Discount Applied: ₱{bookingInfo.priceDetails.total - bookingInfo.priceDetails.discountedTotal}</li>
            </>
          )}
        </ul>
        <p>{bookingInfo.message}</p>
        <button onClick={onClose} className="btn theme-bg">
          Close
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;