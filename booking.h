#pragma once
#ifndef BOOKING_H
#define BOOKING_H

#include <string>
#include "nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

// Price details structure for booking calculations
struct PriceDetails {
    int subtotal;
    int addonTotal;
    int total;
    int basePrice;
    int basePricePerNight;
    int numberOfNights;
    int discountedTotal;
};

// Function to calculate the number of nights between two dates
int calculateNights(const string& checkInDate, const string& checkOutDate);

// Function to calculate the total price including addons
PriceDetails calculateActualTotal(const json& room, const json& addons, int numberOfNights, const string& couponCode);

// Function to apply a coupon to a booking
double useCoupon(const string& couponCode, const string& bookingId, const string& roomId, 
                 const string& checkInDate, const string& checkOutDate, int guestCount, 
                 int total, const string& bookingTime, int numberOfNights);

// Function to book a room
json bookRoom(const string& roomId, const json& addons, const string& checkInDate, 
              const string& checkOutDate, int guestCount, const json& userInfo, const string& couponCode);

// Function to get the maximum number of guests for a room
int getMaxGuests(const string& roomId);

#endif // BOOKING_H
