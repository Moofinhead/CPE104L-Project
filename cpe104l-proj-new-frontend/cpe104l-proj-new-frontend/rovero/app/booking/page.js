"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import RoveroLayout from "@/layouts/RoveroLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useCheckout } from '@/contexts/CheckoutContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAvailableRooms } from '@/components/booking/fetchAvailableRooms';
import { useRouter } from 'next/navigation';
import { Loading, BookingContent, BookingError } from '@/components/booking/bookingComponents';
import { prefillUserInfo } from '@/components/booking/prefillUserInfo';
import "react-datepicker/dist/react-datepicker.css";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { // default values checkout context
    roomId = 'standard-001',
    addons,
    guestCount = 1,
    userInfo = {},
    updateRoomId,
    updateAddon,
    updateGuestCount,
    updateUserInfo
  } = useCheckout();

  const [state, setState] = useState({ // booking state management
    showPopup: false,
    bookingError: null,
    isLoading: false,
    availableRooms: []
  });

  const [maxGuests, setMaxGuests] = useState(5); // room-handling states
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  
  const [priceDetails, setPriceDetails] = useState({ // price-handling states
    addonTotal: 0,
    total: 0,
    discountedTotal: 0,
    basePrice: 0,
    nights: 0,
    couponDiscount: 0,
    couponCode: ''
  });
  
  const [checkInDate, setCheckInDate] = useState(''); // date-handling states and variables
  const [checkOutDate, setCheckOutDate] = useState('');
  const today = new Date().toISOString().split("T")[0];
  const defaultCheckOutMinDate = new Date(new Date().setDate(new Date().getDate() + 1))
  .toISOString()
  .split("T")[0];

  const couponDebounceTimer = useRef(null);

  const localUserInfo = useRef({
    ...userInfo,
    couponCode: userInfo.couponCode || ''
  });

  const handleUserInfoChange = (field, value) => {
    if (field === 'couponCode') {
      // Clear any existing timer
      if (couponDebounceTimer.current) {
        clearTimeout(couponDebounceTimer.current);
      }

      // Set new timer for coupon updates
      couponDebounceTimer.current = setTimeout(() => {
        // Get the current value directly from the input field
        const currentCouponValue = document.querySelector('input[name="couponCode"]')?.value || '';
        updateUserInfo('couponCode', currentCouponValue);
        fetchTotal(currentCouponValue); // Pass the current value directly
      }, 3000);
    } else {
      // For non-coupon fields, update immediately
      updateUserInfo(field, value);
    }
  };

  const fetchTotal = useCallback(async (couponCode) => {
    if (!roomId || !checkInDate || !checkOutDate) {
      setPriceDetails({
        addonTotal: 0,
        total: 0,
        discountedTotal: 0,
        basePrice: 0,
        nights: 0,
        couponDiscount: 0,
        couponCode: ''
      });
      return;
    }

    try {
      const requestBody = {
        roomId,
        checkInDate,
        checkOutDate,
        guestCount,
        addons,
        couponCode: userInfo.couponCode || ''
      };

      const response = await fetch('http://localhost:8080/calculate-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to fetch total');

      const data = await response.json();
      setPriceDetails(data);
    } catch (error) {
      console.error('Error fetching total:', error);
      setPriceDetails({
        addonTotal: 0,
        total: 0,
        discountedTotal: 0,
        basePrice: 0,
        nights: 0,
        couponDiscount: 0,
        couponCode: ''
      });
    }
  }, [roomId, addons, checkInDate, checkOutDate, guestCount, userInfo.couponCode]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (couponDebounceTimer.current) {
        clearTimeout(couponDebounceTimer.current);
      }
    };
  }, []);

  const handleAddonChange = (key, value) => {
    updateAddon(key, value); // update selected addon/s
    fetchTotal(); // recalculate total price
  };

  const [formErrors, setFormErrors] = useState({});

  const validateBookingForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!roomId) errors.room = 'Please select a room';
    if (!checkInDate) errors.checkIn = 'Please select check-in date';
    if (!checkOutDate) errors.checkOut = 'Please select check-out date';
    if (!guestCount || guestCount < 1) errors.guestCount = 'Please specify number of guests';
    
    // User info validation
    if (!userInfo.firstName?.trim()) errors.firstName = 'First name is required';
    if (!userInfo.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!userInfo.email?.trim()) errors.email = 'Email is required';
    if (!userInfo.phoneNo?.trim()) errors.phoneNo = 'Phone number is required';
    if (!userInfo.address?.trim()) errors.address = 'Address is required';
    if (!userInfo.city?.trim()) errors.city = 'City is required';
    if (!userInfo.country?.trim()) errors.country = 'Country is required';
    if (!userInfo.zipCode?.trim()) errors.zipCode = 'Zip code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // returns true if no errors
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    setBookingError(null);

    // Validate form before proceeding
    if (!validateBookingForm()) {
      setBookingError('Please fill in all required fields');
      return;
    }

    // Store booking info in localStorage without sending to server yet
    const bookingInfo = {
      roomId,
      addons,
      checkInDate,
      checkOutDate,
      guestCount,
      userInfo,
      priceDetails,
      bookingTime: new Date().toISOString() // Add booking time
    };

    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    router.push('/checkout');
  };

  const handleRoomSelect = (roomId) => {
    updateRoomId(roomId); // update selected room and find its details
    const selectedRoom = availableRooms.find(room => room.id === roomId);
    if (selectedRoom) { // set details and update maximum guests allowed
      setSelectedRoomDetails(selectedRoom); 
      setMaxGuests(selectedRoom.maxGuests || 5); 
    }
  };

  const handleCheckInDateChange = (event) => { // get and update selected check-in
    const selectedDate = event.target.value;
    setCheckInDate(selectedDate);

    // Reset checkout date when checkin changes
    setCheckOutDate('');
    document.getElementById('checkOut').setAttribute(
      'min', 
      new Date(selectedDate)
        .setDate(new Date(selectedDate).getDate() + 1)
        .toISOString()
        .split("T")[0]
    );
  };

  const handleCheckOutDateChange = (event) => {
    const selectedDate = event.target.value;
    setCheckOutDate(selectedDate);
    
    // Only check availability when both dates are set
    if (checkInDate && selectedDate) {
      checkRoomAvailability();
    }
  };

  const [roomAvailability, setRoomAvailability] = useState({});

  const checkRoomAvailability = useCallback(async () => {
    if (!checkInDate || !checkOutDate) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`http://localhost:8080/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
      if (!response.ok) throw new Error('Failed to fetch available rooms');

      const data = await response.json();
      setState(prev => ({
        ...prev,
        isLoading: false,
        availableRooms: data
      }));

      // If current roomId is not available, clear it
      if (roomId && !data.some(room => room.id === roomId)) {
        updateRoomId('');
      }
    } catch (error) {
      console.error('Error checking room availability:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        availableRooms: [],
        bookingError: 'Failed to fetch available rooms'
      }));
    }
  }, [checkInDate, checkOutDate, roomId]);
  
  const dateInputs = () => (
    <div className="date-picker-container">
      <label htmlFor="checkIn" style={{ paddingTop: '10px' }}>Check-In Date:</label>
      <input
        type="date"
        id="checkIn"
        value={checkInDate}
        onChange={handleCheckInDateChange}
        min={today}
        className="form-control"
      /> {/* check-int date input */}

      <label htmlFor="checkOut" style={{ paddingTop: '10px' }}>Check-Out Date:</label>
      <input
        type="date"
        id="checkOut"
        value={checkOutDate}
        onChange={handleCheckOutDateChange}
        min={checkInDate ? new Date(new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 1))
          .toISOString()
          .split("T")[0] : defaultCheckOutMinDate}
        className="form-control"
      /> {/* check-out date input */}
    </div> // date picker inputs 
  );

  useEffect(() => { // fetch total price whenever dependencies change
    fetchTotal();
  }, [roomId, addons, checkInDate, checkOutDate, guestCount, fetchTotal]);

  useEffect(() => { // fetch max guests allowed for the selected room
    const fetchMaxGuests = async () => {
      try {
        const response = await fetch(`http://localhost:8080/get-max-guests?roomId=${roomId || 'standard-001'}`);
        if (!response.ok) throw new Error('Server responded with an error');
        const data = await response.json();
        setMaxGuests(data.maxGuests); // update max guests
      } catch (error) {
        console.error('Error fetching max guests:', error);
        setMaxGuests(5); // default at error
      }
    };

    fetchMaxGuests(); 
    if (!roomId) updateRoomId('standard-001'); // default at no selection
  }, []); // run on mount

  useEffect(() => { // update selected room details based on the current roomId
    const selected = availableRooms.find(room => room.id === roomId);
    setSelectedRoomDetails(selected || null); // set null if not found
  }, [roomId, availableRooms]);

  useEffect(() => { // fetch available rooms on mount
    fetchAvailableRooms();
  }, []); 

  useEffect(() => { // check room availability given check-in and check-out dates
    if (checkInDate && checkOutDate) {
      checkRoomAvailability();
    }
  }, [checkInDate, checkOutDate, checkRoomAvailability]);
  
  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (user && !hasPrefilled) {
      prefillUserInfo(user, userInfo, updateUserInfo);
      setHasPrefilled(true);
    }
  }, [user, userInfo, updateUserInfo, hasPrefilled]);
  
  console.log('Page userInfo:', userInfo);

  useEffect(() => {
    const savedBookingData = JSON.parse(localStorage.getItem('bookingInfo'));
    if (savedBookingData) {
      // Restore all the saved data
      updateRoomId(savedBookingData.roomId);
      setCheckInDate(savedBookingData.checkInDate);
      setCheckOutDate(savedBookingData.checkOutDate);
      updateGuestCount(savedBookingData.guestCount);
      
      // Restore addons if they exist
      if (savedBookingData.addons) {
        Object.entries(savedBookingData.addons).forEach(([key, value]) => {
          updateAddon(key, value);
        });
      }

      // Restore user info
      if (savedBookingData.userInfo) {
        Object.entries(savedBookingData.userInfo).forEach(([key, value]) => {
          updateUserInfo(key, value || '');
        });
      }

      // Restore price details if they exist
      if (savedBookingData.priceDetails) {
        setPriceDetails(savedBookingData.priceDetails);
      }
    }
  }, []); // Run once on component mount

  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="Booking"
        bgImage="/images/bg/booking-hero.jpg"
        pageTitle="Booking"
        pageSubTitle="Select and Reserve Your Preferred Type of Room"
      /> { /* end breadcrumb */}
      <div className={`booking-page-area mt-120 mb-120 ${state.showPopup ? 'blur' : ''}`}> {/* booking page based on popup state */}
        <div className="container">
          {state.isLoading ? (
            <Loading /> // load while fetching data
          ) : (
            <BookingContent // render contents
              user={user}
              availableRooms={state.availableRooms}
              roomId={roomId}
              addons={addons}
              handleAddonChange={handleAddonChange}
              userInfo={userInfo}
              updateUserInfo={updateUserInfo}
              handleBookNow={handleBookNow}
              fetchTotal={fetchTotal}
              priceDetails={priceDetails}
              dateInputs={dateInputs}
              guestCount={guestCount}
              maxGuests={maxGuests}
              updateGuestCount={updateGuestCount}
              onSelectRoom={handleRoomSelect}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              roomAvailability={roomAvailability}
              formErrors={formErrors}
              bookingError={bookingError}
              setFormErrors={setFormErrors}
            />
          )}
        </div>
        {state.bookingError && <BookingError message={state.bookingError} />} {/* error at empty render */}
      </div>
    </RoveroLayout>
  );
};

export default Page;

const loadAvailableRooms = async (roomId, setState) => {
  setState(prevState => ({ ...prevState, isLoading: true })); // show loading screen until data is fetched
  try { // fetch rooms based on the selected roomId
    const { availableRooms, selectedRoom } = await fetchAvailableRooms(roomId);
    setState({ // update management states
      showPopup: false,
      bookingError: null,
      isLoading: false,
      availableRooms,
      selectedRoomDetails: selectedRoom,
    });
  } catch (error) { // update mangaement states at error
    setState(prevState => ({
      ...prevState,
      isLoading: false,
      bookingError: error.message,
    }));
  }
};