#!/bin/bash
##此bash 脚本用于将android-agent目录下的tingyun sdk agent打包反编译成smali.

##此版本用于企业版.  调用的时候需要在后面加上版本号

if [ "$#" != "1" ];then
	echo "param not set or param num wrong"; exit 1
fi

Version=$1
echo "compile business ,version is ${Version}"



AGENT_CD="/Users/apple/Documents/android_studio_workspace/android-agent-${Version}"
SMALI_CD="/Users/apple/jidiao_work/work_apk/smali_make"
REWRITER_CD="/Users/apple/Documents/android_studio_workspace/class-rewriter-${Version}"

echo "AGENT_CD is ${AGENT_CD}"
echo "REWRITER_CD is ${REWRITER_CD}"


##切换到agent 目录,执行mvn 命令.
cd $AGENT_CD;mvn -f pom-debug.xml clean package;
##拷贝 agent.jar到smali_make目录
cp -f target/nbs.newlens.agent.jar $SMALI_CD/libs


##切换到rewriter目录,执行mvn
cd $REWRITER_CD;mvn -f pom-debug.xml clean package;


##编译apk
cd $SMALI_CD
export ANT_OPTS="-javaagent:${REWRITER_CD}/target/nbs.newlens.class.rewriter.jar"
ant clean debug
cd bin/
##对生成的MainActivity-debug.apk 进行处理.
source ~/.zshrc
apktool d MainActivity-debug.apk
open MainActivity-debug/smali/com/



