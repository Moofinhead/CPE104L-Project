#ifndef DASHBOARD_H
#define DASHBOARD_H

#include <string>
#include "nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

// Debug logging function
void debugLog(const string& message, const json& data = json());

// User functions
json getUserInfo(const string& email);
bool updateUserInfo(const string& email, const json& newInfo);
bool deleteAccount(const string& email);
json getUserBookings(const string& email);
bool cancelBooking(const string& email, const string& bookingId);

// Admin functions
json getAllBookings();
json getAllUsers();
bool addBooking(const json& bookingInfo);
bool removeBooking(const string& bookingId);
bool editBooking(const string& bookingId, const json& newInfo);
bool addUser(const json& userInfo);
bool removeUser(const string& email);
bool editUser(const string& email, const json& newInfo);
json getRoomList(const string& roomId = "");
bool addRoom(const json& roomInfo);
bool removeRoom(const string& roomId);
bool editRoom(const string& roomId, const json& newInfo);
bool deleteRoom(const string& roomId);
json getBooking(const string& bookingId);
json getRoomBookingStats();
json getBookingDates();
double calculateAverageBookingDuration();
string findMostPopularRoomType();

// Coupon functions
json getAllCoupons();
json addCoupon(const json& couponData);
json updateCoupon(const string& couponName, const json& newCouponData);
json deleteCoupon(const string& couponName);

#endif // DASHBOARD_H
