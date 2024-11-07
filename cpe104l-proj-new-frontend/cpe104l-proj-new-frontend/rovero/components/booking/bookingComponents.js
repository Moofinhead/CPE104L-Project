import RoomSelector from './RoomSelector';
import { BookingInfoSection } from './bookingInfoSection';
import { SidebarPriceDetails } from './priceDetails';
import { ExtraServicesSection } from './extraServices';
import { useState, useRef, useEffect } from 'react';

export const Loading = () => ( // loading message render
  <div className="text-center">Loading rooms...</div> 
);

export const BookingError = ({ message }) => ( // error message render
  <div className="booking-error">
    <p style={{ color: 'red' }}>{message}</p>
  </div>
);

export const BookingContent = ({ // booking contents render
  user, availableRooms, roomId, addons, handleAddonChange,
  userInfo, updateUserInfo, handleBookNow, fetchTotal, priceDetails,
  dateInputs, guestCount, updateGuestCount, maxGuests, onSelectRoom,
  checkInDate,
  checkOutDate,
  formErrors,
  bookingError,
}) => {
  console.log('BookingContent userInfo:', userInfo);

  return (
    <div className="row booking-page-wrapper">
      <div className="col-xl-8">
        <div className="booking-page-content">
          <RoomSelectorSection
            availableRooms={availableRooms} 
            roomId={roomId} 
            onSelectRoom={onSelectRoom} 
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
          /> {/* room selection */}

          <BookingInfoSection
            user={user} 
            userInfo={userInfo}
            updateUserInfo={updateUserInfo}
            handleBookNow={handleBookNow}
            fetchTotal={fetchTotal}
            formErrors={formErrors}
          /> {/* user booking information */}
        </div> {/* booking details */}
      </div>

      <div className="col-xl-4"> 
        <SidebarPriceDetails
          priceDetails={priceDetails} 
          dateInputs={dateInputs}
          guestCount={guestCount}
          maxGuests={maxGuests}
          updateGuestCount={updateGuestCount} 
        /> {/* price details display */}
      </div>
    </div>
  );
};

const RoomSelectorSection = ({ availableRooms, roomId, onSelectRoom, checkInDate, checkOutDate }) => ( // use RoomSeleection in room selection render
  <div className="room-selector-container">
    {availableRooms.length ? ( // check if there are available rooms
      <RoomSelector 
        rooms={availableRooms} // Pass available rooms to RoomSelector
        selectedRoom={roomId} // Pass the currently selected room ID
        onSelectRoom={onSelectRoom} // Function to handle room selection
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />
    ) : ( // message if no rooms are available
      <div className="no-rooms-message">No rooms available for the selected dates</div> 
    )}
  </div> // container for room selection display
);

export const FormInput = ({ 
  type, 
  value = '',
  onChange, 
  placeholder, 
  pattern, 
  required,
  validationMessage,
  error  // Add this to handle empty field errors
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef(null);

  const handleInvalid = (e) => {
    e.preventDefault();
    setShowTooltip(true);
  };

  const handleInput = (e) => {
    setShowTooltip(false);
    onChange(e);
  };

  // Show tooltip if there's an error
  useEffect(() => {
    if (error) {
      setShowTooltip(true);
    }
  }, [error]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="form-group position-relative">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleInput}
        onInvalid={handleInvalid}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
        className={`form-control ${error ? 'error' : ''}`}
      />
      {(showTooltip || error) && (
        <div className="validation-tooltip">
          {error || validationMessage}
        </div>
      )}
    </div>
  );
};
