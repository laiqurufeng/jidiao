package app.test.tingyun.webviewtest;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.blueware.agent.android.BlueWare;

public class SplashActivity extends AppCompatActivity {
    public static final String  NBS="NBSWebView";
    public static final String NORMAL="NORMAL";
    public static final int PageFinish=1;
    private String nextWebViewFlag=NORMAL;
    private int options=0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
       // NBSAppAgent.setLicenseKey("59c0e48d745340d3a12c37a5a701dc05  ").withLocationServiceEnabled(true).start(this);
        BlueWare.withApplicationToken("6D5FF581C47729FCE7A3D55D400C425A35").start(this.getApplication());
    }

    @Override
    protected void onResume() {
        super.onResume();
    }


    public void testNBSWebView(View view){
        nextWebViewFlag=NBS;
        startNextActivity();
    }
    public void testNormal(View view){
        nextWebViewFlag=NORMAL;
        startNextActivity();
    }

    public void testNormal_pagefinish(View view){
        options=options|PageFinish;
        nextWebViewFlag=NORMAL;
        startNextActivity();
    }

    private void startNextActivity() {
        Intent startActivityIntent=new Intent(this,WebActivity.class);
        startActivityIntent.putExtra("webviewtype",nextWebViewFlag);
        startActivityIntent.putExtra("options",options);
        this.startActivity(startActivityIntent);
    }


}
