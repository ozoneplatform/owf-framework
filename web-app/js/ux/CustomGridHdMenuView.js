var Ozone = Ozone || {};
Ozone.grid = Ozone.grid || {};

Ozone.grid.CustomGridHdMenuView = function(config){
	Ext.apply(this, config);
	Ozone.grid.CustomGridHdMenuView.superclass.constructor.call(this);
};

Ext.extend(Ozone.grid.CustomGridHdMenuView, Ext.grid.GridView, {
	
	handleHdMenuClick : function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm, ds = this.ds;
        switch(item.id){
            default:
                index = cm.getIndexById(item.id.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }
        }
        return true;
    },

	beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
                this.colMenu.add(new Ext.menu.CheckItem({
                    id: "col-"+cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick:false,
                    disabled: cm.config[i].hideable === false
                }));
            }
        }
    },


	handleHdDown : function(e, t){
    		e.stopEvent();
    		var hd = this.findHeaderCell(t);
	        Ext.fly(hd).addClass('x-grid3-hd-menu-open');
	        var index = this.getCellIndex(hd);
	        this.hdCtxIndex = index;
	        var ms = this.colMenu.items, cm = this.cm;
	        this.colMenu.on("hide", function(){
	            Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
	        }, this, {single:true});
	        this.colMenu.showAt(e.xy);
	    },
	
	
	renderUI : function(){
	    var header = this.renderHeaders();
	    var body = this.templates.body.apply({rows:''});
	
	
	    var html = this.templates.master.apply({
	        body: body,
	        header: header
	    });
	
	    var g = this.grid;
	
	    g.getGridEl().dom.innerHTML = html;
	
	    this.initElements();
	
	    this.mainHd.on("contextmenu", this.handleHdDown, this);
	    this.mainHd.on("mouseover", this.handleHdOver, this);
	    this.mainHd.on("mouseout", this.handleHdOut, this);
	    this.mainHd.on("mousemove", this.handleHdMove, this);
	
	    this.scroller.on('scroll', this.syncScroll,  this);
	    if(g.enableColumnResize !== false){
	        this.splitone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
	    }
	
	    if(g.enableColumnMove){
	        this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
	        this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
	    }
	
	   
        if(g.enableColumnHide !== false){
            this.colMenu = new Ext.menu.Menu({id:g.id + "-hcols-menu"});
            this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
            this.colMenu.on("itemclick", this.handleHdMenuClick, this);
        }
        
        this.hmenu = new Ext.menu.Menu({id: g.id + "-hctx"});
        
        if(g.enableColumnHide !== false){
            this.hmenu.add(
                {id:"columns", text: this.columnsText, menu: this.colMenu, iconCls: 'x-cols-icon'}
            );
        }
        this.hmenu.on("itemclick", this.handleHdMenuClick, this);
	
	    if(g.enableDragDrop || g.enableDrag){
	        this.dragZone = new Ext.grid.GridDragZone(g, {
	            ddGroup : g.ddGroup || 'GridDD'
	        });
	    }
	
	    this.updateHeaderSortState();
	
	}
});