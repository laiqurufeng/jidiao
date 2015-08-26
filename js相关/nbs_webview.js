javascript:!

var Nbs =function(){

	var nbsJsError= function(t,n){
		var method="GET";
		nbsJsBridge.javascriptError(t.url,"",t.message,-1,"",t.stack[0].url , "格式化error");
	};

	var  nbsXMLRequest =fuction () {		
		var tempOpen = XMLHTTPRequest.proto.open,
			tempSend = XMLHTTPRequest.proto.send;			

		XMLHTTPRequest.prototype.open =function(method,url, e,o,r){
			this._method=method, 
			this._url=url,
			tempOpen.call(this,method,url,e,o,r)
		},

		XMLHTTPRequest.prototype.send =function(j){
			var start, obj=this, r_method=this.method, r_url=this._url;

			function statechange() {

				if(o.readyState==4) {

					var time =(new Data).getTime(),  //怎么声明js对象来着
						latency    = time - start;
						sendbytes =0;
					try{
						if(typeof j ="string"){
							sendbytes=j.length;
						}
					}catch(e){
						nbsJsBridge.logDebug("get sendbytes occur an error,"+e.toString());
					}

					 nbsJsBridge.logNetwork(r_url, r_method, start,latency, sendbytes, obj.responseText.length, obj.status.toString()) //没有error的各种信息.

	
				}
			}
			
			start=(new Data).getTime(),
			this.addEventListener("readystatechange", statechange,false),
		
			tempSend.call(this,j);
		},


		nbsPerformance = function(){
			{
            var t = window.location.pathname, 
            	n = window.location.host;
           		window.location.protocol //???  能否获得 网络访问的方式
       		}

       		setTimeout(function(){
				try{
		            var responseTime=window.performance.timing.responseEnd - window.performance.timing.responseStart; //response流读完的时间(ResponseTime)nbsJsBridge.logDebug("responseTime:"+responseTime);
					var pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;  //从开始页面请求到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – navigationStartnbsJsBridge.logDebug("pageLoadTime:"+pageLoadTime);
					var	resolveDNSTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart; //dns解析时间nbsJsBridge.logDebug("resolveDNSTime:"+resolveDNSTime);
					var	connectTime = window.performance.timing.domComplete - window.performance.timing.domLoading; //domloading的时间nbsJsBridge.logDebug("connectTime:"+connectTime);
					var sslTime=-1;	 	 //ssltime  = window.performance.timing.安卓机器不支持  //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/secureConnectionStart
					var fetchCacheTime = window.performance.timing.responseEnd - window.performance.timing.fetchStart;
					nbsJsBridge.logDebug("fetchCacheTime:"+fetchCacheTime);
					var firstPacketTime = window.performance.timing.responseStart -window.performance.timing.navigationStart;//这个数字不对//var firstPacketTime=-1;nbsJsBridge.logDebug("firstPacketTime:"+firstPacketTime);
		            var	 loadDomTime  = window.performance.timing.domContentLoadedEventEnd -window.performance.timing.responseStart;
		            nbsJsBridge.logDebug("loadDomTime:"+loadDomTime);
				    var	 browserRenderTime = window.performance.timing.loadEventEnd - window.performance.timing.domContentLoadedEventEnd;
				    nbsJsBridge.logDebug("browserRenderTime:"+browserRenderTime);
					var	 serverQueueingTime=-1;
					var	 applicationTime=-1;
					var	 networkTime =-1;
					var	 frontEndTime =loadDomTime+browserRenderTime;             
		             
		            var jsErrors=0;
		            var httpStatuscode=0; 	
		            var errorCode=0;
		            var appData="";
		            var requestUrl =window.location.href; //完整的url; http://devdocs.io/dom/location
		            nbsJsBridge.logDebug("requestUrl:"+requestUrl);
					var method="GET";  //loadUrl采用的是什么样的访问方式呢?		 
					nbsJsBridge.logView(requestUrl,method,responseTime,pageLoadTime,
							resolveDNSTime,connectTime,sslTime,fetchCacheTime,firstPacketTime,
							loadDomTime,browserRenderTime,serverQueueingTime,applicationTime,
							networkTime,frontEndTime,jsErrors,httpStatuscode,errorCode,
							appData);
		            }catch(e){
		            	nbsJsBridge.javascriptError(e.message, e.line, e.lineNumber, e.toString(), e.columnNumber);
						console.log(e.message+","+e.toString());
						console.error(e);
					}
				},0)
		};

		var  i = window.TraceKit.report;
		return nbsXMLRequest() ,
		window.TraceKit.report.subscribe(function(t){
			var i = "stack" === t.mode ? "true" : "false";
			nbsJsError(t,i)
		}),
		window.onload =nbsPerformance
	}();
}



