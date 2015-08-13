package com.phonegap.sample;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

public class MainActivity extends Activity {

    public final static String TAG = "hope";
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

        mWebView = (WebView) findViewById(R.id.wv_demo);
        mWebView.getSettings().setJavaScriptEnabled(true);
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


}
