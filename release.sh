#!/bin/bash
npm i && npm run build && rm -rf node_modules && npm i --only=prod && git add node_modules/* src/* dist/*