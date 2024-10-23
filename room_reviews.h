#pragma once
#ifndef ROOM_REVIEWS_H
#define ROOM_REVIEWS_H

#include <string>
#include "nlohmann/json.hpp"
using namespace std;
using json = nlohmann::json;
//wala na toh bahala na
void addRoomReview(int roomId, const string& username, const string& comment, int rating);
json getRoomReviews(int roomId);
void updateRoomRating(int roomId);

#endif // ROOM_REVIEWS_H