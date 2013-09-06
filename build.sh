cd /var/www/dev/projects/HorribleGame/
mkdir tmp
cp -R assets tmp/
cp -R build tmp/
cp App.js tmp/
cp index.html tmp/
cp package.json tmp/
cp three.js tmp/
zip -r tmp/release.nw tmp/
cd tmp
cat /var/www/dev/nw/nw.exe release.nw > release.exe
mv release.exe /var/www/builds/HG\ -\ $BUILD_NUMBER.exe
cd ..
rm -r tmp/