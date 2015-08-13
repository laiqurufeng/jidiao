package com.phonegap.sample;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Message;
import android.util.Base64;
import android.util.Log;
import android.view.InputEvent;
import android.view.KeyEvent;
import android.webkit.ClientCertRequest;
import android.webkit.HttpAuthHandler;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

public final class NBSWebViewClient extends WebViewClient {
	private WebViewClient previousWebview = null;
	private Context context;

	public NBSWebViewClient(Context paramContext, WebViewClient paramWebViewClient) {
		this.context = paramContext;

		//this.previousWebview = paramWebViewClient;
	}

	public final void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
		Log.i(MainActivity.TAG, "doUpdateVisitedHistory," + "url = " + url);
		if (this.previousWebview != null) {
            this.previousWebview.doUpdateVisitedHistory(view, url, isReload);
        }else{
            super.doUpdateVisitedHistory(view, url, isReload);
        }
	}

	public final void onFormResubmission(WebView view, Message dontResend, Message resend) {
		Log.i(MainActivity.TAG, "onFormResubmission," + "dontResend = " + dontResend.toString() + ", resend = " + resend.toString());
		if (this.previousWebview != null) {
            this.previousWebview.onFormResubmission(view, dontResend, resend);
        }else {
            super.onFormResubmission(view, dontResend, resend);
        }
	}

	public final void onLoadResource(WebView view, String url) {
		Log.i(MainActivity.TAG, "onLoadResource," + "url = " + url);
		if (this.previousWebview != null) {
            this.previousWebview.onLoadResource(view, url);
        }else{
            super.onLoadResource(view,url);
        }
	}

	public final void onPageFinished(WebView view, String url) {
//		Log.i(MainActivity.TAG, "onPageFinished," + "url = " + url);
//		try {
//			WebView localWebView1 = view;
//			NBSWebViewClient localao1 = this;
//			if (localWebView1.getSettings().getJavaScriptEnabled()) {
//				String str2 = "www/error.js";
//				WebView localWebView2 = localWebView1;
//				NBSWebViewClient localao2 = localao1;
//				try {
//					InputStream localInputStream;
//					byte[] arrayOfByte = new byte[(localInputStream = localao2.context.getAssets().open(str2)).available()];
//					localInputStream.read(arrayOfByte);
//					localInputStream.close();
//					String str3 = Base64.encodeToString(arrayOfByte, 2);
//					localWebView2.loadUrl(
//							"javascript:(function() {var parent = document.getElementsByTagName('head').item(0);var script = document.createElement('script');script.type = 'text/javascript';script.innerHTML = window.atob('"
//									+ str3 + "');parent.appendChild(script)})()");
//				} catch (IOException localIOException) {
//
//				}
//				String str1 = "{errorCallback: function(errorMsg, stackStr) {_crttr.logError(errorMsg, stackStr);},platform:\"android\"}";
//				localWebView1.loadUrl("javascript:(function(){ Crittercism.instrumentOnError(" + str1 + "); })()");
//			}
//		} catch (ThreadDeath localThreadDeath) {
//			throw localThreadDeath;
//		} catch (Throwable localThrowable) {
//		}

		if (this.previousWebview != null){
			this.previousWebview.onPageFinished(view, url);
        }else{
            super.onPageFinished(view,url);
        }
	}
    @Override
	public final void onPageStarted(WebView view, String url, Bitmap favicon) {
		Log.i(MainActivity.TAG, "onPageStarted," + "url = " + url);

		if (this.previousWebview != null) {
            this.previousWebview.onPageStarted(view, url, favicon);
        }else{
            super.onPageStarted(view, url, favicon);
        }

		String fileName = "www/test.js";
		try {
			InputStream localInputStream;
			byte[] arrayOfByte = new byte[(localInputStream = context.getAssets().open(fileName)).available()];
			if (arrayOfByte != null) {
				CustomLog.d("read bytes length:" + arrayOfByte.length);
            } else {
				CustomLog.d("read bytes failed!");
			}
			localInputStream.read(arrayOfByte);
			localInputStream.close();
			String str3 = new String(arrayOfByte, "UTF-8");
			view.loadUrl(str3);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedClientCertRequest(WebView view, ClientCertRequest request) {  //ClientCertRequest这个需要5.0以上的ApI进行编译(target)
		Log.i(MainActivity.TAG, "onReceivedClientCertRequest,");
		if (this.previousWebview != null) {
            this.previousWebview.onReceivedClientCertRequest(view, request);
        }else{
            super.onReceivedClientCertRequest(view, request);
        }
	}

	public final void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
		Log.i(MainActivity.TAG, "onReceivedError," + "errorCode = " + errorCode +
                ",description = " + description + ",failingUrl = " + failingUrl);
		if (this.previousWebview != null) {
            this.previousWebview.onReceivedError(view, errorCode, description, failingUrl);
        }else{
            super.onReceivedError(view, errorCode, description, failingUrl);
        }
	}

	public final void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
		Log.i(MainActivity.TAG, "onReceivedHttpAuthRequest," + "host = " + host +
                ",realm = " + realm);
		if (this.previousWebview != null) {
            this.previousWebview.onReceivedHttpAuthRequest(view, handler, host, realm);
        }else{
            super.onReceivedHttpAuthRequest(view, handler, host, realm);
        }
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedLoginRequest(WebView view, String realm, String account, String args) {
		Log.i(MainActivity.TAG, "onReceivedLoginRequest," + "realm = " + realm +
                ",account = " + account + ",args = " + args);
		if (this.previousWebview != null) {
            this.previousWebview.onReceivedLoginRequest(view, realm, account, args);
        }else{
            super.onReceivedLoginRequest(view, realm, account, args);
        }
	}

	@SuppressLint({ "NewApi" })
	public final void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
		Log.i(MainActivity.TAG, "onReceivedSslError," + "error = " + error.toString());
		if (this.previousWebview != null){
            this.previousWebview.onReceivedSslError(view, handler, error);
        }else{
            super.onReceivedSslError(view, handler, error);
        }

	}

	public final void onScaleChanged(WebView view, float oldScale, float newScale) {
		Log.i(MainActivity.TAG, "onScaleChanged," + "oldScale = " + oldScale +
                ",newScale = " + newScale);
		if (this.previousWebview != null){
            this.previousWebview.onScaleChanged(view, oldScale, newScale);
        } else{
            super.onScaleChanged(view, oldScale, newScale);
        }

	}

	public final void onTooManyRedirects(WebView view, Message cancelMsg, Message continueMsg) {
		if (this.previousWebview != null) {
            this.previousWebview.onTooManyRedirects(view, cancelMsg, continueMsg);
        }else{
            super.onTooManyRedirects(view, cancelMsg, continueMsg);
        }
	}

	@SuppressLint({ "NewApi" })
	public final void onUnhandledInputEvent(WebView view, InputEvent event) {
		Log.i(MainActivity.TAG, "onUnhandledInputEvent," + "event = " + event.toString());
		if (this.previousWebview != null) {
            this.previousWebview.onUnhandledInputEvent(view, event);
        }else{
            super.onUnhandledInputEvent(view, event);
        }
	}

	public final void onUnhandledKeyEvent(WebView view, KeyEvent event) {
		if (this.previousWebview != null) {
            this.previousWebview.onUnhandledKeyEvent(view, event);
        }else{
            super.onUnhandledKeyEvent(view, event);
        }
	}

	@SuppressLint({ "NewApi" })
	public final WebResourceResponse shouldInterceptRequest(WebView view, String url) {
		if (this.previousWebview != null) {
			return this.previousWebview.shouldInterceptRequest(view, url);
		}else{
            super.shouldInterceptRequest(view, url);
        }
		return null;
	}

	@SuppressLint({ "NewApi" })
	public final WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
		Log.i(MainActivity.TAG, "shouldInterceptRequest," + "request = " + request.toString());
		if (this.previousWebview != null) {
			return this.previousWebview.shouldInterceptRequest(view, request);
		}
		return null;
	}

	public final boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
		Log.i(MainActivity.TAG, "shouldOverrideKeyEvent," + "event = " + event.toString());
		if (this.previousWebview != null) {
			return this.previousWebview.shouldOverrideKeyEvent(view, event);
		}else{
            return this.previousWebview.shouldOverrideKeyEvent(view, event);
        }
		//return false;
	}

	public final boolean shouldOverrideUrlLoading(WebView view, String url) {
		Log.i(MainActivity.TAG, "shouldOverrideUrlLoading," + "url = " + url.toString());
		if (this.previousWebview != null) {
			return this.previousWebview.shouldOverrideUrlLoading(view, url);
		}else{
            return super.shouldOverrideUrlLoading(view, url);
        }
		//return false;
	}
}