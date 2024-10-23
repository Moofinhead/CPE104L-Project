#include "dashboard.h"
#include <fstream>
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <ctime>
#include <iomanip>

using namespace std;
using json = nlohmann::json;

// Helper function to read JSON from file
json readJsonFile(const string& filename) {
    ifstream file(filename);
    json data;
    if (file.is_open()) {
        file >> data;
    }
    return data;
}

// Helper function to write JSON to file
void writeJsonFile(const string& filename, const json& data) {
    ofstream file(filename);
    if (file.is_open()) {
        file << data.dump(4);
    }
}

void debugLog(const string& message, const json& data) {
    cout << "DEBUG: " << message << endl;
    if (!data.is_null()) {
        cout << "Data: " << data.dump(2) << endl;
    }
    cout << endl;
}

json getUserInfo(const string& email) {
    json users = readJsonFile("users.json");
    auto it = find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        return *it;
    }
    return json({{"error", "User not found"}});
}

bool updateUserInfo(const string& email, const json& newInfo) {
    json users = readJsonFile("users.json");
    auto it = find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        it->update(newInfo);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

bool deleteAccount(const string& email) {
    json users = readJsonFile("users.json");
    auto it = find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        users.erase(it);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

json getUserBookings(const string& email) {
    json bookings = readJsonFile("bookings.json");
    json userBookings;
    for (const auto& booking : bookings) {
        if (booking["userInfo"]["email"] == email) {
            userBookings.push_back(booking);
        }
    }
    return userBookings;
}

bool cancelBooking(const string& email, const string& bookingId) {
    json bookings = readJsonFile("bookings.json");
    auto it = find_if(bookings.begin(), bookings.end(),
        [&bookingId, &email](const json& booking) {
            return booking["bookingId"] == bookingId && booking["userInfo"]["email"] == email;
        });
    if (it != bookings.end()) {
        bookings.erase(it);
        writeJsonFile("bookings.json", bookings);
        return true;
    }
    return false;
}

// Admin functions
json getAllBookings() {
    debugLog("getAllBookings called");
    json bookings = readJsonFile("bookings.json");
    debugLog("Returning all bookings:", bookings);
    return bookings;
}

json getAllUsers() {
    return readJsonFile("users.json");
}

bool addBooking(const json& bookingInfo) {
    debugLog("addBooking called with info:", bookingInfo);
    json bookings = readJsonFile("bookings.json");
    bookings.push_back(bookingInfo);
    writeJsonFile("bookings.json", bookings);
    debugLog("Booking added successfully");
    return true;
}

bool removeBooking(const string& bookingId) {
    debugLog("removeBooking called for bookingId:", json(bookingId));
    
    json bookings = readJsonFile("bookings.json");
    json rooms = readJsonFile("rooms.json");
    
    auto bookingIt = find_if(bookings.begin(), bookings.end(),
        [&bookingId](const json& booking) { return booking["bookingId"] == bookingId; });
    
    if (bookingIt != bookings.end()) {
        // Find the corresponding room and update its status
        string roomId = (*bookingIt)["roomId"];
        auto roomIt = find_if(rooms.begin(), rooms.end(),
            [&roomId](const json& room) { return room["id"] == roomId; });
        
        if (roomIt != rooms.end()) {
            (*roomIt)["isBooked"] = false;
            (*roomIt)["bookId"] = nullptr;
        }
        
        // Remove the booking
        bookings.erase(bookingIt);
        
        // Write updated data back to files
        writeJsonFile("bookings.json", bookings);
        writeJsonFile("rooms.json", rooms);
        
        debugLog("Booking removed and room status updated successfully");
        return true;
    }
    
    debugLog("Booking not found, removal failed");
    return false;
}

bool editBooking(const string& bookingId, const json& newInfo) {
    json bookings = readJsonFile("bookings.json");
    auto it = find_if(bookings.begin(), bookings.end(),
        [&bookingId](const json& booking) { return booking["bookingId"] == bookingId; });
    if (it != bookings.end()) {
        it->update(newInfo);
        writeJsonFile("bookings.json", bookings);
        return true;
    }
    return false;
}

bool addUser(const json& userInfo) {
    json users = readJsonFile("users.json");
    users.push_back(userInfo);
    writeJsonFile("users.json", users);
    return true;
}

bool removeUser(const string& email) {
    json users = readJsonFile("users.json");
    auto it = find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        users.erase(it);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

bool editUser(const string& email, const json& newInfo) {
    json users = readJsonFile("users.json");
    auto it = find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        it->update(newInfo);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

json getRoomList(const string& roomId) {
    debugLog("getRoomList called" + (roomId.empty() ? "" : " for roomId: " + roomId));
    json rooms = readJsonFile("rooms.json");
    
    // Enhance room data with booking information
    json bookings = readJsonFile("bookings.json");
    for (auto& room : rooms) {
        auto it = find_if(bookings.begin(), bookings.end(),
            [&room](const json& booking) { return booking["roomId"] == room["id"]; });
        if (it != bookings.end()) {
            room["isBooked"] = true;
            room["bookId"] = (*it)["bookingId"];
        } else {
            room["isBooked"] = false;
            room["bookId"] = nullptr;
        }
    }
    
    if (!roomId.empty()) {
        auto it = find_if(rooms.begin(), rooms.end(),
            [&roomId](const json& room) { return room["id"] == roomId; });
        if (it != rooms.end()) {
            debugLog("Room found, returning info:", *it);
            return *it;
        }
        debugLog("Room not found");
        return json(); // Return an empty JSON object if room not found
    }
    
    debugLog("Returning all rooms:", rooms);
    return rooms;
}

bool addRoom(const json& roomInfo) {
    debugLog("addRoom called with info:", roomInfo);
    json rooms = readJsonFile("rooms.json");
    rooms.push_back(roomInfo);
    writeJsonFile("rooms.json", rooms);
    debugLog("Room added successfully");
    return true;
}

bool removeRoom(const string& roomId) {
    json rooms = readJsonFile("rooms.json");
    auto it = find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });
    if (it != rooms.end()) {
        rooms.erase(it);
        writeJsonFile("rooms.json", rooms);
        return true;
    }
    return false;
} 

bool editRoom(const string& roomId, const json& newInfo) {
    debugLog("editRoom called for roomId:", json(roomId));
    debugLog("New room info:", newInfo);
    json rooms = readJsonFile("rooms.json");
    auto it = find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });
    if (it != rooms.end()) {
        it->update(newInfo);
        writeJsonFile("rooms.json", rooms);
        debugLog("Room updated successfully");
        return true;
    }
    debugLog("Room not found, update failed");
    return false;
}

bool deleteRoom(const string& roomId) {
    debugLog("deleteRoom called for roomId:", json(roomId));
    json rooms = readJsonFile("rooms.json");
    auto it = find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });
    if (it != rooms.end()) {
        rooms.erase(it);
        writeJsonFile("rooms.json", rooms);
        debugLog("Room deleted successfully");
        return true;
    }
    debugLog("Room not found, deletion failed");
    return false;
}

json getBooking(const string& bookingId) {
    json bookings = readJsonFile("bookings.json");
    auto it = find_if(bookings.begin(), bookings.end(),
        [&bookingId](const json& booking) { return booking["bookingId"] == bookingId; });
    if (it != bookings.end()) {
        return *it;
    }
    return json(nullptr);
}

json getRoomBookingStats() {
    json bookings = readJsonFile("bookings.json");
    map<string, int> roomBookingCounts;

    for (const auto& booking : bookings) {
        roomBookingCounts[booking["roomId"]]++;
    }

    json stats = json::array();
    for (const auto& [roomId, count] : roomBookingCounts) {
        stats.push_back({{"roomId", roomId}, {"bookingCount", count}});
    }

    return stats;
}

json getBookingDates() {
    json bookings = readJsonFile("bookings.json");
    set<string> uniqueDates;

    for (const auto& booking : bookings) {
        uniqueDates.insert(booking["checkInDate"]);
        uniqueDates.insert(booking["checkOutDate"]);
    }

    return json(uniqueDates);
}

double calculateAverageBookingDuration() {
    json bookings = readJsonFile("bookings.json");
    int totalDays = 0;
    int bookingCount = 0;

    for (const auto& booking : bookings) {
        string checkInStr = booking["checkInDate"];
        string checkOutStr = booking["checkOutDate"];
        
        tm checkIn = {}, checkOut = {};
        istringstream(checkInStr) >> get_time(&checkIn, "%Y-%m-%d");
        istringstream(checkOutStr) >> get_time(&checkOut, "%Y-%m-%d");

        time_t checkInTime = mktime(&checkIn);
        time_t checkOutTime = mktime(&checkOut);

        int durationDays = difftime(checkOutTime, checkInTime) / (60 * 60 * 24);
        totalDays += durationDays;
        bookingCount++;
    }

    return bookingCount > 0 ? static_cast<double>(totalDays) / bookingCount : 0.0;
}

string findMostPopularRoomType() {
    json rooms = readJsonFile("rooms.json");
    json bookings = readJsonFile("bookings.json");
    map<string, int> roomTypeBookingCounts;

    for (const auto& booking : bookings) {
        string roomId = booking["roomId"];
        auto it = find_if(rooms.begin(), rooms.end(),
            [&roomId](const json& room) { return room["id"] == roomId; });
        if (it != rooms.end()) {
            roomTypeBookingCounts[(*it)["type"]]++;
        }
    }

    auto maxElement = max_element(roomTypeBookingCounts.begin(), roomTypeBookingCounts.end(),
        [](const auto& p1, const auto& p2) { return p1.second < p2.second; });

    return maxElement != roomTypeBookingCounts.end() ? maxElement->first : "Unknown";
}

// Add these functions at the end of your dashboard.cpp file

json getAllCoupons() {
    return readJsonFile("coupons.json");
}

json addCoupon(const json& couponData) {
    json coupons = readJsonFile("coupons.json");
    coupons.push_back(couponData);
    writeJsonFile("coupons.json", coupons);
    return json({{"success", true}});
}

json updateCoupon(const string& couponName, const json& newCouponData) {
    json coupons = readJsonFile("coupons.json");
    auto it = find_if(coupons.begin(), coupons.end(),
        [&couponName](const json& coupon) { return coupon["name"] == couponName; });
    
    if (it != coupons.end()) {
        *it = newCouponData;
        writeJsonFile("coupons.json", coupons);
        return json({{"success", true}});
    }
    return json({{"success", false}, {"error", "Coupon not found"}});
}

json deleteCoupon(const string& couponName) {
    json coupons = readJsonFile("coupons.json");
    auto it = find_if(coupons.begin(), coupons.end(),
        [&couponName](const json& coupon) { return coupon["name"] == couponName; });
    
    if (it != coupons.end()) {
        coupons.erase(it);
        writeJsonFile("coupons.json", coupons);
        return json({{"success", true}});
    }
    return json({{"success", false}, {"error", "Coupon not found"}});
}
