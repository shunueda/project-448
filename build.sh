#!/bin/bash

source .env
cmake --build plugin/cmake-build-debug --target Project448
cp -r plugin/cmake-build-debug/Project448.bundle "${VDJ_DIR}/PluginsMacArm/SoundEffect"
