#!/bin/sh
# @Author: BeryJu
# @Date:   2013-12-26 16:32:04
# @Email:  jenslanghammer@gmail.com
# @Last Modified by:   BeryJu
# @Last Modified time: 2013-12-26 17:18:27
mkdir -p "nw/linux-64"
FILE="nw"
pwd

if [ -f $FILE ];
then
	nw/linux-64/nw bin/
else
	cd "nw/linux-64"
	wget "http://s3.amazonaws.com/node-webkit/v0.8.3/node-webkit-v0.8.3-linux-x64.tar.gz"
	tar xvzf "node-webkit-v0.8.3-linux-x64.tar.gz"
	cd "node-webkit-v0.8.3-linux-x64"
	mv * ..
	cd ..
	rm -rf "node-webkit-v0.8.3-linux-x64"
	cd ../..
	nw/linux-64/nw bin/
fi
