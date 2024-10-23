#include "booking.h"
#include <fstream>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <algorithm>
#include <ctime>
#include <iostream>

//Ang ingay kase ng compiler
#define _CRT_SECURE_NO_WARNINGS

using namespace std;
using json = nlohmann::json;

// Helper function to parse date string
chrono::system_clock::time_point parseDate(const string& dateStr) {
    tm tm = {};
    istringstream ss(dateStr);
    ss >> get_time(&tm, "%Y-%m-%d");
    return chrono::system_clock::from_time_t(mktime(&tm));
}

// Helper function to calculate number of nights
int calculateNights(const string& checkInDate, const string& checkOutDate) {
    auto start = parseDate(checkInDate);
    auto end = parseDate(checkOutDate);
    return static_cast<int>(chrono::duration_cast<chrono::hours>(end - start).count() / 24);
}

int getMaxGuests(const string& roomId) {
    // Read rooms from JSON file
    ifstream roomsFile("rooms.json");
    json rooms;
    roomsFile >> rooms;

    // Find the room
    auto room = find_if(rooms.begin(), rooms.end(), [&roomId](const json& room) {
        return room["id"] == roomId;
    });

    if (room == rooms.end()) {
        return 0; // Room not found, return 0 or handle error as appropriate
    }

    string roomType = (*room)["type"];
    
    if (roomType == "Standard Room") {
        return 3;
    } else if (roomType == "Luxury Room") {
        return 5;
    } else if (roomType == "Penthouse") {
        return 7;
    } else {
        return 0; // Unknown room type, return 0 or handle error as appropriate
    }
}

PriceDetails calculateActualTotal(const json& room, const json& addons, int numberOfNights, const string& couponCode) {
    PriceDetails details;
    
    cout << "Calculating actual total for room: " << room.dump(2) << endl;
    cout << "Addons: " << addons.dump(2) << endl;
    cout << "Number of nights: " << numberOfNights << endl;
    cout << "Coupon code received: " << (couponCode.empty() ? "None" : couponCode) << endl;

    if (!room.contains("basePrice")) {
        cerr << "Error: Room does not contain basePrice" << endl;
        return PriceDetails{0, 0, 0, 0, 0, numberOfNights};
    }
    
    details.basePricePerNight = room["basePrice"].get<int>() * 50;  // Convert USD to PHP
    details.subtotal = details.basePricePerNight * numberOfNights;
    details.addonTotal = 0;
    details.numberOfNights = numberOfNights;

    cout << "Base price per night: " << details.basePricePerNight << " PHP" << endl;
    cout << "Initial subtotal: " << details.subtotal << " PHP" << endl;

    if (addons.contains("enableWifi") && addons["enableWifi"]) {
        details.addonTotal += 500;
        cout << "Added WiFi: +500 PHP" << endl;
    }
    if (addons.contains("smokingZone") && addons["smokingZone"]) {
        details.addonTotal += 750;
        cout << "Added Smoking Zone: +750 PHP" << endl;
    }
    if (addons.contains("view")) {
        string view = addons["view"];
        if (view == "City") {
            details.addonTotal += 1000;
            cout << "Added City View: +1000 PHP" << endl;
        }
        else if (view == "Ocean") {
            details.addonTotal += 1500;
            cout << "Added Ocean View: +1500 PHP" << endl;
        }
        else if (view == "Mountain") {
            details.addonTotal += 1250;
            cout << "Added Mountain View: +1250 PHP" << endl;
        }
    }
    if (addons.contains("serviceGuide") && addons["serviceGuide"]) {
        details.addonTotal += 250;
        cout << "Added Service Guide: +250 PHP" << endl;
    }
    if (addons.contains("dinner") && addons["dinner"]) {
        details.addonTotal += 1250;
        cout << "Added Dinner: +1250 PHP" << endl;
    }
    if (addons.contains("petAllowed") && addons["petAllowed"]) {
        details.addonTotal += 1000;
        cout << "Added Pet Allowance: +1000 PHP" << endl;
    }
    if (addons.contains("swimmingPool") && addons["swimmingPool"]) {
        details.addonTotal += 750;
        cout << "Added Swimming Pool Access: +750 PHP" << endl;
    }
    if (addons.contains("breakfastBuffet") && addons["breakfastBuffet"]) {
        details.addonTotal += 1000;
        cout << "Added Breakfast Buffet: +1000 PHP" << endl;
    }
    if (addons.contains("childCorner") && addons["childCorner"]) {
        details.addonTotal += 500;
        cout << "Added Child Corner: +500 PHP" << endl;
    }

    details.total = details.subtotal + details.addonTotal;
    details.discountedTotal = details.total;  // Initialize discounted total to full total

    cout << "Addon total: " << details.addonTotal << " PHP" << endl;
    cout << "Subtotal: " << details.subtotal << " PHP" << endl;
    cout << "Total before coupon: " << details.total << " PHP" << endl;

    // Apply coupon if provided
    if (!couponCode.empty()) {
        string tempBookingId = "TEMP-" + to_string(chrono::system_clock::to_time_t(chrono::system_clock::now()));
        double discountFactor = useCoupon(couponCode, tempBookingId, room["id"], 
                                          "2023-01-01", "2023-12-31", // Placeholder dates
                                          1, // Placeholder guest count
                                          details.total, "N/A", numberOfNights);
        
        if (discountFactor < 1.0) {
            details.discountedTotal = static_cast<int>(details.total * discountFactor);
            int couponDiscount = details.total - details.discountedTotal;
            cout << "Coupon " << couponCode << " applied. Discount: " 
                      << couponDiscount << " PHP" << endl;
        } else {
            cout << "Coupon " << couponCode << " was not valid or not applicable." << endl;
        }
    }

    cout << "Final discounted total: " << details.discountedTotal << " PHP" << endl;

    return details;
}

int calculateTotal(const json& room, const json& addons) {
    PriceDetails details;
    
    if (!room.contains("basePrice")) {
        cerr << "Error: Room does not contain basePrice" << endl;
        return 0;
    }
    
    details.basePricePerNight = room["basePrice"].get<int>();
    details.basePrice = details.basePricePerNight * 50;  // Convert base price to PHP
    details.addonTotal = 0;

    cout << "Base price per night: " << details.basePricePerNight << " USD" << endl;
    cout << "Base price: " << details.basePrice << " PHP" << endl;

    if (addons.contains("enableWifi") && addons["enableWifi"]) {
        details.addonTotal += 500;
        cout << "Added WiFi: +500 PHP" << endl;
    }
    if (addons.contains("smokingZone") && addons["smokingZone"]) {
        details.addonTotal += 750;
        cout << "Added Smoking Zone: +750 PHP" << endl;
    }
    // ... (other addons)

    details.subtotal = details.basePrice + details.addonTotal;
    details.total = details.subtotal;

    cout << "Addon total: " << details.addonTotal << " PHP" << endl;
    cout << "Subtotal: " << details.subtotal << " PHP" << endl;
    cout << "Total: " << details.total << " PHP" << endl;

    return details.total;  // Return only the total to maintain compatibility
}

double useCoupon(const string& couponCode, const string& bookingId, const string& roomId, 
                 const string& checkInDate, const string& checkOutDate, int guestCount, 
                 int total, const string& bookingTime, int numberOfNights) {
    ifstream couponFile("coupons.json");
    if (!couponFile.is_open()) {
        cerr << "Error: Unable to open coupons.json" << endl;
        return 1.0; // No discount
    }

    json coupons;
    couponFile >> coupons;

    cout << "Checking coupon: " << couponCode << endl;

    for (const auto& coupon : coupons) {
        if (coupon["name"] == couponCode) {
            bool isValid = true;
            const auto& minimum = coupon["minimum"];

            cout << "Coupon found. Checking requirements:" << endl;

            // Check all minimum requirements
            if (minimum.contains("numberOfNights")) {
                cout << "  Number of nights - Required: " << minimum["numberOfNights"] 
                          << ", Actual: " << numberOfNights << endl;
                if (numberOfNights < minimum["numberOfNights"]) isValid = false;
            }
            if (minimum.contains("guestCount")) {
                cout << "  Guest count - Required: " << minimum["guestCount"] 
                          << ", Actual: " << guestCount << endl;
                if (guestCount < minimum["guestCount"]) isValid = false;
            }
            if (minimum.contains("total")) {
                cout << "  Total - Required: " << minimum["total"] 
                          << ", Actual: " << total << endl;
                if (total < minimum["total"]) isValid = false;
            }
            if (minimum.contains("roomId")) {
                cout << "  Room ID - Required: " << minimum["roomId"] 
                          << ", Actual: " << roomId << endl;
                if (roomId != minimum["roomId"]) isValid = false;
            }

            // Check date range if specified
            if (minimum.contains("checkInDate") && minimum.contains("checkOutDate")) {
                auto bookingCheckIn = parseDate(checkInDate);
                auto bookingCheckOut = parseDate(checkOutDate);
                auto minCheckIn = parseDate(minimum["checkInDate"]);
                auto minCheckOut = parseDate(minimum["checkOutDate"]);

                cout << "  Check-in date - Required range: " << minimum["checkInDate"] 
                          << " to " << minimum["checkOutDate"] << ", Actual: " << checkInDate << endl;

                if (bookingCheckIn < minCheckIn || bookingCheckOut > minCheckOut) isValid = false;
            }

            if (isValid) {
                cout << "Coupon " << couponCode << " is valid and applied." << endl;
                if (coupon.contains("flatDiscount")) {
                    int flatDiscount = coupon["flatDiscount"].get<int>();
                    int totalDiscount = flatDiscount * numberOfNights;
                    double discountRate = 1.0 - (static_cast<double>(totalDiscount) / total);
                    cout << "Flat discount: " << flatDiscount << " PHP per night" << endl;
                    cout << "Total discount: " << totalDiscount << " PHP" << endl;
                    return max(0.0, discountRate); // Ensure discount doesn't exceed 100%
                } else if (coupon.contains("discountRate")) {
                    double discountRate = coupon["discountRate"].get<double>();
                    cout << "Discount rate: " << (discountRate * 100) << "%" << endl;
                    return 1.0 - discountRate;
                }
            } else {
                cout << "Coupon " << couponCode << " requirements not met." << endl;
            }
        }
    }

    cout << "Coupon " << couponCode << " not found in the coupon list." << endl;
    return 1.0; // No discount
}

json bookRoom(const string& roomId, const json& addons, const string& checkInDate, const string& checkOutDate, int guestCount, const json& userInfo, const string& couponCode) {
    cout << "Received roomId: " << roomId << endl;
    cout << "Received addons: " << addons.dump() << endl;
    cout << "Received checkInDate: " << checkInDate << endl;
    cout << "Received checkOutDate: " << checkOutDate << endl;
    cout << "Received guestCount: " << guestCount << endl;
    cout << "Received userInfo: " << userInfo.dump() << endl;
    cout << "Received couponCode: " << couponCode << endl;

    // Read rooms from JSON file
    ifstream roomsFile("rooms.json");
    if (!roomsFile.is_open()) {
        cerr << "Error: Unable to open rooms.json" << endl;
        return json({{"error", "Unable to open rooms.json"}});
    }
    json rooms;
    roomsFile >> rooms;

    // Find the room
    auto selectedRoom = find_if(rooms.begin(), rooms.end(),
        [&roomId](const json& room) { return room["id"] == roomId; });

    if (selectedRoom == rooms.end()) {
        cerr << "Error: Room not found" << endl;
        return json({{"error", "Room not found"}});
    }

    // Calculate number of nights
    int numberOfNights = calculateNights(checkInDate, checkOutDate);

    // Calculate the total
    PriceDetails priceDetails = calculateActualTotal(*selectedRoom, addons, numberOfNights, couponCode);

    // Get current time
    auto now = chrono::system_clock::now();
    time_t now_c = chrono::system_clock::to_time_t(now);
    
    // Convert to local time
    tm local_tm;
    localtime_s(&local_tm, &now_c);
    
    // Format the time string
    char buffer[26];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &local_tm);
    string bookingTime(buffer);

    // Create a unique booking ID
    string bookingId = "BOOK-" + to_string(chrono::system_clock::to_time_t(now));

    json booking = {
        {"bookingId", bookingId},
        {"roomId", (*selectedRoom)["id"]},
        {"checkInDate", checkInDate},
        {"checkOutDate", checkOutDate},
        {"guestCount", guestCount},
        {"numberOfNights", numberOfNights},
        {"basePricePerNight", priceDetails.basePricePerNight},
        {"subtotal", priceDetails.subtotal},
        {"addonTotal", priceDetails.addonTotal},
        {"total", priceDetails.total},
        {"discountedTotal", priceDetails.discountedTotal},
        {"bookingTime", bookingTime}
    };

    // Add optional fields only if they're not empty
    if (!addons.empty()) {
        booking["addons"] = addons;
    }
    if (!userInfo.empty()) {
        booking["userInfo"] = userInfo;
    }

    // Read existing bookings
    json bookings;
    ifstream bookingsFile("bookings.json");
    if (bookingsFile.is_open()) {
        string bookingsContent((istreambuf_iterator<char>(bookingsFile)), istreambuf_iterator<char>());
        cout << "bookings.json content: " << bookingsContent << endl;
        if (!bookingsContent.empty()) {
            bookings = json::parse(bookingsContent);
        } else {
            cout << "Note: bookings.json is empty, initializing as empty array" << endl;
            bookings = json::array();
        }
        bookingsFile.close();
    } else {
        cout << "Note: bookings.json does not exist, creating new file" << endl;
        bookings = json::array();
    }

    // Add new booking
    bookings.push_back(booking);

    // Write updated bookings back to JSON file
    ofstream bookingsOutFile("bookings.json");
    if (!bookingsOutFile.is_open()) {
        cerr << "Error: Unable to open bookings.json for writing" << endl;
        return json({{"error", "Unable to update bookings.json"}});
    }
    bookingsOutFile << bookings.dump(4);
    bookingsOutFile.close();

    // Only update rooms.json after successful booking
    (*selectedRoom)["isBooked"] = true;
    (*selectedRoom)["bookId"] = booking["bookingId"];

    // Write updated rooms back to JSON file
    ofstream outFile("rooms.json");
    if (!outFile.is_open()) {
        cerr << "Error: Unable to open rooms.json for writing" << endl;
        return json({{"error", "Unable to update rooms.json"}});
    }
    outFile << rooms.dump(4);
    outFile.close();

    cout << "Booking successfully added to bookings.json and rooms.json updated" << endl;

    return json({
        {"message", "Booking successful"},
        {"bookingId", bookingId},
        {"roomId", (*selectedRoom)["id"]},
        {"numberOfNights", numberOfNights},
        {"basePricePerNight", priceDetails.basePricePerNight},
        {"subtotal", priceDetails.subtotal},
        {"addonTotal", priceDetails.addonTotal},
        {"total", priceDetails.total},
        {"discountedTotal", priceDetails.discountedTotal},
        {"bookingTime", bookingTime}
    });
}
