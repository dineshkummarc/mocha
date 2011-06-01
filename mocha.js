(function () {
	var isBrowser = typeof window !== 'undefined' && this === window;
	this.print = print;

	if (isBrowser) {
		this.print = function () {
			console.log.apply(console, arguments);
		};
	}

	this.print(isBrowser);
}());
