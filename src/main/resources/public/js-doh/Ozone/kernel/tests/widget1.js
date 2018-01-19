        console.log("XXXXXXXXXXXXXXXxWidget seems to have loaded");
function hello() {
    return "Hello world";
}

function init() {
        console.log("XXXXXXXXXXXXXXXxInitializing");
    Ozone.eventing.clientInitialize({
		name: 'hello',
		fn: hello
	});
}
