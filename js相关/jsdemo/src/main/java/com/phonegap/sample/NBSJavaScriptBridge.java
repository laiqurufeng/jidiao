package com.phonegap.sample;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import java.util.HashMap;
import java.util.Iterator;
import org.json.JSONObject;

public class NBSJavaScriptBridge {
	private Context context;
	private WebView webview;

	private HashMap<String, Object> jExtraData = new HashMap(1);

	public NBSJavaScriptBridge(Context context, WebView webView) {
		this.context = context;
		this.webview = webView;
		this.jExtraData.put("webview", Boolean.valueOf(true));
	}

	@JavascriptInterface
	public void javascriptError(final String message, final String file,
								final String line, final String stacktrace,
								final String handled) {

		Log.i(MainActivity.TAG, "javascriptError," + "line:" + line + ", stacktrace:" + stacktrace);
	}

	@JavascriptInterface
	public void logNetwork(String method, String url, String latency, String httpStatusCode, String responseDataSize) {
		Log.i(MainActivity.TAG, "logNetwork method:" + method + "url:" + url + ", latency:" + latency + ", httpstatuscode:" + httpStatusCode);
	}

	@JavascriptInterface
	public void initAndStartSession(String apikey) {
	}

	@JavascriptInterface
	public void addExtraData(String key, String value) {
	}

	@JavascriptInterface
	public void clearExtraData() {
	}

	@JavascriptInterface
	public void closeSession() {
	}

	@JavascriptInterface
	public void flush() {
	}

	@JavascriptInterface
	public void leaveBreadcrumb(String breadcrumb) {
	}

	@JavascriptInterface
	public void logEvent(String event, String jsonExtra) {
		HashMap extraData = JsonStringToExtraData(jsonExtra);
		extraData.putAll(this.jExtraData);
	}

	@JavascriptInterface
	public void removeExtraData(String key) {
	}

	@JavascriptInterface
	public void setLogging(int lines, String filter) {
	}

	@JavascriptInterface
	public void setUserIdentifier(String userIdentifier) {
	}

	@JavascriptInterface
	public void startSession() {
	}

	@JavascriptInterface
	public void transactionStart(String name, String jsonExtra) {
		HashMap extraData = JsonStringToExtraData(jsonExtra);
		extraData.putAll(this.jExtraData);
	}

	@JavascriptInterface
	public void transactionStop(String name, String jsonExtra) {
		HashMap extraData = JsonStringToExtraData(jsonExtra);
		extraData.putAll(this.jExtraData);
	}

	@JavascriptInterface
	public void transactionCancel(String name, String reason, String jsonExtra) {
		 HashMap extraData = JsonStringToExtraData(jsonExtra);
		extraData.putAll(this.jExtraData);
	}

	@JavascriptInterface
	public void logView(String currentView, String loadTime, String domainLookupTime, String serverTime,
			String domProcessingTime, String host, String jsonExtra) {
		Log.i(MainActivity.TAG, "logView method:"+ currentView + "," + loadTime + "," + domainLookupTime +
		      "," + serverTime + "," + domProcessingTime + "," + host + "," + jsonExtra);

		HashMap<String, Object> extraData = new HashMap<String, Object>(2);
		extraData.put("webview", Boolean.valueOf(true));
		extraData.putAll(JsonStringToExtraData(jsonExtra));
		Integer loadTimeInt = Integer.valueOf(loadTime);
		Integer domainLookupTimeInt = Integer.valueOf(domainLookupTime);
		Integer serverTimeInt = Integer.valueOf(serverTime);
		Integer domProcessingTimeInt = Integer.valueOf(domProcessingTime);
	}

	private static synchronized HashMap<String, Object> JsonStringToExtraData(String jsontext) {
		HashMap<String, Object> extraData = new HashMap<String, Object>(2);
		if ((jsontext == null) || (jsontext.length() <= 4) || (jsontext.equals("undefined")))
			return extraData;
		try {
			JSONObject jObj = new JSONObject(jsontext);

			Iterator<String> keysItr = jObj.keys();
			while (keysItr.hasNext()) {
				String key = (String) keysItr.next();
				Object value = jObj.get(key);
				extraData.put(key, value);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return extraData;
	}
}