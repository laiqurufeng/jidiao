//? name=Sample Java Plugin, help=This Java file is a JEB plugin

import jeb.api.IScript;
import jeb.api.JebInstance;

public class SamplePluginJava implements IScript {

    public void run(JebInstance jeb) {
        jeb.print("This line is generated by a Java plugin");
    }
}
