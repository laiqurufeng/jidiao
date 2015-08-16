package com.phonegap.sample;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Message;
import android.util.Base64;
import android.view.InputEvent;
import android.view.KeyEvent;
import android.webkit.*;

import java.io.IOException;
import java.io.InputStream;

@SuppressLint("NewApi")
public final class NBSWebViewClient extends WebViewClient {
	private WebViewClient proxy = null;
	private Context context;
	long startTime;

	public NBSWebViewClient(Context paramContext, WebViewClient paramWebViewClient) {
		this.context = paramContext;
		this.proxy = paramWebViewClient;
	}

	public final void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
		CustomLog.d("doUpdateVisitedHistory," + "url = " + url);
		if (this.proxy != null)
			this.proxy.doUpdateVisitedHistory(view, url, isReload);
	}

	public final void onFormResubmission(WebView view, Message dontResend, Message resend) {
		CustomLog.d( "onFormResubmission," + "dontResend = " + dontResend.toString() + ", resend = " + resend.toString());
		if (this.proxy != null)
			this.proxy.onFormResubmission(view, dontResend, resend);
	}

	public final void onLoadResource(WebView view, String url) {
		CustomLog.d( "onLoadResource," + "url = " + url);
		if (this.proxy != null)
			this.proxy.onLoadResource(view, url);
	}

	public final void onPageFinished(WebView webView, String url) {
		long initTimeDelta = (System.nanoTime() - startTime) / 1000000L;
		CustomLog.d( "onPageFinished," + "url = " + url + ", time:" + initTimeDelta);
		try {
//			WebView localWebView1 = view;
//			NBSWebViewClient localao1 = this;
			if (webView.getSettings().getJavaScriptEnabled()) {
				String str2 = "www/error.js";
//				WebView localWebView2 = localWebView1;
//				NBSWebViewClient localao2 = localao1;
				try {
					InputStream localInputStream;
					byte[] arrayOfByte = new byte[(localInputStream = context.getAssets().open(str2)).available()];
					if (arrayOfByte != null) {
						CustomLog.d("read bytes length:" + arrayOfByte.length);
					} else {
						CustomLog.d("read bytes failed!");
					}
					localInputStream.read(arrayOfByte);
					localInputStream.close();
					String str3 = Base64.encodeToString(arrayOfByte, 2);
					webView.loadUrl(
							"javascript:(function() {var parent = document.getElementsByTagName('head').item(0);var script = document.createElement('script');script.type = 'text/javascript';script.innerHTML = window.atob('"
									+ str3 + "');parent.appendChild(script)})()");
				} catch (IOException localIOException) {
//					dr.a(localIOException);
					CustomLog.d("exception:" + localIOException.toString());
				}
				String str1 = "{errorCallback: function(errorMsg, stackStr) {_crttr.logError(errorMsg, stackStr);},platform:\"android\"}";
				webView.loadUrl("javascript:(function(){ Crittercism.instrumentOnError(" + str1 + "); })()");
			}
		} catch (ThreadDeath localThreadDeath) {
			throw localThreadDeath;
		} catch (Throwable localThrowable) {
//			dr.a(localThrowable);
		}

		if (this.proxy != null)
			this.proxy.onPageFinished(webView, url);
	}

	public final void onPageStarted(WebView view, String url, Bitmap favicon) {
		CustomLog.d( "onPageStarted," + "url = " + url);
		startTime = System.nanoTime();
		if (this.proxy != null)
			this.proxy.onPageStarted(view, url, favicon);
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedClientCertRequest(WebView view, ClientCertRequest request) {
		CustomLog.d( "onReceivedClientCertRequest,");
		if (this.proxy != null)
			this.proxy.onReceivedClientCertRequest(view, request);
	}

	public final void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
		CustomLog.d( "onReceivedError," + "errorCode = " + errorCode +
				",description = " + description + ",failingUrl = " + failingUrl);
		if (this.proxy != null)
			this.proxy.onReceivedError(view, errorCode, description, failingUrl);
	}

	public final void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
		CustomLog.d( "onReceivedHttpAuthRequest," + "host = " + host +
				",realm = " + realm);
		if (this.proxy != null)
			this.proxy.onReceivedHttpAuthRequest(view, handler, host, realm);
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedLoginRequest(WebView view, String realm, String account, String args) {
		CustomLog.d( "onReceivedLoginRequest," + "realm = " + realm +
				",account = " + account + ",args = " + args);
		if (this.proxy != null)
			this.proxy.onReceivedLoginRequest(view, realm, account, args);
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
		CustomLog.d( "onReceivedSslError," + "error = " + error.toString());
		if (this.proxy != null)
			this.proxy.onReceivedSslError(view, handler, error);
	}

	public final void onScaleChanged(WebView view, float oldScale, float newScale) {
		CustomLog.d( "onScaleChanged," + "oldScale = " + oldScale +
				",newScale = " + newScale);
		if (this.proxy != null)
			this.proxy.onScaleChanged(view, oldScale, newScale);
	}

	public final void onTooManyRedirects(WebView view, Message cancelMsg, Message continueMsg) {
		CustomLog.d( "cancelMsg:" + cancelMsg + "continueMsg: " + continueMsg);
		if (this.proxy != null)
			this.proxy.onTooManyRedirects(view, cancelMsg, continueMsg);
	}

	@SuppressLint({ "NewApi" })
	public final void onUnhandledInputEvent(WebView view, InputEvent event) {
		CustomLog.d( "onUnhandledInputEvent," + "event = " + event.toString());
		if (this.proxy != null)
			this.proxy.onUnhandledInputEvent(view, event);
	}

	public final void onUnhandledKeyEvent(WebView view, KeyEvent event) {
		CustomLog.d( "onUnhandledInputEvent," + "event = " + event.toString());
		if (this.proxy != null)
			this.proxy.onUnhandledKeyEvent(view, event);
	}

	@SuppressLint({ "NewApi" })
	public final WebResourceResponse shouldInterceptRequest(WebView view, String url) {
		CustomLog.d( "shouldInterceptRequest," + "url= " + url);
		if (this.proxy != null) {
			return this.proxy.shouldInterceptRequest(view, url);
		}
		return null;
	}

	@SuppressLint({ "NewApi" })
	public final WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
		CustomLog.d( "shouldInterceptRequest," + "request = " + request.toString());
		if (this.proxy != null) {
			return this.proxy.shouldInterceptRequest(view, request);
		}
		return null;
	}

	public final boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
		CustomLog.d( "shouldOverrideKeyEvent," + "event = " + event.toString());
		if (this.proxy != null) {
			return this.proxy.shouldOverrideKeyEvent(view, event);
		}
		return false;
	}

	public final boolean shouldOverrideUrlLoading(WebView view, String url) {
		CustomLog.d( "shouldOverrideUrlLoading," + "url = " + url.toString());
		if (this.proxy != null) {
			return this.proxy.shouldOverrideUrlLoading(view, url);
		}
		return false;
	}
}