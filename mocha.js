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
		importPackage(java.io);
		importPackage(javax.swing);
		importPackage(javax.imageio);
	}

	Mocha = global.Mocha = function (game) {
		this.game = game;
		this.canvas = new Mocha.Canvas(this, game.width, game.height);
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
			this.frame.setDefaultCloseOperation(this.frame.EXIT_ON_CLOSE);
			this.frame.show();
		};
	}());

	Mocha.Canvas.prototype.getBrush = (function () {
		return isBrowser && function () {
			return this.brush;
		} || function () {
			return this.brush = (this.brush !== null && this.brush || this.canvas.getGraphics());
		};
	}());

	Mocha.Canvas.prototype.setColor = (function () {
		return isBrowser && function (rgb) {
			this.brush.fillStyle = this.brush.strokeStyle = rgb;
		} || function (rgb) {
			if (this.brush || this.getBrush()) {
				this.brush.setColor(new Color(parseInt(rgb.slice(1), 16)));
			}
		};
	}());

	Mocha.Canvas.prototype.fillRect = (function () {
		return isBrowser && function (x, y, w, h) {
			this.brush.fillRect(x, y, w, h);
		} || function (x, y, w, h) {
			if (this.brush || this.getBrush()) {
				this.brush.fillRect(x, y, w, h);
			}
		};
	}());


	Mocha.Canvas.prototype.drawImage = (function () {
		return isBrowser && function (image, x, y) {
			this.brush.drawImage(image, x, y);
		} || function (image, x, y) {
			if (this.brush || this.getBrush()) {
				this.brush.drawImage(image, x, y, null);
			}
		};
	}());

	Mocha.prototype.start = function () {
		this.game.init(this);
		this.game.start(this);

		this.loop();
	};

	Mocha.prototype.loop = (function () {
		return isBrowser && function () {
			var loop, lastUpdate, now, delta, update;
			loop = window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(function () {
						callback(Date.now());
					}, 20);
				};
			
			lastUpdate = Date.now();
			update = function (time) {
				now = Date.now();
				delta = now - lastUpdate;
				game.update(delta);
				game.render(this.canvas);
				lastUpdate = now + 0;

				loop(update);
			}.bind(this);
			update(Date.now());

		} || function () {
			spawn(function () {
				var now, delta, lastUpdate = Date.now();
				while (true) {
					now = Date.now();
					delta = now - lastUpdate;
					game.update(delta);
					game.render(this.canvas);
					lastUpdate = now + 0;
					java.lang.Thread.sleep(10);
				}
			}.bind(this));
		}
	}());

	Mocha.prototype.loadImage = (function () {
		return isBrowser && function (src, callback) {
			var image = new Image();
			image.onload = function () {
				callback(image);
			};
			image.src = src;
		} || function (src, callback) {
			callback(ImageIO.read(new FileInputStream('./' + src)));
		}
	}());
}());
