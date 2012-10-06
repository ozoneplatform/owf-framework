Ext.define('Ozone.ux.DashboardSplitter', {
    extend: 'Ext.resizer.Splitter',
    alias: [
        'widget.dashboardsplitter',
        'widget.Ozone.ux.DashboardSplitter'
    ],
    
    width: 3,
    height: 3,
    cls: 'dashboard-splitter',

    performCollapse: false,
    
    initComponent: function() {

        this.on('dragend', this.doResize, this);

        this.callParent(arguments);
    },
    
    doResize: function(splitter, x, y, eOpts) {
        
        var owner = this.ownerCt;
        if (owner.items.getCount() == 3 && !owner.rendering) {
            var thisPane = owner.items.getAt(0);
            var partnerPane = owner.items.getAt(2);
            var usePartner = (thisPane.initialConfig.htmlText == 'Variable');
            var thisWidth, thisHeight, thisNum;
            var partnerWidth, partnerHeight, partnerNum;
            var ownerWidth, ownerHeight, type;
            var verticalSplitter = (this.orientation === 'vertical');
            
            ownerWidth = owner.getWidth();
            ownerHeight = owner.getHeight();
            thisWidth = thisPane.getWidth();
            thisHeight = thisPane.getHeight();
            partnerWidth = ownerWidth - thisWidth - this.width;
            partnerHeight = ownerHeight - thisHeight - this.height;
            
            delete thisPane.initialConfig.flex;
            delete thisPane.initialConfig.width;
            delete thisPane.initialConfig.height;
            delete thisPane.flex;
            delete partnerPane.initialConfig.flex;
            delete partnerPane.initialConfig.width;
            delete partnerPane.initialConfig.height;
            delete partnerPane.flex;

            if (thisPane.initialConfig.htmlText) {
                type = thisPane.initialConfig.htmlText.charAt(thisPane.initialConfig.htmlText.length-1);
            } else if (partnerPane.initialConfig.htmlText) {
                type = partnerPane.initialConfig.htmlText.charAt(partnerPane.initialConfig.htmlText.length-1);
            } else {
                type = '%';
            }
                    
            if(type === '%') { // Percent values
                
                if (verticalSplitter) {
                    thisNum = Math.round((thisWidth / ownerWidth) * 100);
                } else {
                    thisNum = Math.round((thisHeight / ownerHeight) * 100);
                }
                partnerNum = 100-thisNum;
                thisPane.initialConfig.flex = thisPane.flex = thisNum/100;
                thisPane.initialConfig.htmlText = thisNum + '%';
                if (thisPane.textEl) {
                    thisPane.textEl.update(thisNum + '%');
                }

                partnerPane.initialConfig.flex = partnerPane.flex = partnerNum/100;
                if(partnerPane.textEl) {
                    partnerPane.textEl.update(partnerNum + '%');
                }
                partnerPane.initialConfig.htmlText = partnerNum + '%';

            } else {  // Pixel values
                
                if (usePartner) {
                    if (verticalSplitter) {
                        partnerNum = partnerWidth;
                        partnerPane.initialConfig.width = partnerNum;
                        partnerPane.width = partnerNum;
                    } else {
                        partnerNum = partnerHeight;
                        partnerPane.initialConfig.height = partnerNum;
                        partnerPane.height = partnerNum;
                    }
                    partnerPane.initialConfig.htmlText = partnerNum + 'px';
                    if (partnerPane.textEl) {
                        partnerPane.textEl.update(partnerNum + 'px');
                    }

                    thisPane.initialConfig.htmlText = 'Variable';
                    if(thisPane.textEl) {
                        thisPane.textEl.update('Variable');
                    }
                    thisPane.initialConfig.flex = thisPane.flex = 1;
                } else {
                    if (verticalSplitter) {
                        thisNum = thisWidth;
                        thisPane.initialConfig.width = thisNum;
                        thisPane.width = thisNum;
                    } else {
                        thisNum = thisHeight;
                        thisPane.initialConfig.height = thisNum;
                        thisPane.height = thisNum;
                    }
                    thisPane.initialConfig.htmlText = thisNum + 'px';
                    if (thisPane.textEl) {
                        thisPane.textEl.update(thisNum + 'px');
                    }

                    partnerPane.initialConfig.htmlText = 'Variable';
                    if(partnerPane.textEl) {
                        partnerPane.textEl.update('Variable');
                    }
                    partnerPane.initialConfig.flex = partnerPane.flex = 1;
                }
            }
            if (thisPane.dashboard) {
                thisPane.dashboard.hasChanged = true;
            }
        }
    }
});