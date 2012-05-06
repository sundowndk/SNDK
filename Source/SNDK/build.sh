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
rm "$OUTPUTDIR/www/" -r

####################################################
# SETUP                                            #
####################################################
mkdir "$OUTPUTDIR/www/"
mkdir "$OUTPUTDIR/www/sndk/"

####################################################
# CSS                                              #
####################################################
echo "Bulding 'css'..."
mkdir "$OUTPUTDIR/www/sndk/css"
CSSFILE="$OUTPUTDIR/www/sndk/css/sndk.css"
touch "$CSSFILE"
find css -type f -name '*.css' | sort | while read filename; do
    cat "$filename"
done > $CSSFILE

cp -rv "resources/css/images/" "$OUTPUTDIR/www/sndk/css/"

####################################################
# INCLUDES                                         #
####################################################
echo "Copying 'includes'..."
for file in resources/includes*; do
    cp -rv $file "$OUTPUTDIR/www/sndk/"
done

####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'javascript'..."
mkdir "$OUTPUTDIR/www/sndk/js"
jsbuilder javascript.jsb "$OUTPUTDIR/www/sndk/js/"
