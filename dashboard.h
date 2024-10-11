#ifndef DASHBOARD_H
#define DASHBOARD_H

#include <string>
#include <vector>
#include "nlohmann/json.hpp"

using json = nlohmann::json;

// User functions
json getUserInfo(const std::string& email);
bool updateUserInfo(const std::string& email, const json& newInfo);
bool deleteAccount(const std::string& email);
json getUserBookings(const std::string& email);
bool cancelBooking(const std::string& email, const std::string& bookingId);

// Admin functions
json getAllBookings();
json getAllUsers();
bool addBooking(const json& bookingInfo);
bool removeBooking(const std::string& bookingId);
bool editBooking(const std::string& bookingId, const json& newInfo);
bool addUser(const json& userInfo);
bool removeUser(const std::string& email);
bool editUser(const std::string& email, const json& newInfo);
json getRoomList();
bool addRoom(const json& roomInfo);
bool removeRoom(const std::string& roomId);
bool editRoom(const std::string& roomId, const json& newInfo);

#endif // DASHBOARD_H