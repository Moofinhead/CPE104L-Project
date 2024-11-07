'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CheckoutContext = createContext({
  roomId: '',
  addons: {},
  checkInDate: '',
  checkOutDate: '',
  guestCount: 1,
  userInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    additionalMessage: '',
    cuponCode: ''
  },
  updateRoomId: () => {},
  updateAddon: () => {},
  updateCheckInDate: () => {},
  updateCheckOutDate: () => {},
  updateGuestCount: () => {},
  updateUserInfo: () => {},
});

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [addons, setAddons] = useState({
    enableWifi: false,
    smookingZone: false,
    view: 'None',
    serviceGuide: false,
    dinner: false,
    petAllowed: false,
    swimmingPool: false,
    breakfastBuffet: false,
    childCorner: false
  });
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    additionalMessage: '',
    cuponCode: ''
  });

  const updateRoomId = (id) => {
    setRoomId(id);
  };

  const updateAddon = (key, value) => {
    setAddons(prev => ({ ...prev, [key]: value }));
  };

  const updateCheckInDate = (date) => {
    setCheckInDate(date);
  };

  const updateCheckOutDate = (date) => {
    setCheckOutDate(date);
  };

  const updateGuestCount = (count) => {
    setGuestCount(count);
  };

  const updateUserInfo = (key, value) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  // Initialize roomId if it's empty
  useEffect(() => {
    if (!roomId) {
      updateRoomId('default-room-id');
    }
  }, []);

  const contextValue = {
    roomId,
    addons,
    checkInDate,
    checkOutDate,
    guestCount,
    userInfo,
    updateRoomId,
    updateAddon,
    updateCheckInDate,
    updateCheckOutDate,
    updateGuestCount,
    updateUserInfo,
  };

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
};