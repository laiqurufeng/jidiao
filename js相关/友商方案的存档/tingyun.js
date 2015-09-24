!function TingyunClass(){

 	//http monitor,用于监测ajax数据.
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
                    nbsJsBridge.logNetwork(info.url, info.method, info.start,info.latency, info.sent,info.responseDataSize,info.httpStatusCode) //没有error的各种信息.

                }
            }

                var object = this, method = this._method, vURL = this._url;
                var startTime = (new Date).getTime();
                this.addEventListener("readystatechange", stateChange, !1);
                oldSend.call(this, vData);
            }
    }

    tingyunInstrument = function instrumentOnError() {
        nbsJsBridge.logDebug("instrument on error");
        console.log("instrument on error");
        var oldErrorHandler = window.onerror;
        viewMonitor = function () {
            {
                var currentView = window.location.pathname, host = window.location.host;
                window.location.protocol
            }
            setTimeout(function () {
                nbsJsBridge.logDebug("start to collect viewMonitor data");
                try{
                    var responseTime=window.performance.timing.responseEnd - window.performance.timing.responseStart; //response流读完的时间(ResponseTime)
                    nbsJsBridge.logDebug("responseTime:"+responseTime);
                    var pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;  //从开始页面请求到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – navigationStart
                     nbsJsBridge.logDebug("pageLoadTime:"+pageLoadTime);
                    var	resolveDNSTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart; //dns解析时间
                     nbsJsBridge.logDebug("resolveDNSTime:"+resolveDNSTime);
                    var	connectTime = window.performance.timing.domComplete - window.performance.timing.domLoading; //domloading的时间
                     nbsJsBridge.logDebug("connectTime:"+connectTime);
                    var sslTime=-1;	 	 //ssltime  = window.performance.timing.安卓机器不支持  //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/secureConnectionStart
                    var fetchCacheTime = window.performance.timing.responseEnd - window.performance.timing.fetchStart;
                     nbsJsBridge.logDebug("fetchCacheTime:"+fetchCacheTime);
                    var firstPacketTime = window.performance.timing.responseStart -window.performance.timing.navigationStart;//这个数字不对
                    //var firstPacketTime=-1;
                    nbsJsBridge.logDebug("firstPacketTime:"+firstPacketTime);
                    var	 loadDomTime  = window.performance.timing.domContentLoadedEventEnd -window.performance.timing.responseStart;
                    nbsJsBridge.logDebug("loadDomTime:"+loadDomTime);
                    var	 browserRenderTime = window.performance.timing.loadEventEnd - window.performance.timing.domContentLoadedEventEnd;
                    nbsJsBridge.logDebug("browserRenderTime:"+browserRenderTime);
                    var	 serverQueueingTime=-1;
                    var	 applicationTime=-1;
                    var	 networkTime =-1;
                    var	 frontEndTime =loadDomTime+browserRenderTime;

                    var httpStatuscode=0;
                    var errorCode=0;
                    var appData="";
                    var requestUrl =window.location.href; //完整的url; http://devdocs.io/dom/location
                    nbsJsBridge.logDebug("requestUrl:"+requestUrl);
                    var method="GET";
                    nbsJsBridge.logView(requestUrl,method,responseTime,pageLoadTime,
                            resolveDNSTime,connectTime,sslTime,fetchCacheTime,firstPacketTime,
                            loadDomTime,browserRenderTime,serverQueueingTime,applicationTime,
                            networkTime,frontEndTime,tingyunJsErrors,httpStatuscode,errorCode,
                            appData);
                }catch(e){
                    nbsJsBridge.logDebug("collect viewMonitor data occur an error:" + e.message+","+ e.toString());
                    nbsJsBridge.javascriptError(e.message, e.line, e.lineNumber, e.toString(), e.columnNumber);
                    console.log(e.message+","+e.toString());
                }
            }, 0)
		};

        window.onload = viewMonitor;//替换window默认的onload.
        console.log("replace onload");
        nbsJsBridge.logDebug("replace onload");
       // tingyunErrorHandler(msg, url, line, col, errorObj);  //这行意义不明.
        window.onerror = function tingyunOnError(msg, url, line, col, errorObj) {
            console.log("window onerror called");
            tingyunJsErrors=tingyunJsErrors+1;
            tingyunErrorHandler(msg, url, line, col, errorObj);
            if (oldErrorHandler) {  //执行原本的onError.
                oldErrorHandler(msg, url, line, col, errorObj);
            }
        };

        this.tingyunHttpMonitor();
    }

    var tingyunJsErrors=0;// 用于记录一次load界面.js Error的数量.

	function tingyunErrorHandler(errorMsg, url, lineNumber, col, errorObj) {
        console.log("error handler");
        nbsJsBridge.logDebug("error handler");
        nbsJsBridge.logDebug("arguments.length:"+arguments.length);
        var href=document.location.href;
        var method="GET";
        
        try{
			nbsJsBridge.javascriptError(url,"", errorMsg, lineNumber, col, "",href, "nbs onError exec");
		}catch(e){
			nbsJsBridge.logDebug("collect js error data occur an error");
		  	nbsJsBridge.javascriptError(e.message, e.line, e.lineNumber, e.toString(), e.columnNumber);
		} 
 	}
 	tingyunInstrument();


 	var nbsJsBridge=new object();
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
}();





