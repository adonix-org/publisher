#!/bin/bash

SCRIPT_NAME=${1:-live} 

caffeinate -imsu npm run "$SCRIPT_NAME"
