cmake_minimum_required(VERSION 3.26)
project(plugin)

set(CMAKE_CXX_STANDARD 20)

file(GLOB_RECURSE SOURCES "*.cpp" "*.h")
include_directories(.)

add_library(plugin MODULE ${SOURCES})

set_target_properties(plugin PROPERTIES
        BUNDLE True
        MACOSX_BUNDLE_GUI_IDENTIFIER nu.shu
        MACOSX_BUNDLE_BUNDLE_NAME project448
        MACOSX_BUNDLE_BUNDLE_VERSION "1.0"
        MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
)
