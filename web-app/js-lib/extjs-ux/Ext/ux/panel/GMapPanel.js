declare( 'Ext::ux::panel::GMapPanel', function (use,checkState,__PACKAGE__) {
    
    use('Ext::ux::api::gMap',function(use){
        Ext.ux.panel.GMapPanel = Ext.extend(Ext.Panel, {
            
            gMap : undefined,
            gMapEl : undefined,
            
            gMapOptions : undefined,
            gMapCustomize : undefined,
            gMapCustomizeScope : undefined,
            
            setCenter : undefined,
            
            constructor: function(config) {        
                
                Ext.apply(config, {
                    
                }); //eof apply
                
                this.addEvents('mapready');
				
				Ext.ux.panel.GMapPanel.superclass.constructor.call(this, config);
            }, //eof constructor
            
            
            initComponent: function() {
                
				
				Ext.ux.panel.GMapPanel.superclass.initComponent.call(this);
            },
            
            
            afterRender : function(){
                Ext.ux.panel.GMapPanel.superclass.afterRender.apply(this, arguments);
                
                this.gMapEl = Ext.DomHelper.append(this.body,'<div style="width: 100%; height: 100%"></div>',true);
                this.gMap = new GM.Map2(this.gMapEl.dom, this.gMapOptions);
                
                if (this.setCenter) {
                    this.gMap.setCenter(new GM.LatLng(this.setCenter.lat || 0, this.setCenter.lng || 0), this.setCenter.zoom || 10);
                }
                if (this.gMapCustomize) this.gMapCustomize.call(this.gMapCustomizeScope || window, this.gMap);
				this.fireEvent('mapready');                
            },
            
            
            onResize : function (w,h) {
                Ext.ux.panel.GMapPanel.superclass.onResize.call(this, w, h);
                
                if (!w || !h || !this.gMap) return;        
                
                var center = this.gMap.getCenter();        
                this.gMap.checkResize();                
                this.gMap.setCenter(center);
            },
            
            
            setSize : function(w, h, animate) {                
                Ext.ux.panel.GMapPanel.superclass.setSize.call(this, w, h, animate);
                
                if (!w || !h || !this.gMap) return;
        
                var center = this.gMap.getCenter();        
                this.gMap.checkResize();                
                this.gMap.setCenter(center);                
            }
            
        }); //eof extend
        
        Ext.reg('gmappanel', Ext.ux.panel.GMapPanel);
    }); //eof use    
    
}); //eof declare


