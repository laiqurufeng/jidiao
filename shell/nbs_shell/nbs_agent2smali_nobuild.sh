#!/bin/bash
##此bash 脚本用于将android-agent目录下的tingyun sdk agent打包反编译成smali.


AGENT_CD=`pwd`
SMALI_CD="/Users/apple/jidiao_work/work_apk/smali_make"

echo $AGENT_CD
cd $SMALI_CD
ant clean

##-f pom-debug.xml
##拷贝 agent.jar到smali_make目录
cp -f nbs.newlens.agent.jar $SMALI_CD/libs
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



