#!/bin/bash

adminConsoleHost="localhost"
kuzzleHost="localhost"
adminConsolePort="3000"
kuzzlePort="7512"

# Cypress can't be installed as a dev dependency since it
# makes the Netlify build extremely slow.
npm install --no-save cypress
if [ -z $e2eLocal ]; then
  npm run dev &
fi

echo
echo " ### Kuzzle Admin Console End to End tests ###"
echo "     ====================================="
echo

echo " Waiting for Kuzzle to be up at http://$kuzzleHost:$kuzzlePort"
echo
while ! curl -f -s -o /dev/null "http://$kuzzleHost:$kuzzlePort"
do
    echo -ne ". "
    sleep 5
done

echo
echo -ne " Kuzzle is up!"
echo

echo " Waiting for Kuzzle Admin Console to be up at http://$adminConsoleHost:$adminConsolePort"
echo
while ! curl -f -s -o /dev/null "http://$adminConsoleHost:$adminConsolePort"
do
    echo -ne ". "
    sleep 5
done
echo -ne " Let's go!"
echo
echo

set -e

if [[ -z "$e2eLocal" ]]; then
  $(npm bin)/cypress run --record
else
  $(npm bin)/cypress open
fi

if [ -z $e2eLocal ]; then
  pkill -f "dev-server.js"
fi