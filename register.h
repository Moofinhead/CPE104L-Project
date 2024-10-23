#pragma once
#ifndef REGISTER_H
#define REGISTER_H

#include <string>
#include "nlohmann/json.hpp"
using namespace std;
bool userExists(const string& username, const string& email);
void appendUser(const string& username, const string& email, const string& password);
void handleRegistration(const string& username, const string& email, 
                        const string& password, const string& confirmPassword, 
                        int& status, string& message);

#endif // REGISTER_H