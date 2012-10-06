Ext.namespace('Ozone.data');

Ozone.data.PreferenceStore = Ext.extend(Ozone.data.OWFStore, {
	constructor: function(config){
		config = config? config : {};

		Ext.applyIf(config,{
			api: {
				read: "/prefs/preference",
				create: "/prefs/preference",
				update: "/prefs/preference",
				destroy: "/prefs/preference",
			},
			root:'rows',
			totalProperty: 'results',
			fields:[
			        'id',
			        'namespace',
			        'path',
			        'value',
			        'user'
			],
			autoDestroy:true,
			sortInfo:{
				field:'namespace',
				direction:'ASC'
			}
		});
		Ozone.data.PreferenceStore.superclass.constructor.call(this, config);
		
	}
});
Ext.reg('preferencestore',Ozone.data.PreferenceStore);