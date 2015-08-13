package com.phonegap.sample;

import android.util.Log;

public final class CustomLog {
	
    public static InternalExceptionReportingState doInternalExceptionReporting = InternalExceptionReportingState.UNINITIALIZED;

    /**
     * isPrint: print switch, true will print. false not print
     */
    public static boolean isPrint = true;
    public static String defaultTag = "appmonitor";
    public static String httpresult = "appmonitor";

    private CustomLog() {}

    public static void setTag(String tag) {
        defaultTag = tag;
    }

    public static int i(Object o) {
        return isPrint && o != null ? Log.i(defaultTag, o.toString()) : -1;
    }

    public static int i(String m) {
        return isPrint && m != null ? Log.i(defaultTag, m) : -1;
    }
    
    public static int d(String m) {
        return isPrint && m != null ? Log.d(defaultTag, m) : -1;
    }
    
    public static int v(String m) {
        return isPrint && m != null ? Log.v(defaultTag, m) : -1;
    }

    /**
     * ******************** Log **************************
     */
    public static int v(String tag, String msg) {
        return isPrint && msg != null ? Log.v(tag, msg) : -1;
    }
    
    public static void d(Throwable t) {
        Log.d(defaultTag, t.getMessage(), t);
    }

    public static int d(String tag, String msg) {
        return isPrint && msg != null ? Log.d(tag, msg) : -1;
    }

    public static int i(String tag, String msg) {
        return isPrint && msg != null ? Log.i(tag, msg) : -1;
    }

    public static int w(String tag, String msg) {
        return isPrint && msg != null ? Log.w(tag, msg) : -1;
    }

    public static int e(String tag, String msg) {
        return isPrint && msg != null ? Log.e(tag, msg) : -1;
    }

    /**
     * ******************** Log with object list **************************
     */
    public static int v(String tag, Object... msg) {
        return isPrint ? Log.v(tag, getLogMessage(msg)) : -1;
    }

    public static int d(String tag, Object... msg) {
        return isPrint ? Log.d(tag, getLogMessage(msg)) : -1;
    }

    public static int i(String tag, Object... msg) {
        return isPrint ? Log.i(tag, getLogMessage(msg)) : -1;
    }

    public static int w(String tag, Object... msg) {
        return isPrint ? Log.w(tag, getLogMessage(msg)) : -1;
    }

    public static int e(String tag, Object... msg) {
        return isPrint ? Log.e(tag, getLogMessage(msg)) : -1;
    }

    private static String getLogMessage(Object... msg) {
        if (msg != null && msg.length > 0) {
            StringBuilder sb = new StringBuilder();
            for (Object s : msg) {
                if (msg != null && s != null) {
                    sb.append(s.toString());
                }
            }
            return sb.toString();
        }
        return "";
    }

    /**
     * ******************** Log with Throwable **************************
     */
    public static int v(String tag, String msg, Throwable tr) {
        return isPrint && msg != null ? Log.v(tag, msg, tr) : -1;
    }

    public static int d(String tag, String msg, Throwable tr) {
        return isPrint && msg != null ? Log.d(tag, msg, tr) : -1;
    }

    public static int i(String tag, String msg, Throwable tr) {
        return isPrint && msg != null ? Log.i(tag, msg, tr) : -1;
    }

    public static int w(String tag, String msg, Throwable tr) {
        return isPrint && msg != null ? Log.w(tag, msg, tr) : -1;
    }

    public static int e(String tag, String msg, Throwable tr) {
        return isPrint && msg != null ? Log.e(tag, msg, tr) : -1;
    }

    /**
     * ******************** TAG use Object Tag **************************
     */
    public static int v(Object tag, String msg) {
        return isPrint ? Log.v(tag.getClass().getSimpleName(), msg) : -1;
    }

    public static int d(Object tag, String msg) {
        return isPrint ? Log.d(tag.getClass().getSimpleName(), msg) : -1;
    }

    public static int i(Object tag, String msg) {
        return isPrint ? Log.i(tag.getClass().getSimpleName(), msg) : -1;
    }

    public static int w(Object tag, String msg) {
        return isPrint ? Log.w(tag.getClass().getSimpleName(), msg) : -1;
    }

    public static int e(Object tag, String msg) {
        return isPrint ? Log.e(tag.getClass().getSimpleName(), msg) : -1;
    }
    
    public static enum InternalExceptionReportingState {
        UNINITIALIZED,
        ON,
        OFF;
    }

}
