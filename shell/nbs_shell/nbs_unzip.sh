if [ "$#" != "1" ];then
	echo "param not set or param num wrong,param num must be 1"; exit 1
fi

##获取当前路径,
basePath=$(pwd)  
unzipPath="unzip"

unzip $1 -d $unzipPath
cd ${basePath}/${unzipPath} 

d2j-dex2jar.sh classes.dex

open .