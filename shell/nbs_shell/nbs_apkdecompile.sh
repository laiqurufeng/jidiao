#!/bin/bash

##此脚本用于把apk反编译,并且输出一些信息到decompile_info.txt 文件中.

##脚本的参数必须是2个.第一个是apk,第二个是反编译的路径名.
if [ "$#" != "2" ];then
	echo "param not set or param num wrong,param num must be 2"; exit 1
fi

apkName=$1
FilePath=$2

##apk反编译的Dictory,解压apk的目录,反编译相关信息存储的文件夹
decompilePath=decompile
unzipPath=unzip
decompileInfo=decompile_info.txt

##使用当前年月日作为父目录,如2015.11
timePath=`date +%Y`.`date +%m`
parentPath="/Users/apple/jidiao_work/work_apk/custom_apk/${timePath}"

##复制apk到相应目录并切换到相应目录
####mkdir的-p	--parents	此选项后，可以是一个路径名称。若路径中的某些目录尚不存在，系统将自动建立好那些尚不存在的目录。-v 每次创建新目录都显示信息
apkPath="${parentPath}/${FilePath}"
mkdir -pv $apkPath

cp -f ${apkName} ${apkPath}
cd $apkPath

####截断apkName的名字.防止apkName带有路径
apkName=`basename ${apkName}`
echo "apkName is :${apkName}"

##解压apk
unzip ${apkName} -d ${unzipPath}  >/dev/null
echo "unzip apk :${apkName}"


##apktool反编译
cd ${apkPath}
echo "apktool decompile apk :${apkName}"
apktool d -f ${apkName} -o ${decompilePath} &> ${decompileInfo}

####获取apktool 操作的返回值,判断是否出错.
result=$? ##查看上一条命令的返回值.0代表成功. >>代表追加
echo "apktool decompile result is ${result}" >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}

 

##grep 关键的字符串到decompile_info.txt中, 因为multidex的存在原因. smali文件夹可能有多个.
echo "start  to grep nbs information"
smaliPath=${apkPath}/${decompilePath}/smali*
echo "samliPath is ${smaliPath}"



####NBSAgent的版本号. 因为多dex的关系.不能只搜索smali目录.
echo '#######NBSAgent Version######'  >> $decompileInfo

grep -rsn -A 5 ".method public static getVersion()Ljava/lang/String;" ${smaliPath} >>  ${decompileInfo}

echo '#######NBSAgent Version----end##########################' >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}


####isInstrumention
echo '#######NBSAgent isInstrumention()######'  >> $decompileInfo

grep -rsn -A 5 ".method private isInstrumented()Z" ${smaliPath} >>  ${decompileInfo}

echo '#######NBSAgent isInstrumention()----end##########################' >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}

 
####setLicenseKey
echo '#######setLicenseKey()######'  >> $decompileInfo

grep -rsn setLicenseKey ${smaliPath} >>  ${decompileInfo}

echo '#######setLicenseKey()----end##########################' >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}


####NBSInstrumentation
echo '#######NBSInstrumentation######'  >>${decompileInfo}

grep -rsn "NBSInstrumentation" ${smaliPath}  >>${decompileInfo}

echo '#######NBSInstrumentation----end##########################' >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}


####WebView
echo '#######WebView######'  >>${decompileInfo}

nbswebview="super Lcom/networkbench/agent/impl/instrumentation/NBSWebViewClient"
WebView="super Landroid/webkit/WebViewClient"

grep -rsn "${WebView}" ${smaliPath}  >>${decompileInfo}

echo -e "\n"  >> ${decompileInfo}
grep -rsn "${nbswebview}" ${smaliPath}  >>${decompileInfo}

echo '#######WebView----end##########################' >> ${decompileInfo}
echo -e "\n\n\n" >> ${decompileInfo}


####OKhttp
echo '#######OKhttp######'  >> ${decompileInfo}

echo 'Okhttp version --' >> ${decompileInfo}
####对应com.squareup.okhttp.internal.Version类的userAgent() 方法,查看okhttp的版本号
grep -rsn -A 5 ".method public static userAgent()Ljava/lang/String;" ${smaliPath}   >>${decompileInfo}
echo  -e "\n" >>${decompileInfo}

grep -rsn "NBSOkHttp2Instrumentation" ${smaliPath}   >>${decompileInfo}

echo '#######OKhttp----end##########################' >> ${decompileInfo}
echo -e  "\n\n\n" >> ${decompileInfo}



###打开相应目录
open ${apkPath}
