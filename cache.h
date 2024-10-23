#pragma once

#include <unordered_map>
#include <list>
#include <string>
#include "nlohmann/json.hpp"

/**
 * @class LRUCache
 * @brief Implements a Least Recently Used (LRU) cache for JSON data.
 * 
 * This class provides a fixed-size cache that stores JSON objects associated with string keys.
 * When the cache is full, the least recently used item is evicted to make room for new items.
 */
class LRUCache {
private:
    int capacity;  // Maximum number of items the cache can hold
    std::list<std::pair<std::string, nlohmann::json>> cache;  // List to store key-value pairs
    std::unordered_map<std::string, std::list<std::pair<std::string, nlohmann::json>>::iterator> map;  // Map for O(1) lookup

public:
    /**
     * @brief Construct a new LRUCache object.
     * @param capacity The maximum number of items the cache can hold.
     */
    LRUCache(int capacity);

    /**
     * @brief Retrieve a JSON object from the cache.
     * @param key The key associated with the JSON object.
     * @return nlohmann::json The JSON object if found, or an empty JSON object if not found.
     */
    nlohmann::json get(const std::string& key);

    /**
     * @brief Insert or update a JSON object in the cache.
     * @param key The key associated with the JSON object.
     * @param value The JSON object to be stored.
     */
    void put(const std::string& key, const nlohmann::json& value);
};

/**
 * @brief Load a JSON object from a file, using a cache for efficiency.
 * @param filename The name of the file to load.
 * @return nlohmann::json The loaded JSON object.
 */
nlohmann::json loadJsonFromFile(const std::string& filename);

/**
 * @brief Save a JSON object to a file and update the cache.
 * @param filename The name of the file to save to.
 * @param data The JSON object to be saved.
 */
void saveJsonToFile(const std::string& filename, const nlohmann::json& data);
