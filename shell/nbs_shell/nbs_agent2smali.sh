#!/bin/bash
##此bash 脚本用于将android-agent目录下的tingyun sdk agent打包反编译成smali.


AGENT_CD="/Users/apple/Documents/android_studio_workspace/android-agent"
SMALI_CD="/Users/apple/jidiao_work/work_apk/smali_make"

cd $SMALI_CD
ant clean

##切换到agent 目录,执行mvn 命令.
cd $AGENT_CD;mvn -f pom-debug.xml clean package;
##-f pom-debug.xml
##拷贝 agent.jar到smali_make目录
cp -f target/nbs.newlens.agent.jar $SMALI_CD/libs
echo $SMALI_CD/libs
##编译apk
cd $SMALI_CD
export ANT_OPTS='-javaagent:/Users/apple/Documents/android_studio_workspace/class-rewriter/target/nbs.newlens.class.rewriter.jar'

echo "start ant ......"
ant clean debug -verbose
cd bin/
##对生成的MainActivity-debug.apk 进行处理.
source ~/.zshrc

echo "start apktool ......"

apktool d MainActivity-debug.apk
open MainActivity-debug/smali/com/





