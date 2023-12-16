#include <iostream>
#include <string>
#include <curl/curl.h>
#include "util.h"

void post(const std::string &data) {
    CURL *curl;
    CURLcode res;
    struct curl_slist *headers = NULL; // Initialize a slist for headers

    curl = curl_easy_init();
    if (curl) {
        // Set the headers
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // Other CURL options
        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/");
        std::string jsonData = R"({"text": ")" + data + "\"}";
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonData.c_str());

        // Perform the request
        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        }

        // Cleanup
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers); // Free the header list
    }
}