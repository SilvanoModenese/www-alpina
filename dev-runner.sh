#!/bin/bash

# runs "www-alpina" in dev mode
# don't use this on production

set -e

export PORT="3000"
export NODE_ENV="testing"
export DEBUG="*"

node index.js
