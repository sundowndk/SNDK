#!/bin/bash
#
# Usage: build.sh [outputdirectory]

####################################################
# INIT                                             #
####################################################
BASEDIR=$(dirname "$1")
OUTPUTDIR="$1"

####################################################
# CLEAN                                            #
####################################################
echo "Cleaning previous build..."
rm "$OUTPUTDIR/html/sndk/" -r

####################################################
# SETUP                                            #
####################################################
echo "Setting up build structur..."
mkdir "$OUTPUTDIR/html/sndk/"
mkdir "$OUTPUTDIR/html/sndk/css"
mkdir "$OUTPUTDIR/html/sndk/html"
mkdir "$OUTPUTDIR/html/sndk/js"
mkdir "$OUTPUTDIR/html/sndk/includes"

####################################################
# JS                                               #
####################################################
echo "Building JAVASCRIPT..."
jsbuilder sndk.jsb "$OUTPUTDIR/html/sndk/js/"

####################################################
# CSS                                              #
####################################################
echo "Bulding CSS..."
CSSFILE="$OUTPUTDIR/html/sndk/css/sndk.css"
touch "$CSSFILE"
#find css -type f -name *.css -exec cat "{}" >> "$CSSFILE"  \;

find css -type f -name '*.css' | sort | while read filename; do
    cat "$filename"
done > $CSSFILE



cp -rv "css/images/" "$OUTPUTDIR/html/sndk/css/"

####################################################
# HTML                                             #
####################################################
echo "Building HTML..."
for file in html/*; do
echo $file
    cp -rv $file "$OUTPUTDIR/html/sndk/html/"
done

####################################################
# INCLUDES		                                   #
####################################################
echo "Bulding INCLUDES..."
for file in includes/*; do
echo $file
    cp -rv $file "$OUTPUTDIR/html/sndk/includes/"
done

