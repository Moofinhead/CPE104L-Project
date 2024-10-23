    #include <iostream>
    #include <fstream>
    #include <regex>
    #include "nlohmann/json.hpp"
    #include <limits>
    #include "httplib.h"
    #include "register.h"
    #include "login.h"
    #include "booking.h"
    #include "dashboard.h"
    using namespace std;
    using json = nlohmann::json;

    // Define the allowed origin
    const std::string ALLOWED_ORIGIN = "http://localhost:3000";  

    // Helper function to set CORS headers
    void setCorsHeaders(httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN.c_str());
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Allow-Max-Age", "3600");
        res.set_header("Access-Control-Allow-Credentials", "true");
    }

    // Function to create, output, and save a JSON array
    void createAndSaveJsonArray() {
        json users = json::array({
            {
                {"username", "John Doe"},
                {"email", "john.doe@example.com"},
                {"is_admin", false},
                {"password", "Imadogimadog1!"}
            },
            {
                {"username", "Jane Smith"},
                {"email", "jane.smith@example.com"},
                {"is_admin", true},
                {"password", "Pa$$w0rd123"}
            },
            {
                {"username", "Alice Johnson"},
                {"email", "alice.johnson@example.com"},
                {"is_admin", false},
                {"password", "Qwerty!23"}
            }
            });

        cout << "Created JSON array:" << endl << users.dump(4) << endl;

        ofstream file("users.json");
        if (file.is_open()) {
            file << users.dump(4);
            file.close();
            cout << "JSON file saved successfully!" << endl;
        }
        else {
            cerr << "Error opening file for writing" << endl;
        }
    }

    // Function to check if a user is admin
    bool isUserAdmin(const string& username) {
        ifstream file("users.json");
        if (!file.is_open()) {
            cerr << "Error opening file for reading" << endl;
            return false;
        }

        json users;
        file >> users;

        auto it = find_if(users.begin(), users.end(),
            [&username](const json& user) { 
                return user["username"].get<string>() == username; 
            });

        if (it != users.end()) {
            return (*it)["is_admin"].get<bool>();
        }
        return false;
    }

    // Function to count users in the JSON file
    int countUsers() {
        ifstream file("users.json");
        if (!file.is_open()) {
            cerr << "Error opening file for reading" << endl;
            return 0;
        }

        json users;
        file >> users;

        return users.size();
    }

    // Function to delete a user from the JSON file
    void deleteUser(const string& username, const string& password) {
        ifstream inFile("users.json");
        if (!inFile.is_open()) {
            cerr << "Error opening file for reading" << endl;
            return;
        }

        json users;
        inFile >> users;
        inFile.close();

        auto it = find_if(users.begin(), users.end(),
            [&username](const json& user) {
                return user["username"].get<string>() == username;
            });

        if (it != users.end()) {
            if ((*it)["password"].get<string>() == password) {
                users.erase(it);
                ofstream outFile("users.json");
                if (outFile.is_open()) {
                    outFile << users.dump(4);
                    outFile.close();
                    cout << "User " << username << " deleted successfully!" << endl;
                } else {
                    cerr << "Error opening file for writing" << endl;
                }
            } else {
                cout << "Incorrect password. User not deleted." << endl;
            }
        } else {
            cout << "User " << username << " not found." << endl;
        }
    }

    // Helper function to convert query params to JSON
    json paramsToJson(const httplib::Params& params) {
        json result;
        for (const auto& param : params) {
            result[param.first] = param.second;
        }
        return result;
    }

    int main() {
        httplib::Server svr;

        // Global CORS middleware
        svr.Options(".*", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            res.status = 204;  // No content
        });

        // Registration route
        svr.Options("/register", [](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");
            res.status = 204; // No content
        });

        svr.Post("/register", [](const httplib::Request& req, httplib::Response& res) {
            // Set CORS headers
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            auto username = req.get_param_value("username");
            auto email = req.get_param_value("email");
            auto password = req.get_param_value("password");
            auto confirmPassword = req.get_param_value("confirmPassword");

            int status;
            std::string message;

            handleRegistration(username, email, password, confirmPassword, status, message);

            res.status = status;
            res.set_content(message, "text/plain");
        });

        // Login route
        svr.Options("/login", [](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");
            res.status = 204; // No content
        });

        svr.Post("/login", [](const httplib::Request& req, httplib::Response& res) {
            // Set CORS headers
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            auto email = req.get_param_value("email");
            auto password = req.get_param_value("password");

            int status;
            std::string message;
            std::string nickname;
            bool isAdmin;

            handleLogin(email, password, status, message, nickname, isAdmin);

            res.status = status;
            if (status == 200) {
                json response = {
                    {"message", message},
                    {"nickname", nickname},
                    {"is_admin", isAdmin}
                };
                res.set_content(response.dump(), "application/json");
            } else {
                res.set_content(message, "text/plain");
            }
        });

        // Booking routes
        svr.Options("/book", [](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");
            res.status = 204; // No content
        });

        svr.Get("/get-max-guests", [](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            
            std::string roomId = req.get_param_value("roomId");
            
            std::cout << "\n--- Debug: /get-max-guests ---" << std::endl;
            std::cout << "Received request with roomId: " << roomId << std::endl;

            int maxGuests = getMaxGuests(roomId);
            json response = {{"maxGuests", maxGuests}};

            std::cout << "Sending response: " << response.dump(2) << std::endl;
            std::cout << "--- End Debug: /get-max-guests ---\n" << std::endl;

            res.set_content(response.dump(), "application/json");
        });

        svr.Options("/calculate-total", [](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");
            res.status = 204; // No content
        });

        svr.Post("/calculate-total", [](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            std::cout << "Received request body for calculate-total: " << req.body << std::endl;

            json j;
            try {
                j = json::parse(req.body);
            } catch (json::parse_error& e) {
                res.status = 400;
                res.set_content("Invalid JSON: " + std::string(e.what()), "text/plain");
                return;
            }

            // Validate required fields
            if (!j.contains("roomId") || !j.contains("checkInDate") || !j.contains("checkOutDate") || 
                !j.contains("guestCount") || !j.contains("addons")) {
                res.status = 400;
                res.set_content("Missing required fields", "text/plain");
                return;
            }

            // Read rooms from JSON file
            std::ifstream roomsFile("rooms.json");
            json rooms;
            roomsFile >> rooms;

            // Find the room
            auto room = std::find_if(rooms.begin(), rooms.end(), [&](const json& r) {
                return r["id"] == j["roomId"];
            });

            if (room != rooms.end()) {
                // Calculate number of nights
                int numberOfNights = calculateNights(j["checkInDate"], j["checkOutDate"]);

                // Calculate the total
                PriceDetails details = calculateActualTotal(*room, j["addons"], numberOfNights, j["couponCode"]);

                // Extract coupon code if present
                std::string couponCode = j.value("couponCode", "");

                // Generate a temporary booking ID for coupon validation
                std::string tempBookingId = "TEMP-" + std::to_string(std::chrono::system_clock::to_time_t(std::chrono::system_clock::now()));

                // Apply coupon if provided
                double discountFactor = 1.0;
                if (!couponCode.empty()) {
                    discountFactor = useCoupon(couponCode, tempBookingId, j["roomId"], j["checkInDate"], j["checkOutDate"], 
                                               j["guestCount"], details.total, "N/A", numberOfNights);
                }

                int discountedTotal = static_cast<int>(details.total * discountFactor);

                json result = {
                    {"subtotal", details.subtotal},
                    {"addonTotal", details.addonTotal},
                    {"total", details.total},
                    {"discountedTotal", details.discountedTotal},
                    {"basePricePerNight", details.basePricePerNight},
                    {"numberOfNights", details.numberOfNights}
                };

                std::cout << "Calculate total result: " << result.dump(2) << std::endl;

                res.set_content(result.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content("Room not found", "text/plain");
            }
        });

        svr.Post("/book", [](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "POST");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            std::cout << "Received request body: " << req.body << std::endl;

            json j;
            try {
                j = json::parse(req.body);
            } catch (json::parse_error& e) {
                res.status = 400;
                res.set_content("Invalid JSON: " + std::string(e.what()), "text/plain");
                return;
            }

            // Validate required fields
            if (!j.contains("roomId") || !j.contains("checkInDate") || !j.contains("checkOutDate") || 
                !j.contains("guestCount") || !j.contains("addons") || !j.contains("userInfo")) {
                res.status = 400;
                res.set_content("Missing required fields", "text/plain");
                return;
            }

            // Extract coupon code if present
            std::string couponCode = j.value("couponCode", "");

            json result = bookRoom(j["roomId"], j["addons"], j["checkInDate"], j["checkOutDate"], 
                                   j["guestCount"], j["userInfo"], couponCode);

            std::cout << "Booking result: " << result.dump(2) << std::endl;

            res.set_content(result.dump(), "application/json");
        });

        svr.Get("/available-rooms", [](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "GET");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");

            // Read rooms from JSON file
            std::ifstream roomsFile("rooms.json");
            if (!roomsFile.is_open()) {
                res.status = 500;
                res.set_content("Unable to open rooms.json", "text/plain");
                return;
            }

            json rooms;
            roomsFile >> rooms;

            // Filter available rooms and format room names
            json availableRooms = json::array();
            for (const auto& room : rooms) {
                if (!room["isBooked"]) {
                    std::string id = room["id"];
                    std::string type = room["type"];
                    
                    // Extract room number from id
                    std::string number = id.substr(id.find_last_of('-') + 1);
                    
                    // Format room name
                    std::string roomName = type + " " + number;

                    // Convert base price to pesos
                    int basePriceUSD = room["basePrice"].get<int>();
                    int basePricePHP = basePriceUSD * 50;

                    json formattedRoom = {
                        {"id", id},
                        {"name", roomName},
                        {"basePrice", basePricePHP}
                    };
                    availableRooms.push_back(formattedRoom);
                }
            }

            // Send the response
            res.set_content(availableRooms.dump(), "application/json");
        });

        // User dashboard routes
        svr.Get("/user/info", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            debugLog("Received GET request to /user/info");
            debugLog("Query params:", paramsToJson(req.params));
            
            auto email = req.get_param_value("email");
            json userInfo = getUserInfo(email);
            
            debugLog("Sending response:", userInfo);
            res.set_content(userInfo.dump(), "application/json");
        });

        svr.Post("/user/update", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            debugLog("Received POST request to /user/update");
            debugLog("Query params:", paramsToJson(req.params));
            debugLog("Request body:", json::parse(req.body));
            
            auto email = req.get_param_value("email");
            json newInfo = json::parse(req.body);
            bool success = updateUserInfo(email, newInfo);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Post("/user/delete", [](const httplib::Request& req, httplib::Response& res) {
            auto email = req.get_param_value("email");
            bool success = deleteAccount(email);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        svr.Get("/user/bookings", [](const httplib::Request& req, httplib::Response& res) {
            auto email = req.get_param_value("email");
            json bookings = getUserBookings(email);
            res.set_content(bookings.dump(), "application/json");
        });

        svr.Post("/user/cancel-booking", [](const httplib::Request& req, httplib::Response& res) {
            auto email = req.get_param_value("email");
            auto bookingId = req.get_param_value("bookingId");
            bool success = cancelBooking(email, bookingId);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        // Admin dashboard routes
        svr.Get("/admin/bookings", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);  // Ensure CORS headers are set for this route
            debugLog("Received GET request to /admin/bookings");
            
            json bookings = getAllBookings();
            
            debugLog("Sending response:", bookings);
            res.set_content(bookings.dump(), "application/json");
        });

        svr.Get(R"(/admin/rooms(?:/(.+))?)", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            std::string roomId = req.matches.size() > 1 ? req.matches[1].str() : "";
            debugLog("Received GET request to /admin/rooms" + (roomId.empty() ? "" : "/" + roomId));
            
            json roomInfo = getRoomList(roomId);
            
            if (!roomId.empty() && roomInfo.is_null()) {
                debugLog("Room not found, sending 404");
                res.status = 404;
                json errorResponse = {{"error", "Room not found"}};
                res.set_content(errorResponse.dump(), "application/json");
            } else {
                debugLog("Sending response:", roomInfo);
                res.set_content(roomInfo.dump(), "application/json");
            }
        });

        svr.Post("/admin/rooms", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            debugLog("Received POST request to /admin/rooms");
            debugLog("Request body:", json::parse(req.body));
            
            json roomInfo = json::parse(req.body);
            bool success = addRoom(roomInfo);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Put(R"(/admin/rooms/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto roomId = req.matches[1].str();
            debugLog("Received PUT request to /admin/rooms/" + std::string(roomId));
            debugLog("Request body:", json::parse(req.body));
            
            json newInfo = json::parse(req.body);
            bool success = editRoom(roomId, newInfo);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Delete(R"(/admin/rooms/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto roomId = req.matches[1].str();
            debugLog("Received DELETE request to /admin/rooms/" + std::string(roomId));
            
            bool success = deleteRoom(roomId);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Post("/admin/add-room", [](const httplib::Request& req, httplib::Response& res) {
            debugLog("Received POST request to /admin/add-room");
            debugLog("Request body:", json::parse(req.body));
            
            json roomInfo = json::parse(req.body);
            bool success = addRoom(roomInfo);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Post("/admin/edit-room", [](const httplib::Request& req, httplib::Response& res) {
            debugLog("Received POST request to /admin/edit-room");
            debugLog("Request body:", json::parse(req.body));
            
            json requestData = json::parse(req.body);
            std::string roomId = requestData["roomId"];
            json newInfo = requestData["newInfo"];
            bool success = editRoom(roomId, newInfo);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Post("/admin/delete-room", [](const httplib::Request& req, httplib::Response& res) {
            debugLog("Received POST request to /admin/delete-room");
            debugLog("Request body:", json::parse(req.body));
            
            json requestData = json::parse(req.body);
            std::string roomId = requestData["roomId"];
            bool success = deleteRoom(roomId);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Post("/admin/add-user", [](const httplib::Request& req, httplib::Response& res) {
            json userInfo = json::parse(req.body);
            bool success = addUser(userInfo);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        svr.Post("/admin/remove-user", [](const httplib::Request& req, httplib::Response& res) {
            auto email = req.get_param_value("email");
            bool success = removeUser(email);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        svr.Post("/admin/edit-user", [](const httplib::Request& req, httplib::Response& res) {
            auto email = req.get_param_value("email");
            json newInfo = json::parse(req.body);
            bool success = editUser(email, newInfo);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        svr.Post("/admin/remove-booking", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            debugLog("Received POST request to /admin/remove-booking");
            
            json requestData = json::parse(req.body);
            std::string bookingId = requestData["bookingId"];
            bool success = removeBooking(bookingId);
            
            json response = {{"success", success}};
            debugLog("Sending response:", response);
            res.set_content(response.dump(), "application/json");
        });

        svr.Get("/admin/bookings", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json bookings = getAllBookings();
            res.set_content(bookings.dump(), "application/json");
        });

        svr.Get(R"(/admin/bookings/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto bookingId = req.matches[1].str();
            json booking = getBooking(bookingId);
            if (!booking.is_null()) {
                res.set_content(booking.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(json({{"error", "Booking not found"}}).dump(), "application/json");
            }
        });

        svr.Delete(R"(/admin/bookings/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto bookingId = req.matches[1].str();
            bool success = removeBooking(bookingId);
            if (success) {
                res.set_content(json({{"success", true}}).dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(json({{"error", "Booking not found or could not be deleted"}}).dump(), "application/json");
            }
        });

        svr.Get("/admin/users", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json users = getAllUsers();
            res.set_content(users.dump(), "application/json");
        });

        svr.Post("/admin/users", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json userInfo = json::parse(req.body);
            bool success = addUser(userInfo);
            res.set_content(json({{"success", success}}).dump(), "application/json");
        });

        svr.Put("/admin/users/:email", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto email = req.path_params.at("email");
            json newInfo = json::parse(req.body);
            json result = updateUserInfo(email, newInfo);
            if (result["success"]) {
                res.set_content(result.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(result.dump(), "application/json");
            }
        });

        svr.Delete(R"(/admin/users/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto email = req.matches[1].str();
            bool success = removeUser(email);
            if (success) {
                res.set_content(json({{"success", true}}).dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(json({{"error", "User not found or could not be deleted"}}).dump(), "application/json");
            }
        });

        svr.Get("/admin/room-booking-stats", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json stats = getRoomBookingStats();
            res.set_content(stats.dump(), "application/json");
        });

        svr.Get("/admin/booking-dates", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json dates = getBookingDates();
            res.set_content(dates.dump(), "application/json");
        });

        svr.Get("/admin/coupons", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json coupons = getAllCoupons();
            res.set_content(coupons.dump(), "application/json");
        });

        svr.Post("/admin/coupons", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            json couponData = json::parse(req.body);
            json result = addCoupon(couponData);
            res.set_content(result.dump(), "application/json");
        });

        svr.Put(R"(/admin/coupons/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto couponName = req.matches[1].str();
            json couponData = json::parse(req.body);
            json result = updateCoupon(couponName, couponData);
            if (result["success"]) {
                res.set_content(result.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(result.dump(), "application/json");
            }
        });

        svr.Delete(R"(/admin/coupons/(.+))", [](const httplib::Request& req, httplib::Response& res) {
            setCorsHeaders(res);
            auto couponName = req.matches[1].str();
            json result = deleteCoupon(couponName);
            if (result["success"]) {
                res.set_content(result.dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(result.dump(), "application/json");
            }
        });

        std::cout << "Server started on http://localhost:8080" << std::endl;
        svr.listen("localhost", 8080);

        return 0;
    }
