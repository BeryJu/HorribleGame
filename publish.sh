#!/bin/bash
cd /var/www/stuff/HorribleGame
rm -r *
cd /var/www/dev/projects/HorribleGame/dist/
cp -R * /var/www/stuff/HorribleGame
cd /var/www/stuff/HorribleGame