(function(){
	var appsettings = {
	    angularVersion: '1.4.0-beta.4',
	    jqVersion: '2.1.1',
	    baseUrl: ''
	};
	require = require('amdrequire');
	require.config({
	    //Use node's special variable __dirname to
	    //get the directory containing this file.
	    //Useful if building a library that will
	    //be used in node but does not require the
	    //use of node outside
	    baseUrl: __dirname + '/../',
	    basePath:  __dirname + '/../',

			// paths: {
			// 	'jQuery': 'https://code.jquery.com/jquery-' + appsettings.jqVersion + '.min'//, 'lib/jquery-' + appsettings.jqVersion + '.min']
			// },

	    //Pass the top-level main.js/index.js require
	    //function to requirejs so that node modules
	    //are loaded relative to the top-level JS file.
	    nodeRequire: require
	});
	// require = requirejs;
	// if (typeof define !== 'function') {
	//     var define = require('amdefine')(module);
	// }
	function fail() {
		expect(false).toBe(true);
	}

	console.log('Requiring dependencies...');
	//var Class = require('app/core/class');
	// require(['app/core/class', 'app/core/dom/textElement'], function(Class, TextElement) {
	require([], function() {
		console.log('Dependencies loaded!');
		describe('Element is string', function() {
			var obj = 'let it go';
			it ('testing type', function(){
				expect(typeof obj).toBe('string');
	    });
		});
	});
})();
