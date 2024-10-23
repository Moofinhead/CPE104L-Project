#ifndef LOGIN_H
#define LOGIN_H

#include <string>
using namespace std;
void handleLogin(const string& email, const string& password,
    int& status, string& message, string& nickname, bool& isAdmin);

#endif // LOGIN_H