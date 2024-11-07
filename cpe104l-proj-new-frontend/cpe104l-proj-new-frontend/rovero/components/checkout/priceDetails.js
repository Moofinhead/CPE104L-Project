export const PriceDetails = ({ bookingInfo }) => {
  // Debug log to see what we're receiving
  console.log('Booking info received:', bookingInfo);
  console.log('Price details:', bookingInfo?.priceDetails);

  // Safely access nested properties
  const priceDetails = bookingInfo?.priceDetails || {};
  
  return (
    <div className="sidebar-widget sidebar-search-area rp-booking-area section-bg pl-30 pr-30 pt-50">
      <div className="rpb-price text-center">
        <span className="d-block text-color">Total Price</span>
        <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
          ₱{priceDetails.discountedTotal}
        </span>
      </div>
      <div className="form-hotel-search pb-50">
        <div className="row">
          <div className="col-12">
            <div className="booking-details">
              <p><strong>Total:</strong> ₱{priceDetails.discountedTotal}</p>
              <p><strong>Subtotal:</strong> ₱{priceDetails.subtotal}</p>
              {priceDetails.total !== priceDetails.discountedTotal && (
                <p>
                  <strong>Coupon Discount:</strong> ₱{priceDetails.total - priceDetails.discountedTotal}
                </p>
              )}
              <p><strong>Base Price per Night:</strong> ₱{priceDetails.basePricePerNight}</p>
              <p><strong>Number of Nights:</strong> {priceDetails.numberOfNights}</p>
              <p><strong>Check-In Date:</strong> {bookingInfo?.checkInDate}</p>
              <p><strong>Check-Out Date:</strong> {bookingInfo?.checkOutDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
