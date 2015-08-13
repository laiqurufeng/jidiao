package com.phonegap.sample;

import android.webkit.JavascriptInterface;

public class CritterJSInterface {

	CritterJSInterface() {
	}

	@JavascriptInterface
	public void logError(String errorMsg, String stackStr) {
		CustomLog.d("logError function, errorMsg:" + errorMsg + ", stack:" + stackStr);
		try {
//			String str2 = stackStr;
//			String str1 = errorMsg;
//			CritterJSInterface localCritterJSInterface = this;
			if ((errorMsg == null) || (errorMsg.length() == 0))
				return;
			if ((stackStr == null) || (stackStr.length() == 0))
				return;
			String str3 = "";
			String str4 = "";
			String[] arrayOfString;
			if ((arrayOfString = errorMsg.split(":", 2)).length > 0) {
				if (arrayOfString[0].indexOf("Uncaught ") < 0)
					str3 = arrayOfString[0];
				else
					str3 = arrayOfString[0].substring(9);
				str3 = str3.trim();
			}
			if (arrayOfString.length > 1)
				str4 = arrayOfString[1].trim();

			CustomLog.d("logError:" + str3 + ", " + str4 + ", " + stackStr);
//			ci localci = new ci(str3, str4, str2);
//			localCritterJSInterface.a.b(localci);
			return;
		} catch (ThreadDeath localThreadDeath) {
			throw localThreadDeath;
		} catch (Throwable localThrowable) {
			localThrowable.printStackTrace();
		}
	}
}