Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    
    cls: 'ozonequicktip itemTip',
	shadow: false,
	closable:true,
	autoHide:false,
	draggable:true,
    listeners: {
    	'close': {
    		fn: function(){
    			this.destroy()
    		}
    	},
    	'afterRender': {
    		fn: function() {
    			this.bindHandlers()
    		}
    	}

    },
	
	getToolTip: function () {
		var me = this;
    	var icn = me.clickedStackOrDashboard.iconImageUrl && me.clickedStackOrDashboard.iconImageUrl !=' ' ? '<img height=\'64\' width=\'64\' style=\'padding-right:15px;\' src=\''+me.clickedStackOrDashboard.iconImageUrl+'\' />':'';
        var str = '<div class=\'dashboard-tooltip-content\'>' + 
                '<h3 class=\'name\'>' + icn + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.name)) + '</h3>';

        me.clickedStackOrDashboard.description && (str += '<p class=\'tip-description\'>' + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.description)) +'</p><br>');
        
        // append buttons
        str += '<ul>' +
	                '<li class=\'addButton actionButton\'>'+
		                '<span class=\'createImg\'></span>'+
		                '<p class=\'actionText\'>Add Page</p>'+
	                '</li>'+
	                '<li class=\'pushButton actionButton\'>'+
		                '<span class=\'pushImg\'></span>'+
		                '<p class=\'actionText\'>Push to Store</p>'+
	                '</li>'+
	                '<li class=\'restoreButton actionButton\'>'+
		                '<span class=\'restoreImg\'></span>'+
		                '<p class=\'actionText\'>Restore</p>'+
	                '</li>'+
	                '<li class=\'editButton actionButton\'>'+
		                '<span class=\'editImg\'></span>'+
		                '<p class=\'actionText\'>Edit</p>'+
	                '</li>'+
	                '<li class=\'deleteButton actionButton\'>'+
		                '<span class=\'deleteImg\'></span>'+
		                '<p class=\'actionText\'>Delete</p>'+
	                '</li>'+
        	   '</ul>' +
        	  '</div>';
         
        return str
    },
    
	initComponent: function() {
		var me = this;
		
		me.target = me.event.target.parentElement.id;
	    me.html = me.getToolTip();
	    


	    me.callParent(arguments);
	},

	bindHandlers: function() {
		var me = this;



		if(me.clickedStackOrDashboard.isStack) {

			$('.addButton').on('click', me.handleStackAdd);
			$('.restoreButton').on('click', me.handleStackRestore);
			$('.editButton').on('click', me.handleStackEdit);
			$('.deleteButton').on('click', function(evt) {
				me.handleStackDelete(evt, me);
			});
		}
	},

	handleStackAdd: function(evnt) {

	},

	handleStackRestore: function(evnt) {

	},

	handleStackEdit: function(evnt) {

	},

	handleStackDelete: function (evt, parent) {
		evt.stopPropagation();

		var me = parent;

		var msg = 'This action will permanently delete stack <span class="heading-bold">' + 
        		Ext.htmlEncode(me.clickedStackOrDashboard.name) + '</span> and its dashboards.';

        var stackGroups = me.clickedStackOrDashboard.groups
        var userGroups = Ozone.config.user.groups
        var groupAssignment = false;
        
        if(stackGroups && userGroups && stackGroups.length > 0 && userGroups.length > 0) {
            for (var i = 0, len1 = stackGroups.length; i < len1; i++) {
                var stackGroup = stackGroups[i];
                
                for (var j = 0, len2 = userGroups.length; j < len2; j++) {
                    var userGroup = userGroups[j];
                    if(stackGroup.id === userGroup.id) {
                        groupAssignment = true;
                        break;
                    }
                }

                if(groupAssignment === true)
                    break;
            }
        }

        if(groupAssignment) {
            me.update('');
            me.removeAll();

            me.add({
            	xtype: 'panel',
            	html: 'Users in a group cannot remove stacks assigned to the group. Please contact your administrator.',
            	bbar: ['->', {
            		text: 'OK',
            		handler: function() {
            			me.close();
            			me.destroy();
            		}
            	}]
            });

            me.doLayout();

            return;
        }


        me.update('');
        me.removeAll();

        me.add({
        	xtype: 'panel',
        	html: msg,
        	bbar: ['->', {
        		text: 'OK',
        		handler: function() {
        			console.log(me.dashboardContainer.stackStore);
        			me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(me.clickedStackOrDashboard.id) );
		            me.dashboardContainer.stackStore.save();
		            console.log(me.dashboardContainer.stackStore);

		            if( me._lastExpandedStack === me.clickedStackOrDashboard) {
		                me.hideStackDashboards();
		            }

		            var $prev = me.target;
		            me.target.remove();
		            $prev.focus();
		            
		            me._deletedStackOrDashboards.push(me.clickedStackOrDashboard);
		            me.reloadDashboards = true;
		        }
        	},{
        		text: 'Cancel',
        		handler: function() {
        			me.close();
            		me.destroy();
        		}
        	}]
        });
        /*this.warn(msg, function () {
            me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(stack.id) );
            me.dashboardContainer.stackStore.save();

            if( me._lastExpandedStack === stack) {
                me.hideStackDashboards();
            }

            var $prev = $stack.prev();
            $stack.remove();
            $prev.focus();
            
            me._deletedStackOrDashboards.push(stack);
            me.reloadDashboards = true;

        }, focusEl);*/
    },






    
});