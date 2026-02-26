#!/bin/bash

SCRIPT_NAME=${1:-start} 

caffeinate -imsu npm run "$SCRIPT_NAME"
