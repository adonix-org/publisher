#!/bin/bash

SCRIPT_NAME=${1:-live} 

caffeinate -imsu npm run debug "$SCRIPT_NAME"
