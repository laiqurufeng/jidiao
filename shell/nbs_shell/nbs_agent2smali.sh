#!/bin/bash
##此bash 脚本用于将android-agent目录下的tingyun sdk agent打包反编译成smali.


AGENT_CD="/Users/apple/Documents/android_studio_workspace/android-agent"
SMALI_CD="/Users/apple/jidiao_work/work_apk/smali_make"
##切换到agent 目录,执行mvn 命令.
cd $AGENT_CD;mvn -f pom-debug.xml clean package;
##拷贝 agent.jar到smali_make目录
cp -f target/nbs.newlens.agent.jar $SMALI_CD/libs
##编译apk
cd $SMALI_CD
export ANT_OPTS='-javaagent:/Users/apple/Documents/android_studio_workspace/class-rewriter/target/nbs.newlens.class.rewriter.jar'
ant clean debug
cd bin/
##对生成的MainActivity-debug.apk 进行处理.
source ~/.zshrc
apktool d MainActivity-debug.apk
open MainActivity-debug/smali/com/



