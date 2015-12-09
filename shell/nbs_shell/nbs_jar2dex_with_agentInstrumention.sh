#!/bin/bash

##此脚本用于在设置了听云javaagent变量后, 直接将jar包转成dex
DXCD=/Users/apple/android/sdk/build-tools/23.0.2/dx
rewriterCD=/Users/apple/Documents/android_studio_workspace/class-rewriter/target/nbs.newlens.class.rewriter.jar
agentCD=/Users/apple/Documents/android_studio_workspace/android-agent/target/nbs.newlens.agent.jar
##rewriter起作用必须要有agent在环境变量中.
$DXCD -Jjavaagent:${rewriterCD} --dex --output class.dex ${agentCD} $1 