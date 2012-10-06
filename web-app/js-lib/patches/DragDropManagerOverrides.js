Ext.apply(Ext.dd.DragDropManager, {
	fireEvents: function(e, isDrop) {
        var dc = this.dragCurrent;
        
        if (!dc || dc.isLocked()) {
            return;
        }

        var pt = e.getPoint();

        
        var oldOvers = [];

        var outEvts   = [];
        var overEvts  = [];
        var dropEvts  = [];
        var enterEvts = [];

        
        
        for (var i in this.dragOvers) {

            var ddo = this.dragOvers[i];

            if (! this.isTypeOfDD(ddo)) {
                continue;
            }

            if (! this.isOverTarget(pt, ddo, this.mode)) {
                outEvts.push( ddo );
            }

            oldOvers[i] = true;
            delete this.dragOvers[i];
        }

        for (var sGroup in dc.groups) {

            if ("string" != typeof sGroup) {
                continue;
            }

            for (i in this.ids[sGroup]) {
                var oDD = this.ids[sGroup][i];

                // PATCH BEGIN
                // only manage events for components that are visible
                if(!oDD.el.isVisible(true))
                    continue;
                //PATCH
                
                if (! this.isTypeOfDD(oDD)) {
                    continue;
                }

                if (oDD.isTarget && !oDD.isLocked() && ((oDD != dc) || (dc.ignoreSelf === false))) {
                    if (this.isOverTarget(pt, oDD, this.mode)) {
                        
                        if (isDrop) {
                            dropEvts.push( oDD );
                        
                        } else {
                            
                            if (!oldOvers[oDD.id]) {
                                enterEvts.push( oDD );
                            
                            } else {
                                overEvts.push( oDD );
                            }

                            this.dragOvers[oDD.id] = oDD;
                        }
                    }
                }
            }
        }

        if (this.mode) {
            if (outEvts.length) {
                dc.b4DragOut(e, outEvts);
                dc.onDragOut(e, outEvts);
            }

            if (enterEvts.length) {
                dc.onDragEnter(e, enterEvts);
            }

            if (overEvts.length) {
                dc.b4DragOver(e, overEvts);
                dc.onDragOver(e, overEvts);
            }

            if (dropEvts.length) {
                dc.b4DragDrop(e, dropEvts);
                dc.onDragDrop(e, dropEvts);
            }

        } else {
            
            var len = 0;
            for (i=0, len=outEvts.length; i<len; ++i) {
                dc.b4DragOut(e, outEvts[i].id);
                dc.onDragOut(e, outEvts[i].id);
            }

            
            for (i=0,len=enterEvts.length; i<len; ++i) {
                
                dc.onDragEnter(e, enterEvts[i].id);
            }

            
            for (i=0,len=overEvts.length; i<len; ++i) {
                dc.b4DragOver(e, overEvts[i].id);
                dc.onDragOver(e, overEvts[i].id);
            }

            
            for (i=0, len=dropEvts.length; i<len; ++i) {
                dc.b4DragDrop(e, dropEvts[i].id);
                dc.onDragDrop(e, dropEvts[i].id);
            }

        }

        
        if (isDrop && !dropEvts.length) {
            dc.onInvalidDrop(e);
        }

    }
});