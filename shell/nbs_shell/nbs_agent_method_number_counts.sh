#!/bin/bash
nowPath=$(pwd)
filePath=$(cd "$(dirname "$0")"; pwd)
echo ".sh Path is ${filepath}"

##此脚本用于在设置了听云javaagent变量后, 直接将jar包转成dex
DXCD=/Users/apple/android/sdk/build-tools/23.0.2/dx
rewriterCD=/Users/apple/Documents/android_studio_workspace/class-rewriter/target/nbs.newlens.class.rewriter.jar
agentCD=/Users/apple/Documents/android_studio_workspace/android-agent/target/nbs.newlens.agent.jar
##rewriter起作用必须要有agent在环境变量中.

cd $filePath
##清除并生成新的classes

##切换到脚本目录
rm -rf method_countsLib/class.dex
$DXCD -Jjavaagent:${rewriterCD} --dex --output method_countsLib/class.dex ${agentCD} 

##查找方法数
java -jar  method_countsLib/dex-method-counts.jar method_countsLib/class.dex

##切换会原来的路径.
rm -rf method_countsLib/class.dex

cd $nowPath

