
/* Window Edge Snapping for Extjs 
 * Version: 1.6
 *
 * Copyright 2008 (c) David W Davis
 * xantus@xantus.org
 * http://xant.us/
 # http://extjs.com/forum/showthread.php?t=55213
 *
 * License: Same as Extjs 2.0
 *
 * Please do not remove this header
 */

Ext.namespace( 'Ext.ux.WindowSnap' );

// either create your own subclass and extend, or override Ext.Window directly
Ext.override( Ext.Window, {
    initDraggable: function() {
        this.dd = new Ext.ux.WindowSnap.DD(this);
    }
});

// eventually these options should be taken from the window object
// but since Ext.Window does not pass a config obj to Ext.Window.DD
// we'll just set them here
Ext.ux.WindowSnap = {
    version: '1.6',
    snapRange: 20, // px
    dragSnap: false,
    dropSnap: true,
    animateDropSnap: true
};

Ext.ux.WindowSnap.DD = function() {
    Ext.ux.WindowSnap.DD.superclass.constructor.apply(this,arguments);
};


Ext.extend( Ext.ux.WindowSnap.DD, Ext.Window.DD, {

    startDrag: function() {
        Ext.ux.WindowSnap.DD.superclass.startDrag.apply(this,arguments);
        if ( Ext.ux.WindowSnap.dragSnap )
            this._getSnapData();
    },

    endDrag: function() {
        Ext.ux.WindowSnap.DD.superclass.endDrag.apply(this,arguments);
        if ( Ext.ux.WindowSnap.dropSnap ) {
            this._getSnapData();
            var pos = this.win.getPosition();
            this.setSnapXY( this.win.el, pos[0], pos[1], true );
        }
        this.snapDD = [];
    },

    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);
        var fly = el.dom ? el : Ext.fly(el, '_dd');
        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            fly.setXY(aCoord);
            var newLeft = fly.getLeft(true);
            var newTop  = fly.getTop(true);
            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            if ( Ext.ux.WindowSnap.dragSnap )
                this.setSnapXY( fly, oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1] );
            else
                fly.setLeftTop( oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1] );
        }

        this.cachePosition(oCoord.x, oCoord.y);
        this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        return oCoord;
    },

    setSnapXY: function( fly, x, y, drop ) {
        var box = this.win.getBox();
        var range = Ext.ux.WindowSnap.snapRange;
        var viewTop = 0;
        var viewLeft = 0;
        // these offsets should come from somewhere...frameWidth / 2 maybe?
        var viewBottom = ( Ext.lib.Dom.getViewHeight() - 4 );
        var viewRight = ( Ext.lib.Dom.getViewWidth() - 4 );
        var lx = [];
        var ly = [];
        // check the edges of the viewport
        // right and left
        if ( Math.abs( x - viewLeft ) < range )
            lx.push( viewLeft );
        else if ( Math.abs( ( x + box.width ) - viewRight ) < range )
            lx.push( viewRight - box.width );
        // top and bottom
        if ( Math.abs( y - viewTop ) < range )
            ly.push( viewTop );
        else if ( Math.abs( ( y + box.height ) - viewBottom ) < range )
            ly.push( viewBottom - box.height );
        
        // now check all visible windows
        for ( var i = 0, len = this.snapDD.length; i < len; i++ ) {

            var nx = undefined;
            if ( Math.abs( x - ( this.snapDD[ i ].x + this.snapDD[ i ].width ) ) < range ) {
                // check the left edge of the current window Y against the right edge of window X
                nx = this.snapDD[ i ].x + this.snapDD[ i ].width;
            } else if ( Math.abs( ( x + box.width ) - this.snapDD[ i ].x ) < range ) {
                // check the right edge of the current window Y against the left edge of window x
                nx = this.snapDD[ i ].x - box.width;
            }
            // verify if the window is touching
            if ( nx !== undefined 
                && ( y >= this.snapDD[ i ].y && y <= ( this.snapDD[ i ].y + this.snapDD[ i ].height ) 
                || ( y + box.height >= this.snapDD[ i ].y
                && y + box.height <= ( this.snapDD[ i ].y + this.snapDD[ i ].height ) ) ) ) {
                // if this move would force the window off the left side of the screen, the avoid it
                if ( nx < 0 )
                    continue;
                lx.push( nx );
                continue;
            }
            
            var ny = undefined;
            if ( Math.abs( y - ( this.snapDD[ i ].y + this.snapDD[ i ].height ) ) < range ) {
                // check the top edge of the current window Y against the bottom edge of window X
                ny = this.snapDD[ i ].y + this.snapDD[ i ].height;
            } else if ( Math.abs( ( y + box.height ) - this.snapDD[ i ].y ) < range ) {
                // check the bottom edge of window Y with the top of window X
                ny = this.snapDD[ i ].y - box.height;
            }
            if ( ny !== undefined
                && ( x >= this.snapDD[ i ].x && x <= ( this.snapDD[ i ].x + this.snapDD[ i ].width ) 
                || ( x + box.width >= this.snapDD[ i ].x
                && x + box.width <= ( this.snapDD[ i ].x + this.snapDD[ i ].width ) ) ) ) {
                // if this move would force the title off the screen, the avoid it
                if ( ny < 0 )
                    continue;
                ly.push( ny );
                continue;
            }
        }
        
        // nearest item sort.  if x is 63, and the list is [ 600, 75, 0, 300 ], then 75 will be first
        if ( lx.length ) {
            lx = lx.sort(function(a,b) {
                return Math.abs( a - x ) < Math.abs( b - x ) ? -1 : Math.abs( a - x ) > Math.abs( b - y ) ? 1 : 0
            });
            x = lx[0];
        }
        // same as x
        if ( ly.length ) {
            ly = ly.sort(function(a,b) {
                return Math.abs( a - y ) < Math.abs( b - y ) ? -1 : Math.abs( a - y ) > Math.abs( b - y ) ? 1 : 0
            });
            y = ly[0];
        }
        
        // slide the window to the edge or just snap it
        if ( drop && Ext.ux.WindowSnap.animateDropSnap )
            fly.moveTo( x, y, { easing: 'bounceOut', duration: .3 } );
        else
            fly.setLeftTop( x, y );
    },

    _getSnapData: function() {
        var snapDD = this.snapDD = [];
        var win = this.win;
        win.manager.each(function(w) {
            if ( !w || !w.isVisible() || win === w )
                return;
            snapDD.push( w.getBox() );
            /*
            var box = w.getBox();
            box.id = w.id;
            box.a = w._lastAccess;
            snapDD.push( box );
            */
        });
        /* XXX sort by lastAccess?
        this.snapDD = this.snapDD.sort(function(a,b) {
            return b.a < a.a ? -1 : ( ( b.a > a.a ) ? 1 : 0 );
        });
        */
    }
    
});
