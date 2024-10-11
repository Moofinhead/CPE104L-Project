#include "dashboard.h"
#include <fstream>
#include <algorithm>

// Helper function to read JSON from file
json readJsonFile(const std::string& filename) {
    std::ifstream file(filename);
    json data;
    if (file.is_open()) {
        file >> data;
    }
    return data;
}

// Helper function to write JSON to file
void writeJsonFile(const std::string& filename, const json& data) {
    std::ofstream file(filename);
    if (file.is_open()) {
        file << data.dump(4);
    }
}

// User functions
json getUserInfo(const std::string& email) {
    json users = readJsonFile("users.json");
    auto it = std::find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        return *it;
    }
    return json();
}

bool updateUserInfo(const std::string& email, const json& newInfo) {
    json users = readJsonFile("users.json");
    auto it = std::find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        it->update(newInfo);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

bool deleteAccount(const std::string& email) {
    json users = readJsonFile("users.json");
    auto it = std::find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        users.erase(it);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

json getUserBookings(const std::string& email) {
    json bookings = readJsonFile("bookings.json");
    json userBookings;
    for (const auto& booking : bookings) {
        if (booking["userInfo"]["email"] == email) {
            userBookings.push_back(booking);
        }
    }
    return userBookings;
}

bool cancelBooking(const std::string& email, const std::string& bookingId) {
    json bookings = readJsonFile("bookings.json");
    auto it = std::find_if(bookings.begin(), bookings.end(),
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
    return readJsonFile("bookings.json");
}

json getAllUsers() {
    return readJsonFile("users.json");
}

bool addBooking(const json& bookingInfo) {
    json bookings = readJsonFile("bookings.json");
    bookings.push_back(bookingInfo);
    writeJsonFile("bookings.json", bookings);
    return true;
}

bool removeBooking(const std::string& bookingId) {
    json bookings = readJsonFile("bookings.json");
    auto it = std::find_if(bookings.begin(), bookings.end(),
        [&bookingId](const json& booking) { return booking["bookingId"] == bookingId; });
    if (it != bookings.end()) {
        bookings.erase(it);
        writeJsonFile("bookings.json", bookings);
        return true;
    }
    return false;
}

bool editBooking(const std::string& bookingId, const json& newInfo) {
    json bookings = readJsonFile("bookings.json");
    auto it = std::find_if(bookings.begin(), bookings.end(),
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

bool removeUser(const std::string& email) {
    json users = readJsonFile("users.json");
    auto it = std::find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        users.erase(it);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

bool editUser(const std::string& email, const json& newInfo) {
    json users = readJsonFile("users.json");
    auto it = std::find_if(users.begin(), users.end(),
        [&email](const json& user) { return user["email"] == email; });
    if (it != users.end()) {
        it->update(newInfo);
        writeJsonFile("users.json", users);
        return true;
    }
    return false;
}

json getRoomList() {
    return readJsonFile("rooms.json");
}

bool addRoom(const json& roomInfo) {
    json rooms = readJsonFile("rooms.json");
    rooms.push_back(roomInfo);
    writeJsonFile("rooms.json", rooms);
    return true;
}

bool removeRoom(const std::string& roomId) {
    json rooms = readJsonFile("rooms.json");
    auto it = std::find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });
    if (it != rooms.end()) {
        rooms.erase(it);
        writeJsonFile("rooms.json", rooms);
        return true;
    }
    return false;
}

bool editRoom(const std::string& roomId, const json& newInfo) {
    json rooms = readJsonFile("rooms.json");
    auto it = std::find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });
    if (it != rooms.end()) {
        it->update(newInfo);
        writeJsonFile("rooms.json", rooms);
        return true;
    }
    return false;
}