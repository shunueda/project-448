cmake_minimum_required(VERSION 3.26)
project(Project448)

set(CMAKE_CXX_STANDARD 20)

find_package(CURL REQUIRED)
include_directories(${CURL_INCLUDE_DIRS} ${CMAKE_SOURCE_DIR}/include ${CMAKE_SOURCE_DIR}/include/websocketpp)

set(Boost_USE_STATIC_LIBS OFF)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)
find_package(Boost 1.45.0 COMPONENTS filesystem regex)

include_directories(${Boost_INCLUDE_DIRS})

file(GLOB_RECURSE SOURCES "*.cpp" "*.h" "*.cc" "*.hpp")

add_library(Project448 MODULE ${SOURCES})
set_target_properties(Project448 PROPERTIES
        BUNDLE True
        MACOSX_BUNDLE_GUI_IDENTIFIER nu.shu
        MACOSX_BUNDLE_BUNDLE_NAME project448
        MACOSX_BUNDLE_BUNDLE_VERSION "1.0"
        MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
)

target_link_libraries(Project448 ${CURL_LIBRARIES})
