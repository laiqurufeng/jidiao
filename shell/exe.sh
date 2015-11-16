#!/bin/bash

##作用, 将dx的参数分离, -J开头的去除-J后拼接到javaOpts. 其它的不变
javaOpts=""
expr "x$1" : 'x-J' ##>/dev/null 
echo $@

while expr "x$1" : 'x-J' >/dev/null; do
    opt=`expr "x$1" : 'x-J\(.*\)'`
    javaOpts="${javaOpts} -${opt}"
    if expr "x${opt}" : "xXmx[0-9]" >/dev/null; then
        defaultMx="no"
    fi
    shift
    echo $@
done
echo $javaOpts
echo ..${defaultMx}..

