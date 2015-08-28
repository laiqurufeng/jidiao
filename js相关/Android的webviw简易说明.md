#Android端webView数据简单说明
###LOG Filter
WebView中的log除了上传webview数据的地方外,都以`webview-->`开头.
###数据量
因为Android段暂时没办法hook住socket层的数据.没办法抓到WebView的网络性能数据.
比如 点击一个页面的超链接跳转到另一个页面时,虽然能抓取到url.但是没有网络性能数据.所以舍弃了这部分数据.
###实现原理.
通过hook`loadUrl()`这个接口,在用户调用`loadUrl()`这个接口的时候,插入一段js代码.
hook了Html中window.onLoad()接口回调.
Android端能抓取的数据都是js代码抓取的数据. 然后通过js代码回调java代码,
进行数据采集.





#WebView数据
Webview现在可以抓取到的数据分为3部分.

###第一部分   WEBVIEW视图数据.
上传的是通过webview接口的,对应的数据为`webviewPerfMetrics`中的`WEBVIEW_DATA_ITEM`

```
“URL”,                            //YES:
“REQUEST_URL_PARAMS”,             //YES:经过参数过滤后的参数
REQUEST_METHOD,                   //NO:全部为GET
RESPONSE_TIME,                    //YES:response流读完的时间(ResponseTime)
PAGE_LOAD_TIME,                   //YES:从开始页面请求到页面渲染完成的时间
TIME_TO_RESOLVE_DNS,              //YES:dns解析时间
TIME_TO_CONNECT,                  //YES:domloading的时间
TIME_TO_SSL,                      //NO: android端webview不支持
TIME_TO_FETCH_FROM_CACHE,         //YES
TIME_TO_FIRST_PACKET,             //YES
TIME_TO_LOAD_DOM,                 //YES
BROWSER_RENDER_TIME,              //YES
SERVER_QUEUEING_TIME,             //NO
APPLICATION_TIME,                 //NO
NETWORK_TIME,                     //NO
FRONTEND_TIME,                    //YES
JS_ERRORS,                        //NO:暂时没有,后面可能会加上
HTTP_STATUS_CODE,                 //NO:
NETWORK_ERROR_CODE,               //NO
BYTES_SENT,                       //NO
BYTES_RECEIVED,                   //NO
“APP_DATA”                        //NO
```               
android端WebView网络访问暂时没有办法hook,所以网络访问的数据都抓取不到,
包括访问方式, 返回码等数据.

- *log filter*
webview的数据以`logView-->`开头.

- *可以抓取到的数据*
`Webview.loadUrl("http://www.baidu.com")`,通过loadUrl()方法load的页面.

- *已知的问题*
很多情况下loadUrl并不会触发js回调.也就抓不到数据.
可能出现的原因 `loadUrl("js代码")`执行的太慢. 还需要进一步完善.


###第二部分  JS错误数据

```
“REQUEST_URL”,                    //YES
“REQUEST_URL_PARAMS”,             //YES
REQUEST_METHOD,                   //NO:默认为GET
“ERROR_MESSAGE”,                  //YES:对应message
LINE_OF_ERROR,                    //YES:对应line
COLUMN_OF_ERROR,                  //NO:
“ERROR_DESCRIPTION”,              //NO:
“SOURCE_URL_OF_ERROR”             //YES: 对应document.location.href一直 ,如果和url相同,改为上传"#"
```
对JS错误的抓取是hook的`window.onerror = function (message, file, line, col, error)`函数,在Android端,后2个参数没有不支持,也就是`window.onerror = function (message, file, line)`所以没有column和description数据.

- *log filter*
JSError错误以`logJsError-->`开头

- *可以抓取到的数据*
通过loadUrl()load页面时出现的js异常.



###第三部分 XMLRequest数据.
Android端可以抓到Ajax的数据. 这部分数据被认为是普通的网络性能数据.
```
“URL”,                       //YES
“REQUEST_URL_PARAMS”,        //YES
REQUEST_METHOD,              //YES
HTTP_LIB_NAME,               //YES:对应数字5
“REMOTE_IP”,                 //NO
DURATION,                    //YES
TIME_TO_DNS,                 //NO
TIME_TO_CONNECT,             //NO
TIME_TO_FIRST_PACKET,        //NO
HTTP_STATUS_CODE,            //YES
NETWORK_ERROR_CODE,          //YES?暂时不确定.没发现错误的情况
BYTES_SENT,                  //YES
BYTES_RECEIVED,              //YES
“APP_DATA”                   //NO:ajax不支持自定义http头
```

- *方便的log filter*
同上,`logNetwork-->`

- *可以抓取到的数据*
ajax的数据.

- *已知的问题*
实际使用中ajax的数据非常少.不太合理.
还需实验利用`JQuery`进行Ajax访问是否支持.


#WebView数据上传.
###第一.二部分(WebView和JS数据)
数据上传会在`sendActivityTrace(慢交互数据)`后进行上传
开始上传的时候会有如下2行log. 
```
"Harvester: Sending " + webviewCount + " Webview transactions.");
"Harvester: Sending " +jsErrors  + " Js errors."
```
webviewCount: 一次数据上传周期内webview的个数
jsErrors :js异常的个数.
**注意一次上传周期内如果webviewCount和jsErrors都为0的时候,则不进行上传.**
这时会有`stop send webviewPrefMetrics because no data`日志打印.

数据上传时的log是真正上传给服务器的数据,这部分数据为最终结果.
数据格式如下,log格式也相同.
```
“type” : “webviewPerfMetrics”,
		“interval” : DATA_SENT_INTERVAL_IN_SECONDS,
 		“dev” : DEVICE_DATA,
		“webviews” : WEBVIEW_DATA_ARRAY,
		“jserrs” : JS_ERROR_DATA_ARRAY
```
###第三部分(Ajax数据)
这部分数据通过`sendNetworkPrefMetrics()`接口进行上传.
和普通的HttpClient等网络交互数据一样,通过这个接口上传.



#嵌码方式(还没决定采用哪一种)
1.在Main Thread中调用,`	NBSWebviewUtil.instrumentWebView(context, webview);`
context: Context;
webview:需要监测的webview;  注意:webview不能为空.必须在`findViewById("R.ID.webview")`后使用.

这种方法也不推荐,因为要实现WebViewClient的所有方法.
有可能在某些机子上出现VFY异常. 并且,Android升级的时候,WEBVIEW可能会增加新接口.这个类还需要重写.

2.用户在layout控件中直接使用NBSWebView替换普通的WebView
```
    <com.networkbench.agent.impl.webview.NBSWebView
        android:layout_below="@+id/ll"
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

```
**说明**
这种方法不太好,不建议使用.
因为在自定义的WebView中,需要进行init操作. 这时候会调用`setWebViewClient(new NBSWebViewClient(context, null));`
也就是说,如果用户想在后面对WebViewClient进行个性化配置时调用的`setWebViewClient(xxx)` 时xxx必须是NBSWebViewClient的子类.否则就会覆盖NBSWebViewClient造成webview无法instrument.
这种方法上线的时候,应该会舍弃.



3.通过嵌码的方式进行.(还未实现)
用户必须有调用`webview.setWebViewClient()`方法.
如果没有,需要添加一段空实现方法
`webview.setWebViewClient(new WebViewClient(){})`  //*注意里面的{}不能少*


**todo**
另外NBSWebViewClient的方法,现阶段是采用的final的,无法重写. 如果想采用第二和第三种方法,必须去掉final修饰

可选的解决方案,2种类型的webViewClient,对于不同类型采取不同的方法.



**说明**
以上三种方式还未最终确定,有可能会冲突. 最终方式可能是第三种方法.


###WebView上传开关.
webview开关默认是打开的.可以由服务器下发配置项的`features` 决定是否开启.
#####sendWebview的时候
如果关了有`stop send WebviewPrefMetrics because Http_webview_enabled is false`的log
#####`instrumentWebView()`执行的时候,停止instrument webview流程.
会有`webview_enable is false ,stop instrument webview`的log
##### `onPageStart()`执行的时候,不再注入js,
有`stop instrument webview because isWebview_enabled() is false"的log`的log.




#代码说明
###开启js调试,可以使用chrome浏览器进行调试Android端的html页面.
```
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
	WebView.setWebContentsDebuggingEnabled(true);
}
```
###允许跨域
```
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN){		
	webview.getSettings().setAllowUniversalAccessFromFileURLs(true);
	webview.getSettings().setAllowFileAccessFromFileURLs(true);
}
```
###运行java和js互调
```
webview.getSettings().setJavaScriptEnabled(true);
JSCall call=new JSCall();
webView.addJavascriptInterface(call, "jsCallJava");
```
这样就可以在js中调用java方法了. 

**注意**
`JavascriptInterface`接口有漏洞.在4.2以上的版本需要加`@JavascriptInterface`标签限制.
4.2以下的版本有安全方面的问题.

###webview加载页面或者加载js代码
```
webview.loadUrl("http://www.baidu.com");   //加载页面
webview.loadUrl("javascript:function..."); //加载js
```
###Ajax的使用方法
```
var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				 document.getElementById("myspan").innerHTML=xhr.responseText;
			}
		}
		xhr.open('GET', 'http://www.sohu.com', true);
		xhr.send(null);
```

###某一友商在制造自身的WEBView的时候,自动使用了如下四种方法,分别说明:
```
webView.getSettings().setJavaScriptEnabled(true);                    
webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
webView.getSettings().setDomStorageEnabled(true);    // -->Build.VERSION.SDK_INT >= 7
webView.getSettings().setAllowUniversalAccessFromFileURLs(true);  //-->Build.VERSION.SDK_INT >= 16
```
1. `setJavaScriptEnabled(true)` : Tells the WebView to enable JavaScript execution. //设置能够执行js脚本,设置了之后js就可以和java代码进行互调了.

2. `setJavaScriptCanOpenWindowsAutomatically(true)` : Tells JavaScript to open windows automatically. This applies to the JavaScript function window.open(). The default is false

3. `setDomStorageEnabled(true)` :Sets whether the DOM storage API is enabled. The default value is false.
 ```
 HTML5本地存储在Android中的应用HTML5提供了2种客户端存储数据新方法：
localStorage 没有时间限制
sessionStorage 针对一个Session的数据存储
以下是js代码
 //清空storage  
localStorage.clear();  
//设置一个键值  
localStorage.setItem(“yarin”,“yangfegnsheng”);  
//获取一个键值  
localStorage.getItem(“yarin”);   
//获取指定下标的键的名称（如同Array）  
localStorage.key(0);   
//return “fresh” //删除一个键值  
localStorage.removeItem(“yarin”);  
```

4. `setAllowUniversalAccessFromFileURLs(true)`  :sets whether JavaScript running in the context of a file scheme URL should be allowed to access content from any origin. This includes access to content from other file scheme URLs. 


###`shouldOverrideUrlLoading()`的处理方法.
```
  if (Uri.parse(url).getHost().equals("blog.csdn.net")) {
             // This is my web site, so do not override; let my WebView load the pagereturn false;
   }
         // Otherwise, the link is not for a page on my site, so launch another Activity that handles URLs
 Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
 startActivity(intent);
 return true;
 ```


###远程调试
<https://developer.chrome.com/devtools/docs/remote-debugging>






 ###错误

 #####小米4 VFY log
 ```
 -26 18:07:42.414: V/NBSAgent(14393): webview-->webview :c(WebView paramWebView)
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to find class referenced in signature (Landroid/webkit/ClientCertRequest;)
08-26 18:07:42.424: I/dalvikvm(14393): Could not find method android.webkit.WebViewClient.onReceivedClientCertRequest, referenced from method com.networkbench.agent.impl.webview.NBSWebViewClient.onReceivedClientCertRequest
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to resolve virtual method 10203: Landroid/webkit/WebViewClient;.onReceivedClientCertRequest (Landroid/webkit/WebView;Landroid/webkit/ClientCertRequest;)V
08-26 18:07:42.424: D/dalvikvm(14393): VFY: replacing opcode 0x6e at 0x0006
08-26 18:07:42.424: I/dalvikvm(14393): Could not find method android.webkit.WebViewClient.onReceivedClientCertRequest, referenced from method com.networkbench.agent.impl.webview.NBSWebViewClient.onReceivedClientCertRequest
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to resolve virtual method 10203: Landroid/webkit/WebViewClient;.onReceivedClientCertRequest (Landroid/webkit/WebView;Landroid/webkit/ClientCertRequest;)V
08-26 18:07:42.424: D/dalvikvm(14393): VFY: replacing opcode 0x6f at 0x000a
08-26 18:07:42.424: I/dalvikvm(14393): Could not find method android.webkit.WebViewClient.onUnhandledInputEvent, referenced from method com.networkbench.agent.impl.webview.NBSWebViewClient.onUnhandledInputEvent
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to resolve virtual method 10210: Landroid/webkit/WebViewClient;.onUnhandledInputEvent (Landroid/webkit/WebView;Landroid/view/InputEvent;)V
08-26 18:07:42.424: D/dalvikvm(14393): VFY: replacing opcode 0x6e at 0x0006
08-26 18:07:42.424: I/dalvikvm(14393): Could not find method android.webkit.WebViewClient.onUnhandledInputEvent, referenced from method com.networkbench.agent.impl.webview.NBSWebViewClient.onUnhandledInputEvent
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to resolve virtual method 10210: Landroid/webkit/WebViewClient;.onUnhandledInputEvent (Landroid/webkit/WebView;Landroid/view/InputEvent;)V
08-26 18:07:42.424: D/dalvikvm(14393): VFY: replacing opcode 0x6f at 0x000a
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to find class referenced in signature (Landroid/webkit/WebResourceRequest;)
08-26 18:07:42.424: I/dalvikvm(14393): Could not find method android.webkit.WebViewClient.shouldInterceptRequest, referenced from method com.networkbench.agent.impl.webview.NBSWebViewClient.shouldInterceptRequest
08-26 18:07:42.424: W/dalvikvm(14393): VFY: unable to resolve virtual method 10212: Landroid/webkit/WebViewClient;.shouldInterceptRequest (Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
08-26 18:07:42.424: D/dalvikvm(14393): VFY: replacing opcode 0x6e at 0x0006
08-26 18:07:42.424: I/NBSAgent(14393): webview-->javascript has enable 
```

```
Okhttp的一个类似的说明:
<https://github.com/square/okhttp/wiki/FAQs>
How do I fix verify warnings in dalvikvm?
OkHttp supports some APIs that require Java 7+ or Android API 20+. If you run OkHttp on earlier Android releases, dalvikvm's verifier will warn about the missing methods. This isn't a problem and you can ignore the warnings.
```