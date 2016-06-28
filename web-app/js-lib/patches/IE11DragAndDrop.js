/**
 * IE11 does not require (or work with) the same IE-specific drag logic that older
 * versions required.  This patches the onMouseMove method of Ext.dd.DragTracker
 * accordingly
 */
Ext.dd.DragTracker.prototype.onMouseMove = function(e, target){

    //PATCH
    //if (this.active && Ext.isIE && !e.browserEvent.button) {
    if (this.active && (Ext.isIE && !Ext.isIE11) && !e.browserEvent.button) {
        e.preventDefault();
        this.onMouseUp(e);
        return;
    }

    e.preventDefault();
    var xy = e.getXY(),
        s = this.startXY;

    this.lastXY = xy;
    if (!this.active) {
        if (Math.max(Math.abs(s[0]-xy[0]), Math.abs(s[1]-xy[1])) > this.tolerance) {
            this.triggerStart(e);
        } else {
            return;
        }
    }


    if (this.fireEvent('mousemove', this, e) === false) {
        this.onMouseUp(e);
    } else {
        this.onDrag(e);
        this.fireEvent('drag', this, e);
    }
}
