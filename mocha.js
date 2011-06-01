/* == Mocha ==
* Simple game engine that runs in a browser or Rhino
* @author Matt Campbell <woogley@gmail.com>
*/

(function () {
	var isBrowser, global, Mocha, document;
	isBrowser = typeof window !== 'undefined' && this === window;
	global = this;
	document = global.document;

	if (!isBrowser) {
		importPackage(java.awt);
		importPackage(java.awt.image);
		importPackage(javax.swing);
	}

	Mocha = global.Mocha = function (game, width, height) {
		this.game = game;
		this.canvas = new Mocha.Canvas(this, width, height);
	};

	Mocha.Canvas = (function () {
		return isBrowser && function (context, width, height) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = width;
			this.canvas.height = height;
			this.brush = this.canvas.getContext('2d');
			document.body.appendChild(this.canvas);
		} || function (context, width, height) {
			this.frame = new JFrame();
			this.frame.setResizable(false);
			this.frame.setTitle(context.game.title || 'Game');
			this.canvas = new JPanel();
			this.canvas.setPreferredSize(new Dimension(width, height)); 
			this.frame.add(this.canvas);
			this.frame.pack();
			this.frame.setLocationRelativeTo(null);
			this.frame.show();
		};
	}());
}());
