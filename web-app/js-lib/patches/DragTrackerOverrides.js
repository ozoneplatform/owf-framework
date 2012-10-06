var Ozone = Ozone || {};
Ozone.createDragTrackerOverrides = function() {
    return {
        _useShim: true,
        _shimActive: false,
        _debugShim: false,
        _shim: null,
        _createShim: function() {
            var s = document.createElement('div');
            s.id = 'ext-ddm-shim';
            if (document.body.firstChild) {
                document.body.insertBefore(s, document.body.firstChild);
            } else {
                document.body.appendChild(s);
            }
            s.style.display = 'none';
            s.style.backgroundColor = 'red';
            s.style.position = 'absolute';
            s.style.zIndex = '9999999';
            Ext.create('Ext.core.Element', s.id).setOpacity(0);
            return s;
        },
        _sizeShim: function() {
            if (this._shimActive) {
                var s = this._shim;
                s.style.height = Ext.core.Element.getDocumentHeight() + 'px';
                s.style.width = Ext.core.Element.getDocumentWidth() + 'px';
                s.style.top = '0';
                s.style.left = '0';
            }
        },
        _activateShim: function() {
            if (this._useShim && !this._shimActive) {
                var el = Ext.get('ext-ddm-shim');
                
                this._shim = el ? el.dom : this._shim;
                
                if (!this._shim)
                    this._shim = this._createShim();
        
                this._shimActive = true;
                var s = this._shim,
                    o = 0;
                if (this._debugShim) {
                    o = .5;
                }
                Ext.create('Ext.core.Element', s.id).setOpacity(o);     
                this._sizeShim();
                s.style.display = 'block';
            }
        },
        _deactivateShim: function() {   
            this._shim.style.display = 'none';
            this._shimActive = false;
        },
        endDrag: function(e) {
            if (this._shimActive) {
                this._deactivateShim();
                if (this._handleTarget) this._handleTarget(e);
            }
            this.callOverridden(arguments);
        }
    };
};

//Ext.override(Ext.resizer.SplitterTracker, Ext.apply(Ozone.createDragTrackerOverrides(), {
//    _handleTarget: function(e){
//        if (!this._target) {
//            this._target = e.target;
//        }
//        else 
//            if (this._target.id != e.target.id && !this.active) {
//                Ozone.util.fireBrowserEvent(this._target, 'click');
//                delete this._target;
//            }
//            else {
//                delete this._target;
//            }
//    },
//    onBeforeStart: function(e){
//        this.callOverridden(arguments);
//        this._activateShim();
//      this._handleTarget(e);
//    }
//}));
Ext.override(Ext.resizer.ResizeTracker, Ext.apply(Ozone.createDragTrackerOverrides(), {

    onBeforeStart: function(e) {
        this.callOverridden(arguments);
        this._activateShim();
    }

}));

Ext.override(Ext.util.ComponentDragger, Ext.apply(Ozone.createDragTrackerOverrides(), {

    onStart: function(e) {
        this.callOverridden(arguments);
        Ext.getCmp('mainPanel').activeDashboard.shimPanes();
    },

    onEnd: function(e) {
        this.callOverridden(arguments);
        Ext.getCmp('mainPanel').activeDashboard.unshimPanes();
    }

}));

Ext.override(Ext.dd.DragTracker, Ext.apply(Ozone.createDragTrackerOverrides(), {

    onStart: function(e) {
        this.callOverridden(arguments);
        this._activateShim();
    }

}));