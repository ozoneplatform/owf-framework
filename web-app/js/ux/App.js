//todo no one uses this file -- DELETE IT

Ext.namespace("Ozone.app");

Ozone.app.App = function(scope, cfg){
    Ext.apply(this, cfg);
    this.scope = scope;
    this.addEvents({
        'ready' : true,
        'beforeunload' : true,
        'sessionexpire': true
    });

    Ext.onReady(this.initApp, this);
};

Ext.extend(Ozone.app.App, Ext.util.Observable, {
    isReady: false,
    startMenu: null,
    modules: null,

    getStartConfig : Ext.emptyFn,

    initApp : function(){
    	this.startConfig = this.startConfig || this.getStartConfig();

        this.desktop = new Ozone.layout.Desktop(this, this.scope);

		this.launcher = this.desktop.taskbar.startMenu;

		this.modules = this.getModules();
        if(this.modules){
            this.initModules(this.modules);
        }

        this.init();

        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
        this.isReady = true;
    },

    getModules : Ext.emptyFn,
    init : Ext.emptyFn,

    initModules : function(ms){
		for(var i = 0, len = ms.length; i < len; i++){
            var m = ms[i];
            this.launcher.add(m.launcher);
            m.app = this;
        }
    },

    getModule : function(name){
    	var ms = this.getModules();
    	for(var i = 0, len = ms.length; i < len; i++){
    		if(ms[i].launcher.windowId == name){
    			ms[i].app = this;
    			return ms[i];
			}
        }
        return '';
    },

    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    getDesktop : function(){
        return this.desktop;
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    }
});