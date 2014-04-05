#!/bin/sh
#ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2 | tail -n 1
IP=`ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2 | tail -n 1`
echo "Updating settings.js with IP address:" $IP
cp Scavhn/web/scavhnapp/settings.js Scavhn/web/scavhnapp/settings.js.old
cat Scavhn/web/scavhnapp/settings.js | sed -E 's/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/'$IP'/g' Scavhn/web/scavhnapp/settings.js.old > Scavhn/web/scavhnapp/settings.js
rm Scavhn/web/scavhnapp/settings.js.old