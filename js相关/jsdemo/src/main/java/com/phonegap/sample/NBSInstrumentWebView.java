package com.phonegap.sample;

import java.io.*;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Environment;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class NBSInstrumentWebView extends WebViewClient {

    Context context;

    public NBSInstrumentWebView(Context context) {
        this.context = context;
    }

    public void onPageStarted(WebView webView, String url, Bitmap favicon) {
        super.onPageStarted(webView, url, favicon);
//		String javaScriptStr = CustomMintJavascript.loadMintJavascript();
//		writeStringAsFile(javaScriptStr, "test.js");
//		view.loadUrl(javaScriptStr);


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
            webView.loadUrl(str3);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void writeStringAsFile(final String fileContents, String fileName) {
        try {
            File file = new File(Environment.getExternalStorageDirectory() + File.separator + "test.js");
            if (!file.exists()) {
                file.createNewFile();
            }
            FileWriter out = new FileWriter(file);
            out.write(fileContents);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}