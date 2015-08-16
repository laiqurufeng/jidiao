javascript: ! function(n, e) { //叹号后面跟函数!function和加号后面跟函数+function都是跟(function(){})();这个函数是一个意思，都是告诉浏览器自动运行这个匿名函数的，因为!+()这些符号的运算符是最高的，所以会先运行它们后面的函数
	function t(n, e) {
		return Object.prototype.hasOwnProperty.call(n, e)  //所有继承了 Object.prototype 的对象都会从原型链上继承到 hasOwnProperty 方法，这个方法可以用来检测一个对象是否含有特定的自身属性，和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
	}       // Function.prototype.call()  方法在使用一个指定的this值(即n)和若干个指定的参数值(即e)的前提下调用某个函数或方法.


	function r(n) {
		return e === n
	}

	var l = {},
		u = n.TraceKit,
		i = [].slice,
		c = "?";
	l.noConflict = function() {
			return n.TraceKit = u, l
		},
	l.wrap = function(n) {
			function e() {
				try {
					return n.apply(this, arguments)
				} catch (e) {
					throw l.report(e), e
				}
			}

			return e
		}, 
		//wrap结束
	l.report = function() {
			function e(n) {
				a(), p.push(n)
			}

			function r(n) {
				for (var e = p.length - 1; e >= 0; --e) p[e] === n && p.splice(e, 1)
			}

			function u(n, e) {
				var r = null;
				if (!e || l.collectWindowErrors) {
					for (var u in p)
						if (t(p, u)) try {
							p[u].apply(null, [n].concat(i.call(arguments, 2)))
						} catch (c) {
							r = c
						}
					if (r) throw r
				}
			}

			function c(n, e, t) {
				var r = null;
				if (g) l.computeStackTrace.augmentStackTraceWithInitialElement(g, e, t, n), r = g, g = null, m = null;
				else {
					var i = {
						url: e,
						line: t
					};
					i.func = l.computeStackTrace.guessFunctionName(i.url, i.line), i.context = l.computeStackTrace.gatherContext(i.url, i.line), r = {
						mode: "onerror",
						message: n,
						url: document.location.href,
						stack: [i],
						useragent: navigator.userAgent
					}
				}
				return u(r, "from window.onerror"), s ? s.apply(this, arguments) : !1
			}

			function a() {
				f !== !0 && (s = n.onerror, n.onerror = c, f = !0)
			}

			function o(e) {
				var t = i.call(arguments, 1);
				if (g) {
					if (m === e) return;
					var r = g;
					g = null, m = null, u.apply(null, [r, null].concat(t))
				}
				var c = l.computeStackTrace(e);
				throw g = c, m = e, n.setTimeout(function() {
					m === e && (g = null, m = null, u.apply(null, [c, null].concat(t)))
				}, c.incomplete ? 2e3 : 0), e
			}

			var s, f, p = [],
				m = null,
				g = null;
			return o.subscribe = e, o.unsubscribe = r, o
		}(),
		//report end
	 l.computeStackTrace = function() {
			function e(e) {
				if (!l.remoteFetching) return "";
				try {
					var t = function() {
							try {
								return new n.XMLHttpRequest
							} catch (e) {
								return new n.ActiveXObject("Microsoft.XMLHTTP")
							}
						},
						r = t();
					return r.open("GET", e, !1), r.send(""), r.responseText
				} catch (u) {
					return ""
				}
			}

			function u(n) {
				if (!t(S, n)) {
					var r = ""; - 1 !== n.indexOf(document.domain) && (r = e(n)), S[n] = r ? r.split("\n") : []
				}
				return S[n]
			}

			function i(n, e) {
				var t, l = /function ([^(]*)\(([^)]*)\)/,
					i = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
					a = "",
					o = 10,
					s = u(n);
				if (!s.length) return c;
				for (var f = 0; o > f; ++f)
					if (a = s[e - f] + a, !r(a)) {
						if (t = i.exec(a)) return t[1];
						if (t = l.exec(a)) return t[1]
					}
				return c
			}

			function a(n, e) {
				var t = u(n);
				if (!t.length) return null;
				var i = [],
					c = Math.floor(l.linesOfContext / 2),
					a = c + l.linesOfContext % 2,
					o = Math.max(0, e - c - 1),
					s = Math.min(t.length, e + a - 1);
				e -= 1;
				for (var f = o; s > f; ++f) r(t[f]) || i.push(t[f]);
				return i.length > 0 ? i : null
			}

			function o(n) {
				return n.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
			}

			function s(n) {
				return o(n).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
			}

			function f(n, e) {
				for (var t, r, l = 0, i = e.length; i > l; ++l)
					if ((t = u(e[l])).length && (t = t.join("\n"), r = n.exec(t))) return {
						url: e[l],
						line: t.substring(0, r.index).split("\n").length,
						column: r.index - t.lastIndexOf("\n", r.index) - 1
					};
				return null
			}

			function p(n, e, t) {
				var r, l = u(e),
					i = RegExp("\\b" + o(n) + "\\b");
				return t -= 1, l && l.length > t && (r = i.exec(l[t])) ? r.index : null
			}

			function m(e) {
				for (var t, r, l, u, i = [n.location.href], c = document.getElementsByTagName("script"), a = "" + e, p = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, m = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, g = 0; g < c.length; ++g) {
					var h = c[g];
					h.src && i.push(h.src)
				}
				if (l = p.exec(a)) {
					var v = l[1] ? "\\s+" + l[1] : "",
						x = l[2].split(",").join("\\s*,\\s*");
					t = o(l[3]).replace(/;$/, ";?"), r = RegExp("function" + v + "\\s*\\(\\s*" + x + "\\s*\\)\\s*{\\s*" + t + "\\s*}")
				} else r = RegExp(o(a).replace(/\s+/g, "\\s+"));
				if (u = f(r, i)) return u;
				if (l = m.exec(a)) {
					var d = l[1];
					if (t = s(l[2]), r = RegExp("on" + d + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]", "i"), u = f(r, i[0])) return u;
					if (r = RegExp(t), u = f(r, i)) return u
				}
				return null
			}

			function g(n) {
				if (!n.stack) return null;
				for (var e, t, r = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i, l = /^\s*(\S*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i, u = n.stack.split("\n"), o = [], s = /^(.*) is undefined$/.exec(n.message), f = 0, m = u.length; m > f; ++f) {
					if (e = l.exec(u[f])) t = {
						url: e[3],
						func: e[1] || c,
						args: e[2] ? e[2].split(",") : "",
						line: +e[4],
						column: e[5] ? +e[5] : null
					};
					else {
						if (!(e = r.exec(u[f]))) continue;
						t = {
							url: e[2],
							func: e[1] || c,
							line: +e[3],
							column: e[4] ? +e[4] : null
						}
					}!t.func && t.line && (t.func = i(t.url, t.line)), t.line && (t.context = a(t.url, t.line)), o.push(t)
				}
				return o[0] && o[0].line && !o[0].column && s && (o[0].column = p(s[1], o[0].url, o[0].line)), o.length ? {
					mode: "stack",
					name: n.name,
					message: n.message,
					url: document.location.href,
					stack: o,
					useragent: navigator.userAgent
				} : null
			}

			function h(n) {
				for (var e, t = n.stacktrace, r = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i, l = t.split("\n"), u = [], c = 0, o = l.length; o > c; c += 2)
					if (e = r.exec(l[c])) {
						var s = {
							line: +e[1],
							column: +e[2],
							func: e[3] || e[4],
							args: e[5] ? e[5].split(",") : [],
							url: e[6]
						};
						if (!s.func && s.line && (s.func = i(s.url, s.line)), s.line) try {
							s.context = a(s.url, s.line)
						} catch (f) {}
						s.context || (s.context = [l[c + 1]]), u.push(s)
					}
				return u.length ? {
					mode: "stacktrace",
					name: n.name,
					message: n.message,
					url: document.location.href,
					stack: u,
					useragent: navigator.userAgent
				} : null
			}

			function v(e) {
				var r = e.message.split("\n");
				if (r.length < 4) return null;
				var l, c, o, p, m = /^\s*Line (\d+) of linked script ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
					g = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i,
					h = /^\s*Line (\d+) of function script\s*$/i,
					v = [],
					x = document.getElementsByTagName("script"),
					d = [];
				for (c in x) t(x, c) && !x[c].src && d.push(x[c]);
				for (c = 2, o = r.length; o > c; c += 2) {
					var k = null;
					if (l = m.exec(r[c])) k = {
						url: l[2],
						func: l[3],
						line: +l[1]
					};
					else if (l = g.exec(r[c])) {
						k = {
							url: l[3],
							func: l[4]
						};
						var w = +l[1],
							y = d[l[2] - 1];
						if (y && (p = u(k.url))) {
							p = p.join("\n");
							var S = p.indexOf(y.innerText);
							0 > S || (k.line = w + p.substring(0, S).split("\n").length)
						}
					} else if (l = h.exec(r[c])) {
						var T = n.location.href.replace(/#.*$/, ""),
							$ = l[1],
							E = RegExp(s(r[c + 1]));
						p = f(E, [T]), k = {
							url: T,
							line: p ? p.line : $,
							func: ""
						}
					}
					if (k) {
						k.func || (k.func = i(k.url, k.line));
						var F = a(k.url, k.line),
							b = F ? F[Math.floor(F.length / 2)] : null;
						k.context = F && b.replace(/^\s*/, "") === r[c + 1].replace(/^\s*/, "") ? F : [r[c + 1]], v.push(k)
					}
				}
				return v.length ? {
					mode: "multiline",
					name: e.name,
					message: r[0],
					url: document.location.href,
					stack: v,
					useragent: navigator.userAgent
				} : null
			}

			function x(n, e, t, r) {
				var l = {
					url: e,
					line: t
				};
				if (l.url && l.line) {
					n.incomplete = !1, l.func || (l.func = i(l.url, l.line)), l.context || (l.context = a(l.url, l.line));
					var u = / '([^']+)' /.exec(r);
					if (u && (l.column = p(u[1], l.url, l.line)), n.stack.length > 0 && n.stack[0].url === l.url) {
						if (n.stack[0].line === l.line) return !1;
						if (!n.stack[0].line && n.stack[0].func === l.func) return n.stack[0].line = l.line, n.stack[0].context = l.context, !1
					}
					return n.stack.unshift(l), n.partial = !0, !0
				}
				return n.incomplete = !0, !1
			}

			function d(n, e) {
				for (var t, r, u, a = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, o = [], s = {}, f = !1, g = d.caller; g && !f; g = g.caller)
					if (g !== k && g !== l.report) {
						if (r = {
								url: null,
								func: c,
								line: null,
								column: null
							}, g.name ? r.func = g.name : (t = a.exec("" + g)) && (r.func = t[1]), u = m(g)) {
							r.url = u.url, r.line = u.line, r.func === c && (r.func = i(r.url, r.line));
							var h = / '([^']+)' /.exec(n.message || n.description);
							h && (r.column = p(h[1], u.url, u.line))
						}
						s["" + g] ? f = !0 : s["" + g] = !0, o.push(r)
					}
				e && o.splice(0, e);
				var v = {
					mode: "callers",
					name: n.name,
					message: n.message,
					url: document.location.href,
					stack: o,
					useragent: navigator.userAgent
				};
				return x(v, n.sourceURL || n.fileName, n.line || n.lineNumber, n.message || n.description), v
			}

			function k(n, e) {
				var t = null;
				e = null == e ? 0 : +e;
				try {
					if (t = h(n)) return t
				} catch (r) {
					if (y) throw r
				}
				try {
					if (t = g(n)) return t
				} catch (r) {
					if (y) throw r
				}
				try {
					if (t = v(n)) return t
				} catch (r) {
					if (y) throw r
				}
				try {
					if (t = d(n, e + 1)) return t
				} catch (r) {
					if (y) throw r
				}
				return {
					mode: "failed"
				}
			}

			function w(n) {
				n = (null == n ? 0 : +n) + 1;
				try {
					throw Error()
				} catch (e) {
					return k(e, n + 1)
				}
			}

			var y = !1,
				S = {};
			return k.augmentStackTraceWithInitialElement = x, k.guessFunctionName = i, k.gatherContext = a, k.ofCaller = w, k
		}(),
		function() {
			var e = function(e) {
				var t = n[e];
				n[e] = function() {
					var n = i.call(arguments),
						e = n[0];
					return "function" == typeof e && (n[0] = l.wrap(e)), t.apply ? t.apply(this, n) : t(n[0], n[1])
				}
			};
			e("setTimeout"), e("setInterval")
		}(), 
		l.remoteFetching || (l.remoteFetching = !0),
		l.collectWindowErrors || (l.collectWindowErrors = !0), 
		(!l.linesOfContext || l.linesOfContext < 1) && (l.linesOfContext = 11),
		 n.TraceKit = l
}(window);
//和开头匹配



//----------------------
var Mint = function() {   //括号匹配到最后
	function t(t) {
		return "userAgent" in window.navigator ? -1 == window.navigator.userAgent.indexOf("Android") ? t : "object" == typeof t ? JSON.stringify(t) : void 0 === t || null === t ? "{}" : JSON.stringify({
			error: "Not a valid argument. Only JSON object allowed."
		}) : null
	}

	var n = function(t, n) {
			var i = t.stack.map(function(t) {      //i对调用栈进行格式化输出
				return t.func + "@" + t.url + ":" + t.line
			}).join("\n");
			var method="";
			try{
				 method =t.method;
			}catch(e){
				method ="error";
				console.log(e);
			}
			nbsJsBridge.javascriptError(t.url,method, t.message, t.lineno, t.colno, t.error.toString(),t.filename, t.stack[0].line, i, n);
		},
	// ERROR_MESSAGE: 错误消息。对应ErrorEvent的message属性。
	// LINE_OF_ERROR: 错误所在行号。对应ErrorEvent的lineno属性。
	// COLUMN_OF_ERROR: 错误所在列。对应ErrorEvent的colno属性。
	// ERROR_DESCRIPTION: 错误详细描述。对应ErrorEvent的error属性。
	// SOURCE_URL_OF_ERROR: 错误源代码的URL。对应ErrorEvent的filename属性。若与REQUEST_URL相同，则置为#
	// #当js返回的是undifined, 那么java端接收的是什么数据呢?

		i = window.TraceKit.report,//上面定义的那个l应该就是TraceKit
		e = function() {
			var t = XMLHttpRequest.prototype.open,
				n = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.open = function(n, i, e, o, r) {
				this._method = n,
				this._url = i,
				t.call(this, n, i, e, o, r)  //把open函数进行了扩展.然后把原数据都记录了下来.  //根据open函数的命令
			}, //open函数分别对应 method,url,async, user,password
			//the optional user name to use for authentication purposes; by default, this is an empty string.
			//The optional password to use for authentication purposes; by default, this is an empty string.
			XMLHttpRequest.prototype.send = function(t) {
				function i() {
					if (4 == o.readyState) {
						var t = (new Date).getTime(),
							n = t - e,
							sendbytes="";
							try{
								if(t.typeof(string)){   //string 要小写
									sendbytes=t.length;
								}		
							}catch(e){
								console.log(e);
							}
							
							var i = {
								method: r,
								url: a,
								latency: n.toString(),
								httpStatusCode: o.status.toString(),
								responseDataSize: o.responseText.length,  //这里和Xml的冲突不)
								start:e
							};
						//回调java,打印network信息
						//e 起始时间
						nbsJsBridge.logNetwork(i.url, i.method, i.start,i.latency, i.send,i,responseDataSize,i.httpStatuscode) //没有error的各种信息.
						//nbsJsBridge.logNetwork(i.method, i.url, i.latency, i.httpStatusCode, i.responseDataSize)
					}
				}

				var e, o = this,
					r = this._method,
					a = this._url;
				e = (new Date).getTime(),  //e是开始的时间
				this.addEventListener("readystatechange", i, !1),
				 n.call(this, t)
			}
		},
		o = function() {
			{
				var t = window.location.pathname,
					n = window.location.host;
				window.location.protocol;
				var requestUrl =window.location.href; //完整的url; http://devdocs.io/dom/location
				var method="GET";  //loadUrl采用的是什么样的访问方式呢?

			}
			//String url,  String requestMethod,
			//String responseTime, String pageLoadTime, String resolveDNSTime, String connectTime, String sslTime,
			// String fetchCacheTime, String firstPacketTime, String loadDomTime, String browserRenderTime,
			// String serverQueueingTime, String applicationTime, String networkTime, String frontEndTime,
			// String jsErrors, String httpStatusCode, String errorCode, String appData) 
			setTimeout(function() {
				var responseTime=window.performance.timing.responseEnd - window.performance.timing.responseStart; //response流读完的时间(ResponseTime)
				var pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;  //从开始页面请求到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – navigationStart
				var	resolveDNSTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart; //dns解析时间
				var	connectTime = window.performance.timing.domComplete - window.performance.timing.domLoading; //domloading的时间
				var sslTime=-1;	 	 //ssltime  = window.performance.timing.安卓机器不支持  //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/secureConnectionStart
				var fetchCacheTime = window.performance.timing.responseEnd - window.performance.timing.fetchStart;
				var firstPacketTime = window.performance.timing.responseStart -window.performance.timing.navigateonStart;
                var	 loadDomTime  = window.performance.timing.domContentLoadedEventEnd -window.performance.timing.responseStart;
 				var	 browserRenderTime = window.performance.timing.loadEventEnd - window.performance.timing.domContentLoadedEventEnd;
 				var	 serverQueueingTime=-1;
 				var	 applicationTime=-1;
 				var	 networkTime =-1;
 				var	 frontEndTime =loadDomTime+browserRenderTime;             
                 
                var jsErrors=0;
                var httpStatuscode=0; 	
                var errorCode=0;
                var appData="";
 					 
				nbsJsBridge.logView(requestUrl,method,responseTime,pageLoadTime,resolveDNSTime,connectTime,sslTime,fetchCacheTime,firstPacketTime,loadDomTime,browserRenderTime,serverQueueingTime,applicationTime,networkTime,frontEndTime,jsErrors,httpStatuscode,errorCode,appData);
			}, 0);
			
             //RESPONSE_TIME: HTTP响应时间（单位：毫秒）。同网络性能请求数据中的响应时间。
			//PAGE_LOAD_TIME: 页面加载总耗时（毫秒）。从开始页面请求到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – navigationStart
			//TIME_TO_DNS: DNS时间（单位：毫秒）。若无，缺省值置为-1。
			//TIME_TO_CONNECT: 建立连接时间（单位：毫秒）。若无，缺省值置为-1。
			//TIME_TO_SSL: SSL握手时间（单位：毫秒）。若无，缺省值置为-1。
			//TIME_TO_FETCH_FROM_CACHE: 当页面使用浏览器缓存时（如304），从缓存中加载的时间(responseEnd - fetchStart)		
			//TIME_TO_FIRST_PACKET: 首包时间（单位：毫秒）。（或者称作：后端耗时）：从开始页面请求到页面浏览器开始接收到HTML代码的时间，包括消耗在网络和服务器端的时间，对支持Navigation Timing的浏览器来说，等于responseStart – navigateonStart
			//TIME_TO_LOAD_DOM: 处理DOM耗时（单位：毫秒）。浏览器消耗在将HTML代码解析成Dom树并获取和执行同步脚本的时间，包括从浏览器接收到HTML代码到HTML代码处理结束的时间，对支持Navigation Timing的浏览器来说，等于domContentLoadedEventEnd – responseStart。在处理Dom阶段，浏览器可能已经开始下载页面上的图片等元素了。
            //BROWSER_RENDER_TIME: 页面渲染时间（毫秒）。从HTML代码处理结束到页面渲染完成的时间，对支持Navigation Timing的浏览器来说，等于loadEventEnd – domContentLoadedEventEnd。在页面渲染阶段中包括了执行异步脚本和下载静态页面元素的时间。
            //SERVER_QUEUEING_TIME: 服务器阻塞时间（毫秒）。指服务器端的请求阻塞时间，即请求从Web前端服务器（例如Apache, nginx或F5负载均衡设备）到达应用服务端的时间，该性能值由应用探针采集并通过RUM嵌码写入页面底部的代码段中。
            //APPLICATION_TIME: 应用耗时（毫秒）。指应用服务器处理请求的所消耗的时间，即应用响应时间，等于请求到达应用服务器到应用代码执行完成并输出响应信息的时间，该性能值由应用探针采集并通过RUM嵌码写入页面底部的代码段中
            //ETWORK_TIME: 网络层耗时（单位：毫秒）。指应用请求和响应过程中消耗在网络上的时间，包括发出请求的前网络耗时和接收到响应的后网络耗时。网络耗时等于后端耗时（首包耗时）扣除服务器端阻塞耗时和应用耗时。网络耗时只包括应用基础页面（主HTML响应）的网络耗时，不包括应用页面内其他静态元素的的网络层耗时，静态元素的网络耗时已经被包含在处理Dom和渲染页面的过程中了。
            //FRONT_END_TIME: 前端耗时（单位：毫秒）。消耗在浏览器端的应用页面处理时间，等于处理Dom耗时 + 页面渲染耗时。

		};
	return e(), i.subscribe(function(t) {
		var i = "stack" === t.mode ? "true" : "false";  //
		n(t, i)
	}), 
	window.onload = o, { //window的onload()方法 //o是一个function ,但没有加括号,后面还跟着一个对象,
		errorLogger: i,
		initAndStartSession: function(t) {
			nbsJsBridge.initAndStartSession(t)
		},
		logEvent: function(n, i) {
			nbsJsBridge.logEvent(n, t(i))
		},
		leaveBreadcrumb: function(t) {
			nbsJsBridge.leaveBreadcrumb(t)
		},
		transactionStart: function(n, i) {
			nbsJsBridge.transactionStart(n, t(i))
		},
		transactionStop: function(n, i) {
			nbsJsBridge.transactionStop(n, t(i))
		},
		transactionCancel: function(n, i, e) {
			nbsJsBridge.transactionCancel(n, i, t(e))
		},
		addExtraData: function(t, n) {
			nbsJsBridge.addExtraData(t, n)
		},
		clearExtraData: function() {
			nbsJsBridge.clearExtraData()
		},
		flush: function() {
			return nbsJsBridge.flush()
		},
		startSession: function() {
			nbsJsBridge.startSession()
		},
		closeSession: function() {
			nbsJsBridge.closeSession()
		},
		logView: function(n, i) {
			nbsJsBridge.logView(n, null, null, null, null, null, t(i))
		},
		setUserIdentifier: function(t) {
			nbsJsBridge.setUserIdentifier(t)
		}
	}
}();
//# sourceURL=dynamicScript.js

