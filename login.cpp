#include "login.h"
#include <iostream>
#include <fstream>
#include "nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

void handleLogin(const string& email, const string& password, 
                 int& status, string& message, string& nickname, bool& isAdmin) {
    ifstream file("users.json");
    if (!file.is_open()) {
        cerr << "Error opening file for reading" << endl;
        status = 500;
        message = "Internal server error";
        return;
    }

    json users;
    file >> users;

    auto it = find_if(users.begin(), users.end(),
        [&email, &password](const json& user) {
            return user["email"].get<string>() == email &&
                   user["password"].get<string>() == password;
        });

    if (it != users.end()) {
        status = 200;
        message = "Login successful";
        nickname = (*it)["username"].get<string>();
        isAdmin = (*it)["is_admin"].get<bool>();
        cout << "User logged in successfully: " << email << " (Admin: " << (isAdmin ? "Yes" : "No") << ")" << endl;
    } else {
        status = 401;
        message = "Invalid email or password";
        isAdmin = false;
        cout << "Login failed for email: " << email << endl;
    }
}
