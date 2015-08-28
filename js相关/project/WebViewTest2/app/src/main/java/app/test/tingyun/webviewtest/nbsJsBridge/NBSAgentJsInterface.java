package app.test.tingyun.webviewtest.nbsJsBridge;

import android.text.TextUtils;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.blueware.agent.android.r;
import com.blueware.agent.android.u;
import com.blueware.agent.android.z;
import com.blueware.com.google.gson.n;
/**
 * Created by Administrator on 2015/8/27.
 */
public class NBSAgentJsInterface {

    private static final String a = "Mobile/Summary/WebView";
    private static final String b = "Mobile/WebView/Summary/Name/";

    @JavascriptInterface
    public void addTotalWebViewSummary(String paramString)
    {
        debug("addTotalWebViewSummary:" + paramString);
    }


    @JavascriptInterface
    public void addSingleWebViewSummary(String paramString1, String paramString2) {
        debug("addSingleWebViewSummary: " + paramString1 + ",webviewid:" + paramString2 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new B(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Mobile/WebView/Name/" + paramString2);
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String) localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String) localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(0.0D));
//            localC.setScope("");
//            e.addMetric(localC);
            debug("addSingleWebViewSummary,  added metric");
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void addWebViewSummaryMetric(String paramString1, String paramString2) {
        debug("addSingleWebViewSummary : " + paramString1 + ",webviewid:" + paramString2 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new C(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Mobile/Summary/" + paramString2);
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String)localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String)localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("singe_webview_summary")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(0.0D));
//            localC.setScope("Mobile/WebView/Summary/Name/" + paramString2);
//            e.addMetric(localC);
//            debug("addSingleWebViewSummary,  added metric");
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void addLinkMetric(String paramString1, String paramString2)
    {
        debug("addLinkMetric,excludeTime:" + paramString1 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new D(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Method/" + paramString2 + "/CSS");
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String) localMap.get("total")) / 1000.0D));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String) localMap.get("exclusive")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("min")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("max")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(Double.parseDouble((String) localMap.get("sum_of_squares")) / 1000.0D));
//            localC.setScope("Mobile/WebView/Name/" + paramString2);
//            e.addMetric(localC);
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void addScriptMetric(String paramString1, String paramString2)
    {
        debug("addScriptMetric,maxTime:" + paramString1 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new E(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Method/" + paramString2 + "/JS");
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String) localMap.get("total"))));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String) localMap.get("exclusive")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("min")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String) localMap.get("max")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(Double.parseDouble((String) localMap.get("sum_of_squares")) / 1000.0D));
//            localC.setScope("Mobile/WebView/Name/" + paramString2);
//            e.addMetric(localC);
            debug("scriptMetric,  added metric");
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void addImageMetric(String paramString1, String paramString2)
    {
        debug("addImageMetric,totalTime:" + paramString1 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new F(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Method/" + paramString2 + "/IMAGE");
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String)localMap.get("total")) / 1000.0D));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String)localMap.get("exclusive")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("min")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("max")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(Double.parseDouble((String)localMap.get("sum_of_squares")) / 1000.0D));
//            localC.setScope("Mobile/WebView/Name/" + paramString2);
//            e.addMetric(localC);
//            debug("addImageMetric,  added metric");
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void addDomainLookupTime(String paramString1, String paramString2)
    {
        debug("addDomainLookupTime,totalTime:" + paramString1 + ",webViewId:" + paramString2);
        try
        {
//            n localn = new n();
//            Map localMap = (Map)localn.fromJson(paramString1, new G(this).getType());
//            com.blueware.agent.android.C localC = new com.blueware.agent.android.C("Method/" + paramString2 + "/DNS_LOOKUP");
//            localC.setCount(1L);
//            localC.setTotal(Double.valueOf(Double.parseDouble((String)localMap.get("addDomainLookupTime")) / 1000.0D));
//            localC.setExclusive(Double.valueOf(Double.parseDouble((String)localMap.get("addDomainLookupTime")) / 1000.0D));
//            localC.setMinFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("addDomainLookupTime")) / 1000.0D));
//            localC.setMaxFieldValue(Double.valueOf(Double.parseDouble((String)localMap.get("addDomainLookupTime")) / 1000.0D));
//            localC.setSumOfSquares(Double.valueOf(0.0D));
//            localC.setScope("Mobile/WebView/Name/" + paramString2);
//            e.addMetric(localC);
//            debug("addDomainLookupTime,totalTime added metric");
        }
        catch (Exception localException)
        {
            localException.printStackTrace();
        }
    }

    @JavascriptInterface
    public void fetchPageContent(String paramString1, String paramString2) {
        try {
            paramString2 = "Mobile/Summary/WebView/" + paramString2;
            info("fetchPageContent content   " + paramString1 + "  webviewid :" + paramString2);
            com.blueware.agent.android.A localA = (com.blueware.agent.android.A)new n().fromJson(paramString1, com.blueware.agent.android.A.class);
            localA.setName(paramString2);
            com.blueware.agent.android.B localB = com.blueware.agent.android.B.getInstance();
            if (localB == null)
            {
                localB = com.blueware.agent.android.B.newInstance(paramString2);
                localB.clearAll();
            }
            if (!localB.pageName.equals(paramString2)) {
                localB.clearAll();
                warning("fetchPageContent   new page clear  data.");
            }
            else
            {
                localB = com.blueware.agent.android.B.newInstance(paramString2);
                localB.clearAll();
                error("fetchPageContent   PageTimingModel is null   .");
            }
            if (localB.addPageData(localA)) {
                u.getInstance().addPageTimingModel(localB);
            } else {
                error("fetchPageContent  exists  not add    .");
            }
        } catch (Exception localException)
        {
            error("fetchPageContent error:" + localException.getMessage());
        }
    }
    @JavascriptInterface
    private void info(String s) {
        Log.i("tingyun",s);
    }
    @JavascriptInterface
    private void error(String s) {
        Log.e("tingyun",s);
    }
    @JavascriptInterface
    private void warning(String s) {
        Log.w("tingyun",s);
    }

    @JavascriptInterface
    public void androidLog(String paramString1, String paramString2)
    {
        debug("androidLog:paramString1: "+paramString1+",paramString2: "+paramString2);
        if (TextUtils.isEmpty(paramString2)) {
            return;
        }
        String[] arrayOfString = { "info", "error" };
        if ((paramString1 == arrayOfString[0]) || (paramString1 == arrayOfString[1]))
        {
            if (paramString1 == arrayOfString[0]) {
                info(paramString2);
            } else {
                error(paramString2);
            }
        }
        else
        {
            error("error log level ");
            return;
        }
    }

    @JavascriptInterface
    public void onError(String paramString) {
        if ((paramString == null) || ("".equals(paramString))) {
            return;
        }
        debug("JS Error Relations: JS Error msg " + paramString);
        r localr = r.getInstance();
        debug("JS Error Relations: " + paramString);
        String[] arrayOfString = (String[])new n().fromJson(paramString, String[].class);
        z localz = new z();
        if (localz.build(arrayOfString)) {
            localr.addNewJSErrorData(localz);
        }
    }
    @JavascriptInterface
    public void debug(String debuglog){
        Log.d("tingyun","webview"+debuglog);
    }

}
