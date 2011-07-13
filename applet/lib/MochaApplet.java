import java.applet.*;
import java.io.*;
import java.net.*;
import java.awt.*;
import java.awt.image.*;
import org.mozilla.javascript.*;
import org.mozilla.javascript.tools.shell.*;

public class MochaApplet extends Applet {
	boolean error = false;
	String game, mocha, errorMessage;

	public void init() {
		this.game = this.getParameter("game");
		this.mocha = this.getParameter("mocha");
		if (this.game == null || this.mocha == null) {
			error = true;
			errorMessage = "Missing parameter \"game\"";
			return;
		}

		try {
			this.mocha = loadScript(this.mocha);
			this.game = loadScript(this.game);
		} catch (IOException e) {
			error = true;
			errorMessage = "Error: " + e.getMessage();
			return;
		}

		Context cx = ContextFactory.getGlobal().enterContext();
		cx.setOptimizationLevel(-1);
		Scriptable scope = new Global(cx);
		scope.put("MochaApplet", scope, this);
		cx.evaluateString(scope, this.mocha, this.getParameter("mocha"), 0, null);
		cx.evaluateString(scope, this.game, this.getParameter("game"), 0, null);
	}

	protected String loadScript(String src) throws IOException {
		StringBuilder buffer = new StringBuilder();
		InputStream resource = this.getClass().getResourceAsStream(src);
		if (resource == null) {
			throw new IOException("Could not find " + src);
		}

		BufferedReader b = new BufferedReader(new InputStreamReader(resource));
		String line = "";
		while ((line = b.readLine()) != null) {
			buffer.append(line);
		}

		return buffer.toString();
	}
}
