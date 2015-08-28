package app.test.tingyun.webviewtest;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;

import com.networkbench.agent.impl.webview.NBSWebviewUtil;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import app.test.tingyun.webviewtest.nbsJsBridge.NBSAgentJsInterface;

/**
 * Created by Administrator on 2015/8/26.
 */
public class WebActivity extends Activity {
    private String webViewFlag;
    private WebView webView;
    private WebView invisibleWebView;
    private EditText et;
    /**
     * 是在pageFinish还是在PageStarted的时候注入JS代码.true的时候表示在finsh的时候
     */
    private boolean pageFinishInstrument=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);

        getWebviewFlag();
        initView();
    }

    private void initView() {
        if (webViewFlag.equals(SplashActivity.NBS)) {
            webView = (WebView) this.findViewById(R.id.wv_nbs);
            invisibleWebView = (WebView) this.findViewById(R.id.wv_normal);
        } else {
            webView = (WebView) this.findViewById(R.id.wv_normal);
            invisibleWebView = (WebView) this.findViewById(R.id.wv_nbs);
        }
        et = (EditText) this.findViewById(R.id.et_url);
        //instrument webview;
        instrumentAndShowWebView();
    }

    private void instrumentAndShowWebView() {
        //设置其中一个webview可见
        webView.setVisibility(View.VISIBLE);
        invisibleWebView.setVisibility(View.GONE);

        //webview设置
        setWebViewSettings();

        if (webViewFlag.equals(SplashActivity.NBS)) {
            //NBSWEBVIEW会自动注入
        } else {
            //原生的WEBVIEW需要自己注入
            webView.setVisibility(View.VISIBLE);
            invisibleWebView.setVisibility(View.INVISIBLE);
            NBSWebviewUtil.instrumentWebView(this, webView,pageFinishInstrument);
        }

    }

    private void setWebViewSettings() {
      //  开启debug
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        webView.addJavascriptInterface(new NBSAgentJsInterface(),"nbsAgent");

        if (webViewFlag.equals(SplashActivity.NBS)) {
//            webView.setWebViewClient(new NBSWebViewClient(){
//                @Override
//                //Give the host application a chance to take over the control when a new url is about to be loaded in the current WebView.
//                public boolean shouldOverrideUrlLoading(WebView view, String url) {
//                    return true;
//                }
//            });
        } else {
            webView.setWebViewClient(new WebViewClient() {
                @Override
                //Give the host application a chance to take over the control when a new url is about to be loaded in the current WebView.
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    return false;   // return true;  webview处理url是根据程序来执行的。 return false; webview处理url是在webview内部执行。
                }

                @Override
                public void onPageStarted(WebView view, String url, Bitmap favicon) {
                    super.onPageStarted(view, url, favicon);
                    //one apm 是在 这时候进行 注入js 回调接口的.
                    Log.d("tingyun" ,"onPageStarted has run");

                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    //one apm在这里进行嵌码的.
                    Log.d("tingyun", "onPageFinished has run");
                }
            });
        }


        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        webView.getSettings().setDomStorageEnabled(true);    //Build.VERSION.SDK_INT >= 7
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);//Build.VERSION.SDK_INT >= 16



//        //是否运行跨域
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN){
//            webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
//            webView.getSettings().setAllowFileAccessFromFileURLs(true);
//        }

    }

    public void loadAssetsUrl(View view){
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    private void getWebviewFlag() {
        Intent intent = getIntent();
        webViewFlag = intent.getStringExtra("webviewtype");
        int features = intent.getIntExtra("options",0);
        Log.d("tingyun","features is " +features);
        if((features & SplashActivity.PageFinish)!=0){
            pageFinishInstrument=true;
        }
        if (webViewFlag == null) {
            webViewFlag = SplashActivity.NORMAL;
        }
    }

    public void clear(View view) {
        et.setText("");
    }

    public void sethttp(View view) {
        et.setText("http://www.");
    }
    public void go_forward(View view) {
        String str = et.getText().toString().trim();
        if (TextUtils.isEmpty(str)) {
            Toast.makeText(this, "必须填入一个url", Toast.LENGTH_SHORT).show();
        } else {
            webView.loadUrl(str);
        }
    }

    public void loadOneAPMJS(WebView paramWebView){
       // String str1 = "oneapm/oneapm_webview.js";
        String str1 = "oneapm_webview.js";
        try
        {
//            if (!Arrays.asList(paramWebView.getContext().getResources().getAssets().list("oneapm")).contains("oneapm_webview.js")) {
//                return;
//            }
            InputStream localInputStream = paramWebView.getContext().getAssets().open(str1);
            byte[] arrayOfByte = new byte[localInputStream.available()];
            localInputStream.read(arrayOfByte);
            localInputStream.close();
            String str2 = Base64.encodeToString(arrayOfByte, 2);
            String str3 = a(paramWebView);
            paramWebView.loadUrl("javascript:(function() { var parent = document.getElementsByTagName('head').item(0);var script = document.createElement('script');script.type = 'text/javascript';script.innerHTML = window.atob('" + str2 + "');" + "parent.appendChild(script)" + "})()");
         //   B.newInstance(str3);
            paramWebView.loadUrl("javascript:_oneapm_ivoke_java_commit_data('" + str3 + "')");
        }
        catch (IOException e)
        {
            Log.e("tingyun","loadOneAPMJS() has An IO Exception",e);
            e.printStackTrace();
        }
       // a.getAgentLog().info("\" insert  and invoke succeed !\"");
        Log.i("tingyun","\" insert  and invoke succeed !\"");
    }
    private static String a(WebView paramWebView)
    {
        String str = "null";
        if (paramWebView == null) {
            return str;
        }
        try
        {
            Context localContext = paramWebView.getContext();
            Activity localActivity = (Activity)localContext;
            return "WebView@" + localActivity.getClass().getSimpleName();
        }
        catch (Exception localException) {}
        return str;
    }
}
