package com.phonegap.sample;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MyActivity extends Activity {

	private WebView browser;
	private MyInnerClass myobj;
	
	@SuppressLint("JavascriptInterface")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

		browser = (WebView) findViewById(R.id.wv_demo);
		myobj = new MyInnerClass();

		browser.addJavascriptInterface(myobj, "calc");
		WebSettings settings = browser.getSettings();
		settings.setJavaScriptEnabled(true);
		browser.clearCache(true);
		browser.loadUrl("file:///android_asset/www/throwerror.html");
    }
    
    @Override
    public void onResume() {
    	super.onResume();
    }
    
    public class MyInnerClass    {
    	
    	public void throwexception() throws Exception
    	{
			Log.i("terror", "catch exception");
			throw new Exception();
    	}
    }
    
}
