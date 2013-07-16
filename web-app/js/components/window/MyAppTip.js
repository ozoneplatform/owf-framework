Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    
    cls: 'ozonequicktip itemTip',
	shadow: false,
	closable:true,
	autoHide:false,
	draggable:true,
    listeners: {
    	'close':function(){
    		this.destroy()
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
	}
    
});