if [ "$#" != "1" ];then
	echo "param not set or param num wrong,param num must be 1"; exit 1
fi

##获取当前路径,
basePath=$(pwd)  
apkVersion=$1


localGradle=/Users/apple/work/jar_repo/tingyun_local_gradle/tingyun


mvn -f pom-debug.xml clean package

##判断路径中是否有rewriter或者agent
rewriter=`grep 'rewriter' <<< $basePath >/dev/null && echo rewriter_yes || echo no`

agent=`grep 'agent' <<< $basePath >/dev/null && echo agent_yes || echo no`


echo $rewriter
echo $agent
##如果是rewriter,则复制到rewriter中
rewriterPath=${basePath}/target/nbs.newlens.class.rewriter.jar
localGradleRewriterPath=${localGradle}/plugin/$apkVersion/

if [ $rewriter == "rewriter_yes" ];then
	echo "compile tingyun rewriter";mkdir -p $localGradleRewriterPath; cp -f ${rewriterPath} ${localGradleRewriterPath};exit 1
fi

##如果是agent,则复制到agent中
agentPath=${basePath}/target/nbs.newlens.agent.jar
localGradleAgentPath=${localGradle}/agent/$apkVersion/

if [ $agent == "agent_yes" ];then
	echo "compile tingyun agent";mkdir -p $localGradleAgentPath; cp -f ${agentPath} ${localGradleAgentPath};exit 1
fi

##如果都没命中,则代表目录不对.
echo "not tingyun rewriter or tingyun agent"