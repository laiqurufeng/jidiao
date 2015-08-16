package com.phonegap.sample;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import app.test.tingyun.jsdemo.R;

public class MainActivity extends Activity {

    public final static String TAG = "appmonitor";
    private WebView mWebView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        setContentView(R.layout.main_webview);
    }

    @Override
    protected void onStart() {
        super.onStart();

        mWebView = (WebView) findViewById(R.id.wv_demo);
/*        mWebView.getSettings().setJavaScriptEnabled(true);
        CritterJSInterface javascript = new CritterJSInterface();
        mWebView.addJavascriptInterface(javascript, "_crttr");
        mWebView.setWebViewClient(new NBSWebViewClient(this, null));

        mWebView.loadUrl("file:///android_asset/www/index.html");*/


        //需要添加http头,否则会有webView跨域攻击的风险.
        //http://www.2cto.com/Article/201501/370287.html
        //运行跨域访问.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
            mWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);

        mWebView.getSettings().setJavaScriptEnabled(true);
        //对webview 进行使能替换
      //  instrumentWebView(this, mWebView);



        NBSJavaScriptBridge mintJavascript = new NBSJavaScriptBridge(this, mWebView);
        mWebView.addJavascriptInterface(mintJavascript, "nbsJsBridge");
        mWebView.setWebViewClient(new NBSInstrumentWebView(this));


        mWebView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    protected void onResume() {
        super.onResume();

        try{
            Thread.sleep(1500);
            //Thread.sleep(1500);
        }catch (InterruptedException in){
            Log.e(MainActivity.TAG, "sleep");
        }

//        UTester.instrumentWebView(this, mWebView);
//        instrumentWebView(this, mWebView);
    }

    public static void instrumentWebView(Context context, WebView webView) {
        Log.i(TAG, "instrumentWebView");
        try {

            WebView localWebView1 = webView;
            if (webView == null) {
                return;
            }

            WebView localWebView2 = localWebView1;
            if (Looper.myLooper() != Looper.getMainLooper()) {
                return;
            }

            WebView localWebView3 = localWebView2;
            Log.i(MainActivity.TAG, "Build.VERSION.SDK_INT = " + Build.VERSION.SDK_INT);
            WebViewClient localWebViewClient = Build.VERSION.SDK_INT <= 18 ? NBSGetWebViewClient.b(localWebView3)
                    : Build.VERSION.SDK_INT <= 15 ? NBSGetWebViewClient.a(localWebView3) : NBSGetWebViewClient.c(localWebView3);
            Log.i(MainActivity.TAG, "44");
            NBSWebViewClient localao = new NBSWebViewClient(context, localWebViewClient);//
            localWebView2.setWebViewClient(localao);

            if (localWebView2.getSettings().getJavaScriptEnabled()) {
                //  localWebView2.addJavascriptInterface(new CritterJSInterface(), "_crttr");
                NBSJavaScriptBridge mintJavascript = new NBSJavaScriptBridge(context, webView);
                webView.addJavascriptInterface(mintJavascript, "nbsJsBridge");
            }
            return;
        } catch (ThreadDeath localThreadDeath) {
            Log.i(MainActivity.TAG, "ThreadDeath");
            throw localThreadDeath;
        } catch (Throwable localThrowable) {
            Log.i(MainActivity.TAG, "Throwable = " + localThrowable.toString());
        }
    }
}
