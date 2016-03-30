function tingyunClass(arg1,arg2,arg3){


    var nbsJsBridge={};
    nbsJsBridge.javascriptError=function jsError( url,  requestMethod,  message,  line,  column, description,  sourceUrl,  allStack){

        console.log("logJsError-->url:" + url + ",requestMethod:" + requestMethod + ",message:" + message
                    					+ ",line:" + line + ",column:" + column + ",description:" + description + ",sourceUrl:" + sourceUrl
                    					+ ",allStack:" + allStack);
    };
    nbsJsBridge.logView=function view( url,  requestMethod,  responseTime,  pageLoadTime,
                   resolveDNSTime,  connectTime,  sslTime,  fetchCacheTime,  firstPacketTime,
      			 loadDomTime,  browserRenderTime,  serverQueueingTime,  applicationTime,
      			 networkTime,  frontEndTime,  jsErrors,  httpStatusCode,  errorCode,
      			 appData){

        console.log("logView-->with 19arguments has invoked");

    };

     nbsJsBridge.logNetwork=function network( url,  method,  start,  latency,  sent,  responseDataSize, httpStatusCode){
        console.log("logNetwork-->method:" + method + ",url:" + url + ",latency:" + latency
                    				+ ",httpstatuscode:" + httpStatusCode + ",responseDataSize:" + responseDataSize + ",sent:" + sent
                    				+ ",start:" + start + ".");
     };
     nbsJsBridge.logDebug=function debug(str){
        console.log("logDebug"+ str)
     }



    //============================================上面是debug部分==============================================





    var returnStr = 'SUCCESSFORMJS';
    var needValueReturn = arg1;   //是通过回调java代码还是通过返回值
    var needInstrumentOnError = arg2;  //是否监控JSError
    var needTingyunHttpMonitor = arg3; //是否监控Ajax数据.
    var tingyunJsErrors=0;// 用于记录一次load界面.js Error的数量.


    tingyunHttpMonitor = function monitorHttp() {
        var oldOpen = XMLHttpRequest.prototype.open,
            oldSend = XMLHttpRequest.prototype.send;

        //method, uri, async, user, pass
        XMLHttpRequest.prototype.open = function (method, uri, async, user, pass) {
            this._method = method,
                this._url = uri,
                oldOpen.call(this, method, uri, async, user, pass)
        },

        XMLHttpRequest.prototype.send = function (vData) {
            function stateChange() {
                if (4 == object.readyState) {
                    var endTime = (new Date).getTime(), elapsed = endTime - startTime,sendbytes=0;
                    nbsJsBridge.logDebug("ajax execute send() with arguments.length:"+(arguments.length));
                    try{
                        if(typeof vData==="string"){
                            sendbytes=vData.length;
                        }
                    }catch(e){
                        nbsJsBridge.logDebug("get sendbytes occur an error,"+e.toString());
                    };

                    var info = {
                        method: method,
                        url: vURL,
                        latency: elapsed.toString(),
                        httpStatusCode: object.status.toString(),
                        responseDataSize: object.responseText.length,
                        start: startTime,
                        sent: sendbytes
                    };
                    var path = window.location.href;
                    nbsJsBridge.logNetwork(path,info.url, info.method, info.start,info.latency, info.sent,info.responseDataSize,info.httpStatusCode) //没有error的各种信息.

                }
            }

            var object = this, method = this._method, vURL = this._url;
            var startTime = (new Date).getTime();
            this.addEventListener("readystatechange", stateChange, !1);
            oldSend.call(this, vData);
        }
    }

    tingyunErrorInstrument = function instrumentOnError() {
        nbsJsBridge.logDebug("instrument on error");
        console.log("instrument on error");

        function nbs_error_catch(errorEvent) {   //这里传递的时onError.
            if (typeof(errorEvent.filename) == "undefined") {
                var url = ""
            } else {
                var url = errorEvent.filename
            }

            if (typeof(errorEvent.lineno) == "undefined") {
                var lineNumber = -1;
            } else {
                var lineNumber = errorEvent.lineno;
            }
            if(typeof(errorEvent.colno=="undefined")){
                var col=-1
            }else{
                var col=errorEvent.colno
            }
            if (typeof(errorEvent.message) == "undefined") {
                var errorMsg = ""
            } else {
                var errorMsg = errorEvent.message
            }
            if (typeof(errorEvent.error.stack) == "undefined") {
                var allStack = ""
            } else {
                var allStack = errorEvent.error.stack
            }
            var href=document.location.href;
            nbsJsBridge.javascriptError(url,"", errorMsg, lineNumber, col, "",href, allStack);
        }
        window.addEventListener("error", nbs_error_catch, false);

    }

    tingyunViewMonitor = function () {
        {
            var currentView = window.location.pathname, host = window.location.host;
            window.location.protocol
        }
        setTimeout(function () {
            nbsJsBridge.logDebug("start to collect viewMonitor data");
            try{
                var responseTime=window.performance.timing.responseEnd - window.performance.timing.navigationStart; //response流读完的时间(ResponseTime)
                var pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;  //从开始页面请求到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – navigationStart
                var	resolveDNSTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart; //dns解析时间
                var	connectTime = -1;
                var sslTime=-1;	 	 //ssltime  = window.performance.timing.安卓机器不支持  //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/secureConnectionStart
                var fetchCacheTime = window.performance.timing.responseEnd - window.performance.timing.fetchStart;
                var firstPacketTime = window.performance.timing.responseStart -window.performance.timing.navigationStart;//这个数字不对
                //var firstPacketTime=-1;
                var	 loadDomTime  = window.performance.timing.domContentLoadedEventEnd -window.performance.timing.responseStart;
                var	 browserRenderTime = window.performance.timing.loadEventEnd - window.performance.timing.domContentLoadedEventEnd;
                var	 serverQueueingTime=-1;
                var	 applicationTime=-1;
                var	 networkTime =-1;
                var	 frontEndTime =loadDomTime+browserRenderTime;

                var httpStatuscode=0;
                var errorCode=0;
                var appData="";
                var requestUrl =window.location.href; //完整的url; http://devdocs.io/dom/location
                var method="GET";

               if(needValueReturn){

                   console.log("needValueReturn:requestUrl " +requestUrl +",responseTime" +responseTime);
                   var monitorJson={};
                   monitorJson.requestUrl=requestUrl;
                   monitorJson.method=method;
                   monitorJson.responseTime=responseTime;
                   monitorJson.pageLoadTime=pageLoadTime;
                   monitorJson.resolveDNSTime=resolveDNSTime;
                   monitorJson.connectTime=connectTime;
                   monitorJson.sslTime=sslTime;
                   monitorJson.fetchCacheTime=fetchCacheTime;
                   monitorJson.firstPacketTime=firstPacketTime;
                   monitorJson.loadDomTime=loadDomTime;
                   monitorJson.browserRenderTime=browserRenderTime;
                   monitorJson.serverQueueingTime=serverQueueingTime;
                   monitorJson.applicationTime=applicationTime;
                   monitorJson.networkTime=networkTime;
                   monitorJson.frontEndTime=frontEndTime;
                   monitorJson.tingyunJsErrors=tingyunJsErrors;
                   monitorJson.httpStatuscode=httpStatuscode;
                   monitorJson.errorCode=errorCode;
                   monitorJson.appData=appData
                   returnStr = returnStr + JSON.stringify(monitorJson);
               }else {
                   nbsJsBridge.logView(requestUrl,method,responseTime,pageLoadTime,
                       resolveDNSTime,connectTime,sslTime,fetchCacheTime,firstPacketTime,
                       loadDomTime,browserRenderTime,serverQueueingTime,applicationTime,
                       networkTime,frontEndTime,tingyunJsErrors,httpStatuscode,errorCode,
                       appData);
               }

            }catch(e){
                nbsJsBridge.logDebug("collect viewMonitor data occur an error:" + e.message+","+ e.toString());
            }
        }, 0)
    };

    try{

        if (needTingyunHttpMonitor) {
            tingyunHttpMonitor();
        }

        if (needInstrumentOnError){
            tingyunErrorInstrument();
        }

       tingyunViewMonitor();

        if(needValueReturn){
          setTimeout(function () {   //js是单线程运行的,要等tingyunViewMonitor的setTimeout()运行完.
            console.log("returnStr:"+returnStr);
            return returnStr;
          },0)
        }

    }catch(e) {
       nbsJsBridge.logDebug("collect viewMonitor data occur an error:" + e.message+","+ e.toString());

    }


};





