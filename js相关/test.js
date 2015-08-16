javascript:!function (n, e) {
    function t(n, e) {   //这个n和e和最上面的n,e无关. 分别是2个不同函数的形参.
        return Object.prototype.hasOwnProperty.call(n, e)  //n.hasOwnproperty(e)  
    }

    function r(n) {                   //注意 t函数和r函数,这2个函数内部都能访问到
        return e === n
    }

    var l = {}, 
    u = n.TraceKit,
    i = [].slice,   //这个返回的是什么,应该是数组的slice方法
    c = "?";
    l.noConflict = function () {
        return n.TraceKit = u, l
    }, 
    l.wrap = function (n) {   //找到所有的error.函数掉用通过包裹一层的方式.
        function e() {
            try {
                return n.apply(this, arguments)
            } catch (e) {
                throw l.report(e), e           //report函数并没有参数e呀,这种情况怎么办
            }
        }

        return e
    }, 
    l.report = function () {  
         var s,
          f, 
          p = [],
          m = null, 
          g = null;	
        function e(n) {
            a(), p.push(n)           //push()向Array的末尾添加若干元素，pop()则把Array的最后一个元素删除掉：  这里用逗号可以吗
        }

        function r(n) { //删除p数组的n元素
            for (var e = p.length - 1; e >= 0; --e)  //p数组去除n元素. //&&运算是与运算，只有所有都为true，&&运算结果才是true：
            	p[e] === n && p.splice(e, 1)          //splice()方法是修改Array的“万能方法”，它可以从指定的索引开始删除若干元素，然后再从该位置添加若干元素：2个参数代表只删除,不添加。
        }

        function u(n, e) {
            var r = null;                                    //arguments 只在函数内部起作用，并且永远指向当前函数的调用者传入的所有参数。arguments类似Array但它不是一个Array：
            if (!e || l.collectWindowErrors) {
                for (var u in p)  //for循环的一个变体是for ... in循环，它可以把一个对象的所有属性依次循环出来：
                if (t(p, u))      //t函数是在最上面定义的.//p.hasOwnproperty(u) 
                try {                               
                    p[u].apply(null, [n].concat(i.call(arguments, 2)))   //apply(null),[n],concat()   i应该是最外层的的参数. 即slice()-->arguments.slice(2);
                                                                         //var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                                                                         //slice()就是对应String的substring()版本，它截取Array的部分元素，然后返回一个新的Array：
                                                                         //arr.slice(0, 3); // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
																		 //arr.slice(3); // 从索引3开始到结束: ['D', 'E', 'F', 'G'],包括索引3

																		 //在一个方法内部，this是一个特殊变量，它始终指向当前对象。
																		 //可以用函数本身的apply方法，它接收两个参数，第一个参数就是需要绑定的this变量，第二个参数是Array，表示函数本身的参数。对普通函数调用，我们通常把this绑定为null。
                } catch (c) {
                    r = c
                }
                if (r)
                	throw r
            }
        }

        function c(n, e, t) {      //window.onerror = function (message, file, line, col, error) { //n为message,e为file,t为line.
        	//http://devdocs.io/dom/errorevent   Android端不支持第四个和第五个参数
        	//https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
        	//w3c标准的也只有这三个参数.
        	//https://bugsnag.com/blog/js-stacktraces 好的和坏的异常捕捉方法.

            var r = null;
            if (g)
            	l.computeStackTrace.augmentStackTraceWithInitialElement(g, e, t, n), r = g, g = null, m = null; 
            else {
                var i = {
                	url: e, 
                	line: t
                };
                i.func = l.computeStackTrace.guessFunctionName(i.url, i.line),  //函数名
                i.context = l.computeStackTrace.gatherContext(i.url, i.line),   //
                r = {
                    mode: "onerror",
                    message: n,
                    url: document.location.href,
                    stack: [i],
                    useragent: navigator.userAgent
                }
            }
            return u(r, "from window.onerror"), s ? s.apply(this, arguments) : !1   //s是上面声明的变量
        }

        function a() {
            f !== !0 && (s = n.onerror, n.onerror = c, f = !0)  //n是window, s=window.onerror; n.onerror=c, f=true;  c是一个函数. 
            //f!=ture的话window.onerror=c函数  ,f=true;f应该是防止重复运行a();
        }

        function o(e) {
            var t = i.call(arguments, 1);
            if (g) {
                if (m === e)return;
                var r = g;
                g = null, m = null, u.apply(null, [r, null].concat(t))
            }
            var c = l.computeStackTrace(e);
            throw g = c, m = e, n.setTimeout(function () {
                m === e && (g = null, m = null, u.apply(null, [c, null].concat(t)))
            }, c.incomplete ? 2e3 : 0), e
        }

       
        return o.subscribe = e, o.unsubscribe = r, o
    }(),
    //report结束
    l.computeStackTrace = function () {
        function e(e) {
            if (!l.remoteFetching)return "";
            try {
                var t = function () {
                    try {
                        return new n.XMLHttpRequest
                    } catch (e) {
                        return new n.ActiveXObject("Microsoft.XMLHTTP")
                    }
                }, r = t();
                return r.open("GET", e, !1), r.send(""), r.responseText
            } catch (u) {
                return ""
            }
        }

        function u(n) {
            if (!t(S, n)) {
                var r = "";
                -1 !== n.indexOf(document.domain) && (r = e(n)), S[n] = r ? r.split("\n") : []
            }
            return S[n]
        }

        function i(n, e) {
            var t, l = /function ([^(]*)\(([^)]*)\)/, i = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/, a = "", o = 10, s = u(n);
            if (!s.length)return c;
            for (var f = 0; o > f; ++f)if (a = s[e - f] + a, !r(a)) {
                if (t = i.exec(a))return t[1];
                if (t = l.exec(a))return t[1]
            }
            return c
        }

        function a(n, e) {
            var t = u(n);
            if (!t.length)return null;
            var i = [], c = Math.floor(l.linesOfContext / 2), a = c + l.linesOfContext % 2, o = Math.max(0, e - c - 1), s = Math.min(t.length, e + a - 1);
            e -= 1;
            for (var f = o; s > f; ++f)r(t[f]) || i.push(t[f]);
            return i.length > 0 ? i : null
        }

        function o(n) {
            return n.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
        }

        function s(n) {
            return o(n).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
        }

        function f(n, e) {
            for (var t, r, l = 0, i = e.length; i > l; ++l)if ((t = u(e[l])).length && (t = t.join("\n"), r = n.exec(t)))return {
                url: e[l],
                line: t.substring(0, r.index).split("\n").length,
                column: r.index - t.lastIndexOf("\n", r.index) - 1
            };
            return null
        }

        function p(n, e, t) {
            var r, l = u(e), i = RegExp("\\b" + o(n) + "\\b");
            return t -= 1, l && l.length > t && (r = i.exec(l[t])) ? r.index : null
        }

        function m(e) {
            for (var t, r, l, u, i = [n.location.href], c = document.getElementsByTagName("script"), a = "" + e, p = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, m = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, g = 0; g < c.length; ++g) {
                var h = c[g];
                h.src && i.push(h.src)
            }
            if (l = p.exec(a)) {
                var v = l[1] ? "\\s+" + l[1] : "", x = l[2].split(",").join("\\s*,\\s*");
                t = o(l[3]).replace(/;$/, ";?"), r = RegExp("function" + v + "\\s*\\(\\s*" + x + "\\s*\\)\\s*{\\s*" + t + "\\s*}")
            } else r = RegExp(o(a).replace(/\s+/g, "\\s+"));
            if (u = f(r, i))return u;
            if (l = m.exec(a)) {
                var d = l[1];
                if (t = s(l[2]), r = RegExp("on" + d + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]", "i"), u = f(r, i[0]))return u;
                if (r = RegExp(t), u = f(r, i))return u
            }
            return null
        }

        function g(n) {
            if (!n.stack)return null;
            for (var e, t, r = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i, l = /^\s*(\S*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i, u = n.stack.split("\n"), o = [], s = /^(.*) is undefined$/.exec(n.message), f = 0, m = u.length; m > f; ++f) {
                if (e = l.exec(u[f]))t = {
                    url: e[3],
                    func: e[1] || c,
                    args: e[2] ? e[2].split(",") : "",
                    line: +e[4],
                    column: e[5] ? +e[5] : null
                }; else {
                    if (!(e = r.exec(u[f])))continue;
                    t = {url: e[2], func: e[1] || c, line: +e[3], column: e[4] ? +e[4] : null}
                }
                !t.func && t.line && (t.func = i(t.url, t.line)), t.line && (t.context = a(t.url, t.line)), o.push(t)
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
            for (var e, t = n.stacktrace, r = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i, l = t.split("\n"), u = [], c = 0, o = l.length; o > c; c += 2)if (e = r.exec(l[c])) {
                var s = {line: +e[1], column: +e[2], func: e[3] || e[4], args: e[5] ? e[5].split(",") : [], url: e[6]};
                if (!s.func && s.line && (s.func = i(s.url, s.line)), s.line)try {
                    s.context = a(s.url, s.line)
                } catch (f) {
                }
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
            if (r.length < 4)return null;
            var l, c, o, p, m = /^\s*Line (\d+) of linked script ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i, g = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|http|https)\S+)(?:: in function (\S+))?\s*$/i, h = /^\s*Line (\d+) of function script\s*$/i, v = [], x = document.getElementsByTagName("script"), d = [];
            for (c in x)t(x, c) && !x[c].src && d.push(x[c]);
            for (c = 2, o = r.length; o > c; c += 2) {
                var k = null;
                if (l = m.exec(r[c]))k = {url: l[2], func: l[3], line: +l[1]}; else if (l = g.exec(r[c])) {
                    k = {url: l[3], func: l[4]};
                    var w = +l[1], y = d[l[2] - 1];
                    if (y && (p = u(k.url))) {
                        p = p.join("\n");
                        var S = p.indexOf(y.innerText);
                        0 > S || (k.line = w + p.substring(0, S).split("\n").length)
                    }
                } else if (l = h.exec(r[c])) {
                    var T = n.location.href.replace(/#.*$/, ""), $ = l[1], E = RegExp(s(r[c + 1]));
                    p = f(E, [T]), k = {url: T, line: p ? p.line : $, func: ""}
                }
                if (k) {
                    k.func || (k.func = i(k.url, k.line));
                    var F = a(k.url, k.line), b = F ? F[Math.floor(F.length / 2)] : null;
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
            var l = {url: e, line: t};
            if (l.url && l.line) {
                n.incomplete = !1, l.func || (l.func = i(l.url, l.line)), l.context || (l.context = a(l.url, l.line));
                var u = / '([^']+)' /.exec(r);
                if (u && (l.column = p(u[1], l.url, l.line)), n.stack.length > 0 && n.stack[0].url === l.url) {
                    if (n.stack[0].line === l.line)return !1;
                    if (!n.stack[0].line && n.stack[0].func === l.func)return n.stack[0].line = l.line, n.stack[0].context = l.context, !1
                }
                return n.stack.unshift(l), n.partial = !0, !0
            }
            return n.incomplete = !0, !1
        }

        function d(n, e) {
            for (var t, r, u, a = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, o = [], s = {}, f = !1, g = d.caller; g && !f; g = g.caller)if (g !== k && g !== l.report) {
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
                if (t = h(n))return t
            } catch (r) {
                if (y)throw r
            }
            try {
                if (t = g(n))return t
            } catch (r) {
                if (y)throw r
            }
            try {
                if (t = v(n))return t
            } catch (r) {
                if (y)throw r
            }
            try {
                if (t = d(n, e + 1))return t
            } catch (r) {
                if (y)throw r
            }
            return {mode: "failed"}       //return的是一个对象
        }

        function w(n) {
            n = (null == n ? 0 : +n) + 1;
            try {
                throw Error()
            } catch (e) {
                return k(e, n + 1)
            }
        }

        var y = !1,  //y=false;
        S = {};      //S为一个对象
        return k.augmentStackTraceWithInitialElement = x, k.guessFunctionName = i, k.gatherContext = a, k.ofCaller = w, k
    }(),

    //下面这个函数会运行
    function () {
        var e = function (e) {  //xiaohong['name']来访问xiaohong的name属性，不过xiaohong.name的写法更简洁。注意用[]的时候内部要写成字符串
            var t = n[e];
            n[e] = function () {   //这个n是window,一个array?  不是,这是js去对象的变量的一个方法
                var n = i.call(arguments), //如果不给slice()传递任何参数，它就会从头到尾截取所有元素。利用这一点，我们可以很容易地复制一个Array：
                 e = n[0]; //n[0]既是传进来的参数
                return "function" == typeof e && (n[0] = l.wrap(e)), t.apply ? t.apply(this, n) : t(n[0], n[1])  //typeof 123; --> 'number' 和instanceOf不同,这个是个运算符.
                //随意window[0]是不会报错的.但注意这里的n不是window.
            }
        };
        e("setTimeout"), e("setInterval")
    }(), 
    l.remoteFetching || (l.remoteFetching = !0),
    l.collectWindowErrors || (l.collectWindowErrors = !0),
    (!l.linesOfContext || l.linesOfContext < 1) && (l.linesOfContext = 11), 
    n.TraceKit = l   //n是window. l是TraceKit
}(window);
var Mint = function () {
	//t函数
    function t(t) {
        return "userAgent"in window.navigator ? -1 == window.navigator.userAgent.indexOf("Android") ? t : "object" == typeof t ? JSON.stringify(t) : void 0 === t || null === t ? "{}" : JSON.stringify({error: "Not a valid argument. Only JSON object allowed."}) : null
    }
    //n函数,关于抓取Js异常的
    var n = function (t, n) {
        var i = t.stack.map(function (t) {
            return t.func + "@" + t.url + ":" + t.line
        }).join("\n");
        nbsJsBridge.javascriptError(t.message, t.url, t.stack[0].line, i, n)
    },
    //i函数对应上面的report 
    i = window.TraceKit.report, 
    //e函数. 对应xmlHttpRequest;
    e = function () {
        var t = XMLHttpRequest.prototype.open, n = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (n, i, e, o, r) {
            this._method = n, this._url = i, t.call(this, n, i, e, o, r)
        }, XMLHttpRequest.prototype.send = function (t) {
            function i() {
                if (4 == o.readyState) {
                    var t = (new Date).getTime(), n = t - e, i = {
                        method: r,
                        url: a,
                        latency: n.toString(),
                        httpStatusCode: o.status.toString(),
                        responseDataSize: o.responseText.length
                    };
                    nbsJsBridge.logNetwork(i.method, i.url, i.latency, i.httpStatusCode, i.responseDataSize)
                }
            }

            var e, o = this, r = this._method, a = this._url;
            e = (new Date).getTime(), this.addEventListener("readystatechange", i, !1), n.call(this, t)
        }
    }, 
    //o 函数,对应loadView.
    o = function () {
        {
            var t = window.location.pathname, n = window.location.host;
            window.location.protocol
        }
        setTimeout(function () {
            var i = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
                e = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart,
                o = window.performance.timing.domComplete - window.performance.timing.domLoading,
                r = window.performance.timing.responseEnd - window.performance.timing.responseStart;
            nbsJsBridge.logView(t, i, e, r, o, n, null)
            try{
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
            var requestUrl =window.location.href; //完整的url; http://devdocs.io/dom/location
			var method="GET";  //loadUrl采用的是什么样的访问方式呢?		 
			nbsJsBridge.logView(requestUrl,method,responseTime,pageLoadTime,resolveDNSTime,connectTime,sslTime,fetchCacheTime,firstPacketTime,loadDomTime,browserRenderTime,serverQueueingTime,applicationTime,networkTime,frontEndTime,jsErrors,httpStatuscode,errorCode,appData);
            }catch(e){
            	nbsJsBridge.javascriptError(e.message, e.line, e.lineNumber, e.toString(), e.columnNumber);
				console.log(e.message+","+e.toString());
				console.error(e);
			}
        }, 0)
    };
    return e(),
    //i订阅了
    i.subscribe(function (t) {
        var i = "stack" === t.mode ? "true" : "false";
        n(t, i)
    }), 
    //window.onload的的函数调用
    window.onload = o, //onload的时候调用了o函数,也就是调用了logView()
    {
        errorLogger: i,   //errorLoagger函数对应的是i函数
        initAndStartSession: function (t) {
            nbsJsBridge.initAndStartSession(t)
        }, 
        logEvent: function (n, i) {
            nbsJsBridge.logEvent(n, t(i))
        }, 
        leaveBreadcrumb: function (t) {
            nbsJsBridge.leaveBreadcrumb(t)
        }, 
        transactionStart: function (n, i) {
            nbsJsBridge.transactionStart(n, t(i))
        }, 
        transactionStop: function (n, i) {
            nbsJsBridge.transactionStop(n, t(i))
        }, 
        transactionCancel: function (n, i, e) {
            nbsJsBridge.transactionCancel(n, i, t(e))
        }, 
        addExtraData: function (t, n) {
            nbsJsBridge.addExtraData(t, n)
        }, 
        clearExtraData: function () {
            nbsJsBridge.clearExtraData()
        }, 
        flush: function () {
            return nbsJsBridge.flush()
        }, 
        startSession: function () {
            nbsJsBridge.startSession()
        }, 
        closeSession: function () {
            nbsJsBridge.closeSession()
        }, 
        logView: function (n, i) {
            nbsJsBridge.logView(n, null, null, null, null, null, t(i))
        }, 
        setUserIdentifier: function (t) {
            nbsJsBridge.setUserIdentifier(t)
        }
    }
    //window.onLoad结束
}();