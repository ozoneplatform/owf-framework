Ext.define('Ozone.components.layout.SearchBoxLayout', {
    extend: 'Ext.layout.component.field.Text',
    alias: 'layout.searchbox',

    //override this function to size the input correctly considering the
    //icons around it
    sizeBodyContents: function(width, height) {
        var bodyEl = this.owner.bodyEl;
        var inputEl = this.owner.inputEl;
        var imgWidth = this.owner.clearEl.getWidth();

        //take 24px off of the body width to get the correct width
        //of the inputEl.
        //Also, don't mess with the height.
        //This assumes that both the search icon element and the clearEl are the 
        //same width
        width -= (imgWidth * 2) + bodyEl.getPadding('lr') + bodyEl.getBorderWidth('lr') + inputEl.getMargin('lr');
        var size = this.adjustForGrow(width, height);
        this.setElementSize(this.owner.inputEl, size[0]);
    }
});
