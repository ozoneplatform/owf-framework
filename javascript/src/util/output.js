var output = output || {};

output.console = function() {
	return {
		log : function (string) {
		  	//check browser
			var browser=navigator.appName;
			if(browser=="Microsoft Internet Explorer") {
				//alert(string);
			}else{
				console.log(string);
			}
		}
	};
}();