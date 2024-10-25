"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RoveroLayout from "@/layouts/RoveroLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useCheckout } from '../../contexts/CheckoutContext';
import { useAuth } from '../../contexts/AuthContext';
import RoomSelector from '../../components/RoomSelector';

const Page = () => {
  const router = useRouter();
  const { 
    roomId = 'standard-001', 
    addons, 
    checkInDate = new Date().toISOString().split('T')[0], 
    checkOutDate = new Date(Date.now() + 86400000).toISOString().split('T')[0], 
    guestCount = 1, 
    userInfo, 
    updateRoomId, 
    updateAddon, 
    updateCheckInDate, 
    updateCheckOutDate, 
    updateGuestCount, 
    updateUserInfo 
  } = useCheckout();
  const { user } = useAuth();
  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    addonTotal: 0,
    total: 0,
    discountedTotal: 0,
    basePrice: 0,
    nights: 0,
    couponDiscount: 0,
    couponCode: ''
  });
  const [maxGuests, setMaxGuests] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  const fetchAvailableRooms = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/available-rooms');
      if (!response.ok) throw new Error('Failed to fetch available rooms');
      const data = await response.json();
      setAvailableRooms(data);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms([]); // Set to empty array in case of error
    }
  }, []);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

  useEffect(() => {
    if (user) {
      ['firstName', 'lastName', 'email', 'phoneNo', 'address', 'city', 'country', 'zipCode'].forEach(field => {
        updateUserInfo(field, user[field] || '');
      });
    }
  }, [user, updateUserInfo]);

  const fetchTotal = useCallback(async () => {
    if (!roomId || !checkInDate || !checkOutDate) return;

    try {
      const response = await fetch('http://localhost:8080/calculate-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId, 
          checkInDate, 
          checkOutDate, 
          guestCount,
          addons,
          couponCode: userInfo.couponCode || ''
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch total');

      const data = await response.json();
      setPriceDetails({
        subtotal: data.subtotal,
        addonTotal: data.addonTotal,
        total: data.total,
        discountedTotal: data.discountedTotal,
        basePrice: data.basePricePerNight,
        nights: data.numberOfNights,
        couponDiscount: data.total - data.discountedTotal,
        couponCode: userInfo.couponCode || ''
      });
    } catch (error) {
      console.error('Error fetching total:', error);
    }
  }, [roomId, addons, checkInDate, checkOutDate, guestCount, userInfo.couponCode]);

  useEffect(() => {
    fetchTotal();
  }, [roomId, addons, checkInDate, checkOutDate, guestCount, fetchTotal]);

  useEffect(() => {
    const fetchMaxGuests = async () => {
      try {
        const response = await fetch(`http://localhost:8080/get-max-guests?roomId=${roomId || 'standard-001'}`);
        if (!response.ok) throw new Error('Server responded with an error');
        const data = await response.json();
        setMaxGuests(data.maxGuests);
      } catch (error) {
        console.error('Error fetching max guests:', error);
        setMaxGuests(5);
      }
    };

    fetchMaxGuests();

    if (!roomId) updateRoomId('standard-001');
  }, []);

  const handleAddonChange = (key, value) => {
    updateAddon(key, value);
    fetchTotal();
  };

  useEffect(() => {
    const selected = availableRooms.find(room => room.id === roomId);
    setSelectedRoomDetails(selected || null);
  }, [roomId, availableRooms]);

  const handleBookNow = async (e) => {
    e.preventDefault();
    setBookingError(null);

    try {
      const response = await fetch('http://localhost:8080/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          addons,
          checkInDate,
          checkOutDate,
          guestCount,
          userInfo,
          couponCode: userInfo.couponCode || '',
          total: priceDetails.discountedTotal
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      const bookingInfo = {
        ...data,
        userInfo,
        addons,
        checkInDate,
        checkOutDate,
        guestCount,
        priceDetails
      };

      localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));

      router.push('/checkout');
    } catch (error) {
      console.error('Error during booking:', error);
      setBookingError(error.message);
    }
  };

  const handleRoomSelect = (roomId) => {
    // Handle room selection, update state, etc.
    console.log('Selected room:', roomId);
  };

  return (
    <RoveroLayout>
      <Breadcrumb pageName="Booking" bgImage="/images/bg/booking-hero.jpg" pageTitle="Booking" />
      <div className={`booking-page-area mt-120 mb-120 ${showPopup ? 'blur' : ''}`}>
        <div className="container">
          <div className="row booking-page-wrapper">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="booking-page-content">
                <RoomSelector
                  rooms={availableRooms}
                  selectedRoom={roomId}
                  onSelectRoom={(id) => {
                    updateRoomId(id);
                    fetchTotal();
                  }}
                />
                <div className="booking-extra-service bp-cnt-ex-ser rp-service mt-50">
                  <h2 className="mb-30">Add Extra Service</h2>
                  <ul>
                    {Object.entries(addons).map(([key, value]) => (
                      <li key={key}>
                        <div className="d-flex mb-10 align-items-center">
                          {key === 'view' ? (
                            <div className="w-100">
                              <div className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="option-input radio"
                                  name={`add-${key}`}
                                  checked={value !== ''}
                                  onChange={(e) => handleAddonChange(key, e.target.checked ? 'River View' : '')}
                                />
                                <span className="ml-20">
                                  <span className="main-color">Add View : </span>
                                  $10 ( Room / Night ) = $10
                                </span>
                              </div>
                              {value !== '' && (
                                <div className="mt-2 ml-4">
                                  <select
                                    className="form-select"
                                    value={value}
                                    onChange={(e) => handleAddonChange(key, e.target.value)}
                                  >
                                    <option value="River View">River View</option>
                                    <option value="Forest View">Forest View</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <input
                                type="checkbox"
                                className="option-input radio"
                                name={key}
                                checked={value}
                                onChange={(e) => handleAddonChange(key, e.target.checked)}
                              />
                              <span className="ml-20">
                                <span className="main-color">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} : </span>
                                $10 ( Room / Night ) = $10
                              </span>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="booking-your-info-area mt-40">
                  <div className="row booking-info-header justify-content-between">
                    <div className="col-xl-5 col-lg- col-md- col-sm- col- pr-sm-0">
                      <h2 className="mb-30">Booking Information</h2>
                    </div>
                    <div className="col-xl-7 col-lg- col-md- col-sm- col-">
                      <div className="booking-login-info w-100">
                        {!user && (
                          <p className="mb-25 text-md-right">
                            Already Registered ? <Link href="/login" className="main-color cursor-pointer f-700 ml-2 pb-1">login</Link>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {user && (
                    <div className="logged-in-message mb-4">
                      <p>You are logged in as {user.username}. Your account information has been prefilled below.</p>
                    </div>
                  )}
                  <div className="checkbox-form">
                    <form onSubmit={handleBookNow}>
                      <div className="row">
                        {['firstName', 'lastName', 'email', 'phoneNo', 'address', 'city', 'country', 'zipCode'].map((field) => (
                          <div key={field} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 px-md-2">
                            <div className="checkout-form-list mb-3">
                              <input
                                type={field === 'email' ? 'email' : 'text'}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                className="w-100"
                                value={userInfo[field]}
                                onChange={(e) => updateUserInfo(field, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 px-md-2">
                          <textarea
                            className="massage w-100 primary-border pl-20 pt-20"
                            name="inputMessage"
                            id="inputMessage"
                            placeholder="Additional message"
                            value={userInfo.additionalMessage}
                            onChange={(e) => updateUserInfo('additionalMessage', e.target.value)}
                          />
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-md-2">
                          <div className="cupon-code mb-3">
                            <input
                              type="text"
                              placeholder="Coupon Code"
                              className="w-100"
                              value={userInfo.couponCode || ''}
                              onChange={(e) => {
                                updateUserInfo('couponCode', e.target.value);
                                fetchTotal(); // Recalculate total when coupon changes
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-md-2">
                          <div className="my-btn w-100">
                            <button
                              className="btn theme-bg text-uppercase rounded-0 f-500"
                              type="submit"
                            >
                              book now
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="row booking-page-left-sidebar mt-5 mt-lg-0 pt-1 pt-md-3 pt-lg-0">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-widget sidebar-search-area rp-booking-area section-bg pl-30 pr-30 pt-45 pb-45">
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Total</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ₱{priceDetails.discountedTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Subtotal</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ₱{priceDetails.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Coupon Discount</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ₱{priceDetails.couponDiscount.toLocaleString()}
                      </span>
                    </div>
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Addon Total</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ₱{priceDetails.addonTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Base Price per Night</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        ₱{priceDetails.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="rpb-price text-center mb-25">
                      <span className="d-block text-color">Number of Nights</span>
                      <span className="room-price d-block f-700 main-color fontNoto text-uppercase">
                        {priceDetails.nights}
                      </span>
                    </div>
                    <div className="form-hotel-search pb-50">
                      <form>
                        <label htmlFor="checkIn" className="meta-text-color d-block fontNoto f-700 mb-10 mt-35">
                          CHECK IN
                        </label>
                        <div className="check-in mb-25 position-relative">
                          <input
                            type="date"
                            className="datepicker primary-color w-100"
                            id="checkIn"
                            value={checkInDate}
                            onChange={(e) => {
                              updateCheckInDate(e.target.value);
                              fetchTotal();
                            }}
                          />
                        </div>
                        <label htmlFor="checkOut" className="meta-text-color d-block fontNoto f-700 mb-10 mt-35">
                          CHECK OUT
                        </label>
                        <div className="check-out mb-40 position-relative">
                          <input
                            type="date"
                            className="datepicker primary-color w-100"
                            id="checkOut"
                            value={checkOutDate}
                            onChange={(e) => {
                              updateCheckOutDate(e.target.value);
                              fetchTotal();
                            }}
                          />
                        </div>
                        <div className="check-guests-form">
                          <div className="course-filter">
                            <label htmlFor="guestCount" className="main-color d-block fontNoto f-700 mb-10">
                              GUESTS
                            </label>
                            <input
                              type="number"
                              id="guestCount"
                              className="white-bg primary-color w-100 border-0 pl-0 rounded-0 mb-25"
                              value={guestCount}
                              onChange={(e) => updateGuestCount(Math.min(parseInt(e.target.value), maxGuests))}
                              min="1"
                              max={maxGuests}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {bookingError && (
        <div className="alert alert-danger mt-3" role="alert">
          Booking Error: {bookingError}
        </div>
      )}
    </RoveroLayout>
  );
};

export default Page;