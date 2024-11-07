import { useState, useEffect } from 'react';
import { GuestCountInput } from './guestCountInput';

export const SidebarPriceDetails = ({
  priceDetails,
  guestCount,
  maxGuests,
  updateGuestCount,
  dateInputs,
  addons,
  handleAddonChange
}) => {
  return (
    <div className="sidebar-widget sidebar-search-area rp-booking-area section-bg pl-30 pr-30 pt-45 pb-45">
      <PriceDetail label="Total" amount={priceDetails.discountedTotal} />
      <PriceDetail label="Original Price" amount={priceDetails.total} />
      {priceDetails.total !== priceDetails.discountedTotal && (
        <PriceDetail 
          label="Coupon Discount" 
          amount={priceDetails.total - priceDetails.discountedTotal} 
        />
      )}
      <PriceDetail 
        label="Base Price per Night" 
        amount={priceDetails.basePricePerNight}
      />
      <PriceDetail 
        label="Number of Nights" 
        amount={priceDetails.numberOfNights}
        isInteger 
      />
      <form>
        {dateInputs()}
        <GuestCountInput 
          guestCount={guestCount}
          maxGuests={maxGuests}
          updateGuestCount={updateGuestCount}
        />
      </form>
    </div>
  );
};

const PriceDetail = ({ label, amount, isInteger }) => (
  <div className="d-flex justify-content-between mt-2">
    <span>{label}:</span>
    <span className="font-weight-bold">
      {isInteger 
        ? amount
        : `₱${amount?.toFixed(2) || '0.00'}`
      }
    </span>
  </div>
);