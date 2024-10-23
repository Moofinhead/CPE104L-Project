#include "cache.h"
#include <fstream>
#include <iostream>

using namespace std;

LRUCache::LRUCache(int capacity) : capacity(capacity) {}

nlohmann::json LRUCache::get(const string& key) {
    if (map.find(key) == map.end()) {
        return nlohmann::json();
    }
    auto it = map[key];
    cache.splice(cache.begin(), cache, it);
    return it->second;
}

void LRUCache::put(const string& key, const nlohmann::json& value) {
    if (map.find(key) != map.end()) {
        cache.erase(map[key]);
    } else if (cache.size() >= capacity) {
        map.erase(cache.back().first);
        cache.pop_back();
    }
    cache.push_front({key, value});
    map[key] = cache.begin();
}

nlohmann::json loadJsonFromFile(const string& filename) {
    static LRUCache fileCache(5);  // Cache for 5 most recently used files

    nlohmann::json cachedJson = fileCache.get(filename);
    if (!cachedJson.is_null()) {
        return cachedJson;
    }

    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error opening file: " << filename << std::endl;
        return nlohmann::json();
    }

    nlohmann::json data;
    file >> data;
    fileCache.put(filename, data);
    return data;
}

void saveJsonToFile(const string& filename, const nlohmann::json& data) {
    static LRUCache fileCache(5);  // Cache for 5 most recently used files

    std::ofstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error opening file for writing: " << filename << std::endl;
        return;
    }

    file << data.dump(4);
    fileCache.put(filename, data);
}
