function add(a,b) {
    return a+b;
}

function init() {
    Ozone.eventing.clientInitialize([{
		name: 'add',
		fn: add
	}]);
}

Ozone.eventing.handleDirectMessage = function(payload) {
}