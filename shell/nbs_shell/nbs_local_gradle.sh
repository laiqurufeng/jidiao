#!/bin/bash
AGENT_CD="/Users/apple/Documents/android_studio_workspace/android-agent"
LocalGradleCD=/Users/apple/work/jar_repo/tingyun_local_gradle/tingyun
rewriter_CD=/Users/apple/Documents/android_studio_workspace/class-rewriter

##切换到agent 目录,执行mvn 命令.
cd $AGENT_CD;mvn -f pom-debug.xml clean package;
##拷贝 agent.jar到smali_make目录
cp -f target/nbs.newlens.agent.jar ${LocalGradleCD}/agent

##处理rewriter
cd $rewriter_CD;mvn -f pom-debug.xml clean package
cp -f target/nbs.newlens.class.rewriter.jar  ${LocalGradleCD}/plugin

open $LocalGradleCD

