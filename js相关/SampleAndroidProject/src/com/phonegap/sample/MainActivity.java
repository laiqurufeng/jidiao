package com.phonegap.sample;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import com.splunk.mint.Mint;
import com.splunk.mint.MintJavascript;
import com.splunk.mint.MintWebView;
import com.splunk.mint.MintWebViewClient;

public class MainActivity extends Activity {

    public final static String TAG = "hope";
    private WebView mWebView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        Mint.initAndStartSession(this, "f091edc8");
        setContentView(R.layout.main_webview);
    }

    @Override
    protected void onStart() {
        super.onStart();

        mWebView = (WebView) findViewById(R.id.wv_demo);
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.setWebViewClient(new NBSWebViewClient(this, null));
//        MintJavascript mintJavascript = new MintJavascript(this, mWebView);
//        NBSJavascript javascript = new NBSJavascript(this, mWebView);
        CritterJSInterface javascript = new CritterJSInterface();
        mWebView.addJavascriptInterface(javascript, "_crttr");
//
//        UTester.instrumentWebViewNew(this, mWebView);
//        instrumentWebView(this, mWebView);
//        mWebView.getSettings().setJavaScriptEnabled(true);
//        super.loadUrl("file:///android_asset/www/index.html");
        mWebView.loadUrl("file:///android_asset/www/index.html");
//        mWebView.loadUrl("http://www.sina.com.cn/");

//        try{
//            Thread.sleep(1500);
//            //Thread.sleep(1500);
//        }catch (InterruptedException in){
//            Log.e(MainActivity.TAG, "sleep");
//        }
//
//        instrumentWebView(this, mWebView);
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
