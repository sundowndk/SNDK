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
rm "$OUTPUTDIR/sndk/" -r
rm "$OUTPUTDIR/sndk"

####################################################
# SETUP                                            #
####################################################
mkdir "$OUTPUTDIR/sndk/"

####################################################
# CSS                                              #
####################################################
echo "Bulding 'css'..."
mkdir "$OUTPUTDIR/sndk/css"
CSSFILE="$OUTPUTDIR/sndk/css/sndk.css"
touch "$CSSFILE"
find resources/css -maxdepth 1 -type f -name '*.css' | sort | while read filename; do
    cat "$filename"
done > $CSSFILE

cp -rv "resources/css/images/" "$OUTPUTDIR/sndk/css/"
cp -rv "resources/css/widgets/" "$OUTPUTDIR/sndk/css/"

####################################################
# INCLUDES                                         #
####################################################
echo "Copying 'includes'..."
for file in resources/includes*; do
    cp -rv $file "$OUTPUTDIR/sndk/"
done

####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'javascript'..."
mkdir "$OUTPUTDIR/sndk/js"
jsbuilder javascript.jsb "$OUTPUTDIR/sndk/js/"
