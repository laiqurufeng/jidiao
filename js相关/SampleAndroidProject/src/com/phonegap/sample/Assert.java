package com.phonegap.sample;

public final class Assert {
    public static boolean isEnabled = true;

    public static void is(boolean expression) {
        if (!isEnabled) {
            return;
        }

        if (!expression)
            throw new Error("Assertion failed");
    }

    public static void notNull(Object o) {
        if (!isEnabled) {
            return;
        }

        if (o == null)
            throw new Error("Not null assertion failed");
    }

    public static void fail(Throwable t) {
        if (!isEnabled) {
            return;
        }

        CustomLog.e("Crittercism", "Assertion failed", t);

        throw new Error("Assertion failed", t);
    }
}