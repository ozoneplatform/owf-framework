Ext.define('Ozone.components.window.StoreWizard', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.storewizard',

    modal: true,
    preventHeader: true,
    modalAutoClose: true,
    shadow: false,
    layout: 'auto',
    ui: 'system-window',
    store: null,
    closable: true,
    title: '',
    cls: 'system-window',
    store: null,
    typeStore:  null,

    resizable: false,
    draggable: false,

    width: 780,
    height: 570,
    
    listeners: {
    	'close': {
    		fn: function(){
    			this.destroy()
    		}
    	},
    	'afterRender': {
    		fn: function() {
                this.bindHandlers();
    		}
    	}
    },
    
     initComponent: function() {
     	this.loadMask = Ext.create('Ozone.components.mask.LoadMask', Ext.getBody(), {
            zIndexManager: Ext.WindowManager
        });
        
        this.store = Ext.create('Ozone.data.stores.AdminWidgetStore', {});
        this.typeStore = Ext.create('Ozone.data.WidgetTypeStore');
        
        this.typeStore.load();
     
		this.html = this.getContent();

        this.callParent(arguments);
    },
    
    getContent: function() {
    	var htmlData = "<h1 id='wizardTitle'>Connecting to a Store</h1>" +
    					"<div id='wizardButtons'>"+
    						"<ul id='wizardProcessList'>"+
    							"<li class='step1 active'><div><span class='stepNumber'>1</span> Entering Store URL</div></li>"+
    							"<li class='step2'><div><span class='stepNumber'>2</span> Review or Edit</div></li>"+
    						"</ul>"+
    						"<div id='progressBar' >"+
    							"<div id='progressBarProgress' style='display:none;'>"+
    							"</div>"+
    						"</div>"+
    					"</div>"+
    					"<div id='wizardContentBox'>"+
    						"<div id='enterURLStep'>"+
    							"<div class='contentTitle'>Entering Store URL</div>"+
    							"<div class='contentText'>Enter the location of the store. For example, https://store.gov</div>"+
    							"<div class='contentText userInput'>Store URL <input id='storeURL'></input></div>"+
    							"<div class='controlButtons'>"+
    								"<div class='next button'>Next</div>"+
    								"<div class='cancel button'>Cancel</div>"+
    							"</div>"+
    						"</div>"+
    						"<div id='editStep' style='display:none;'>"+
    							"<div class='contentTitle'>Review or Edit</div>"+
    							"<div class='contentText'>User will see this Store icon and name. If it is correct,click OK. Or update it, then click OK.</div>"+
    							"<div class='contentText userInput iconText'>Icon <input id='iconURL'></input></div>"+
    							"<div class='contentText userInput'>Store Name <input id='storeName'></input></div>"+
    							"<div class='controlButtons'>"+
    								"<div class='back button'>Back</div>"+
    								"<div class='save button'>Save</div>"+
    								"<div class='cancel button'>Cancel</div>"+
    							"</div>"+
    						"</div>"+
    					"</div>"
    					
    	
    	return htmlData;
    },
    
    rollProgressForward: function(){
    	var progress = $('#progressBarProgress');
    	progress.animate({width: 'toggle'});
    },
    
    rollProgressBack: function(){
    	var progress = $('#progressBarProgress');
    	progress.animate({width: 'toggle'});
    },
    
    descriptorSuccess: function() {
    	$('#enterURLStep').hide();
    		
    	$('#iconURL').val(this.data.imageUrlSmall);
    	$('#storeName').val(this.data.displayName);
    	
    	//add the loaded icon as an img
    	if($('.loadedImg').size() == 0)
    		$('#').add( "<img src='"+ this.data.imageUrlSmall +"' class='loadedImg'/>" ).appendTo( $('.iconText') )
    	$('#iconURL').change(function(){ 
    					var date = new Date();
						$('.loadedImg').attr('src',$('#iconURL').val()+"?" +date.getTime()).slideToggle().slideToggle();
					});
    		
	    $('.step1').removeClass('active');
	    $('.step1').addClass('complete');
	    $('#editStep').slideToggle();
	    $('.step2').addClass('active');
	   	this.rollProgressForward();
    },
    
    nextButtonHandler: function(){
    	var me = this,
    		storeURL = Ext.String.trim($('#storeURL').val()),
    		storeDescriptor = Ext.String.trim(storeURL + '/public/storeDescriptor');
 
    	
    	if(storeURL == null || storeURL == '' || !storeURL.replace(/\s/g, '').length) {
    		alert('Please enter a URL');
    	} else {
    		me.loadMask.show();
			Ozone.util.Transport.send({
			            url: storeDescriptor,
			            method: "GET",
			            forceXdomain: true,
			            onSuccess: function(data){
			            				me.loadMask.hide();
			            				me.data = data;
			            				
							            // Set needed vals not in descriptor
							            me.data.title = Ext.String.trim(data.displayName);
							            me.data.url = storeURL;
							            me.data.descriptorUrl = storeDescriptor;
							            me.data.guid =  guid.util.guid();
							            me.data.widgetGuid = me.data.guid;
							            me.data.widgetVersion= '1.0';
			            				
			            				me.descriptorSuccess()},
			            onFailure: function () {
			         		me.loadMask.hide();
			                alert("There was an error with the Store URL")
			            },
			            autoSendVersion: false
        			});
    	}
    },
    
    backButtonHandler: function() {
    	var me = this;
    	$('#editStep').hide();
    	
    	$('.step2').removeClass('active');
    	$('#enterURLStep').slideToggle();
    	$('.step1').addClass('active');
    	me.rollProgressBack();
    },
    
    saveButtonHandler: function() {
    	 var me = this;
    	 if (me.data) {
    	 
    	 	me.data.imageUrlSmall = $('#iconURL').val();
   			me.data.imageUrlLarge = $('#iconURL').val();
    		me.data.displayName = $('#storeName').val();
    		me.data.name = me.data.displayName;
    		me.data.title = me.data.displayName;
    		me.data.image = me.data.imageUrlLarge ; 
    		me.data.headerIcon = me.data.imageUrlSmall ; 
    		
    		if(me.data.imageUrlSmall == null || me.data.imageUrlSmall == '' || !me.data.imageUrlSmall.replace(/\s/g, '').length) {
	    		alert('Please fix the icon URL');
	    	} else if(me.data.displayName == null || me.data.displayName == '' || !me.data.displayName.replace(/\s/g, '').length){
            	alert('Please fix the display name');
	   		} else {
	   			// Set record
	            me.record = new Ozone.data.WidgetDefinition(me.data);
	            me.record.phantom = true;
	            
	            var typeId = this.typeStore.findRecord('name', 'marketplace').internalId;
	            
	           	var types = [{
				                id: typeId,
				                name: "marketplace"
				            }];
	            
	            me.record.beginEdit();
	            me.record.set('tags', []);
	            me.record.set('widgetTypes', types);
	            me.record.endEdit();
	            
	            me.store.add(me.record);
	            me.store.save();
	                        
	    	 	me.close();
	   		}
        } else {
        	alert("Error: There was an issue with data");
        }	
    },
    
    bindHandlers: function() {
    	var me = this;
    	
    	$('.cancel').on('click', function(){me.close()});
    	$('.next').on('click', $.proxy(me.nextButtonHandler, me));
    	$('.back').on('click', $.proxy(me.backButtonHandler, me));
    	$('.save').on('click', $.proxy(me.saveButtonHandler, me));
    }
    
})