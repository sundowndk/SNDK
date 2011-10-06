#!/bin/bash
#
# Simple build script for sndk.js
#
# v1.0 Initial version
#
# Usage: build.sh [outputdirectory]

####################################################
# INIT                                             #
####################################################
BASEDIR=$(dirname "$1")
OUTPUTDIR="$1/sndk"

####################################################
# CLEAN                                            #
####################################################
echo "Cleaning previous build..."
rm $OUTPUTDIR -r

####################################################
# SETUP                                            #
####################################################
echo "Setting up build structur..."
mkdir $OUTPUTDIR
mkdir "$OUTPUTDIR/js"

####################################################
# JS                                               #
####################################################
echo "Bulding JAVASCRIPT..."
jsbuilder sndk.jsb "$OUTPUTDIR/js/"

####################################################
# CSS                                              #
####################################################
echo "Bulding CSS..."
mkdir "$OUTPUTDIR/css"
CSSFILE="$OUTPUTDIR/css/sndk.css"
touch "$CSSFILE"
find css -type f -name *.css -exec cat "{}" >> "$CSSFILE"  \;
cp -rv "css/images/" "$OUTPUTDIR/css/"

####################################################
# INCLUDES		                                   #
####################################################
echo "Bulding INCLUDES..."
cp -rv "includes/" "$OUTPUTDIR/includes"


