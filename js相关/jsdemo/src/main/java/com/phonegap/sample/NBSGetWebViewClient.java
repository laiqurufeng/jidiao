package com.phonegap.sample;

import android.os.Build.VERSION;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public final class NBSGetWebViewClient {
	public NBSGetWebViewClient() {
		if ((VERSION.SDK_INT < 14) || (VERSION.SDK_INT > 21)) {
//			throw new cd("API Level " + Build.VERSION.SDK_INT
//					+ " does not supportWebView monitoring. Skipping instrumentation.");
			Log.e(MainActivity.TAG, "(VERSION.SDK_INT < 14) || (VERSION.SDK_INT > 21)");
		}
	}

	public static WebViewClient a(WebView paramWebView) {
		Log.i(MainActivity.TAG, "a(WebView paramWebView)");
		try {
			Class<?> localClass = Class.forName("android.webkit.CallbackProxy");
			Object localObject;
			return (WebViewClient) (localObject = ReflectUtils.setAccessible(WebView.class, localClass, true).get(paramWebView)).getClass()
					.getMethod("getWebViewClient", new Class[0]).invoke(localObject, new Object[0]);
		} catch (ClassNotFoundException localClassNotFoundException) {
			Log.e(MainActivity.TAG, "a ClassNotFoundException");
		} catch (InvocationTargetException localInvocationTargetException) {
			Log.e(MainActivity.TAG, "a InvocationTargetException");
		} catch (NoSuchMethodException localNoSuchMethodException) {
			Log.e(MainActivity.TAG, "a NoSuchMethodException");
		} catch (IllegalAccessException localIllegalAccessException) {
			Log.e(MainActivity.TAG, "a IllegalAccessException");
		} catch (SecurityException localSecurityException) {
			Log.e(MainActivity.TAG, "a SecurityException");
		}
		Log.i(MainActivity.TAG, "A(WebView paramWebView)");
		
		return null;
	}

	public static WebViewClient b(WebView paramWebView) {
		Log.i(MainActivity.TAG, "b(WebView paramWebView)");
		try {
			Method provider = WebView.class.getMethod("getWebViewProvider", new Class[0]);
			Object providerObject = provider.invoke(paramWebView, new Object[0]);
			Method client = providerObject.getClass().getMethod("getWebViewClient", new Class[0]);
			//client.invoke(providerObject, new Object[0]);
			Object ss = client.invoke(providerObject, new Object[0]);

			return (WebViewClient) ss;

//			return (WebViewClient) (localObject = WebView.class.getMethod("getWebViewProvider", new Class[0])
//					.invoke(paramWebView, new Object[0])).getClass().getMethod("getWebViewClient", new Class[0])
//							.invoke(localObject, new Object[0]);
		} catch (InvocationTargetException localInvocationTargetException) {
			Log.e(MainActivity.TAG, "b InvocationTargetException");
			localInvocationTargetException.printStackTrace();
//			throw new cd(localInvocationTargetException);
		} catch (NoSuchMethodException localNoSuchMethodException) {
			Log.e(MainActivity.TAG, "b NoSuchMethodException");
//			throw new cd(localNoSuchMethodException);
		} catch (IllegalAccessException localIllegalAccessException) {
			Log.e(MainActivity.TAG, "b IllegalAccessException");
//			throw new cd(localIllegalAccessException);
		} catch (SecurityException localSecurityException) {
			Log.e(MainActivity.TAG, "b SecurityException");
//			throw new cd(localSecurityException);
		}
		Log.i(MainActivity.TAG, "b(WebView paramWebView)");
		
		return null;
	}

	public static WebViewClient c(WebView paramWebView) {
		Log.i(MainActivity.TAG, "c(WebView paramWebView)");
		try {
			Method getProvederMethod = WebView.class.getMethod("getWebViewProvider", new Class[0]);
			Object providerObject = getProvederMethod.invoke(paramWebView, new Object[0]);
			
			Field adapterField = providerObject.getClass().getDeclaredField("mContentsClientAdapter");
			adapterField.setAccessible(true);

//			(localField = (localObject1 = WebView.class.getMethod("getWebViewProvider", new Class[0])
//					.invoke(paramWebView, new Object[0])).getClass().getDeclaredField("mContentsClientAdapter"))
//							.setAccessible(true);
			Object localObject2 = adapterField.get(providerObject);
			return (WebViewClient) ReflectUtils.setAccessible(localObject2.getClass(), WebViewClient.class, true)
					.get(localObject2);

		} catch (InvocationTargetException localInvocationTargetException) {
			Log.e(MainActivity.TAG, "c InvocationTargetException");
//			throw new cd(localInvocationTargetException);
		} catch (NoSuchMethodException localNoSuchMethodException) {
			Log.e(MainActivity.TAG, "c NoSuchMethodException");
//			throw new cd(localNoSuchMethodException);
		} catch (NoSuchFieldException localNoSuchFieldException) {
			Log.e(MainActivity.TAG, "c NoSuchFieldException");
//			throw new cd(localNoSuchFieldException);
		} catch (IllegalAccessException localIllegalAccessException) {
			Log.e(MainActivity.TAG, "c IllegalAccessException");
//			throw new cd(localIllegalAccessException);
		} catch (SecurityException localSecurityException) {
			Log.e(MainActivity.TAG, "c SecurityException");
//			throw new cd(localSecurityException);
		}

		Log.i(MainActivity.TAG, "C(WebView paramWebView)");
		
		return null;
	}
}