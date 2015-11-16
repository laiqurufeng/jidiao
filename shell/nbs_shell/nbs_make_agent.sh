#!/bin/bash

agentCD=/Users/apple/Documents/android_studio_workspace/android-agent

cd $agentCD
mvn -f pom-debug.xml clean package
open target/
