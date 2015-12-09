#!/bin/bash

##此脚本用于在设置了newrelic javaagent变量后, 直接将jar包转成dex
DXCD=/Users/apple/android/sdk/build-tools/23.0.2/dx
rewriterCD=/Users/apple/work/jar_repo/NewRelic/newrelic_local_gradle/newrelic/plugin/class.rewriter.jar
agentCD=/Users/apple/work/jar_repo/NewRelic/newrelic_local_gradle/newrelic/agent/android.jar
##rewriter起作用必须要有agent在环境变量中.
$DXCD -Jjavaagent:${rewriterCD} --dex --output class.dex ${agentCD} $1 