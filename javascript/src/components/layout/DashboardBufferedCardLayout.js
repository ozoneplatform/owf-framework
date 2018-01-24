Ext.define('Ozone.components.layout.DashboardBufferedCardLayout', {
    extend: 'Ext.layout.container.Card',
    alias: 'layout.dashboardbufferedcard',
    
    /**
     * @cfg {Boolean} deferredRender
     * True to render each contained item at the time it becomes active, false to render all contained items
     * as soon as the layout is rendered.  If there is a significant amount of content or
     * a lot of heavy controls being rendered into panels that are not displayed by default, setting this to
     * true might improve performance.
     */
    deferredRender: true,
    type: 'bufferedcard',
    cardBufferSize: 10,
    
    constructor : function(config) {
        this.callParent(arguments);
        this.initCardBuffers();
    },

    initCardBuffers: function(){
        if (!this.cardBuffer) {
            this.cardBuffer = Ext.create('Ext.util.MixedCollection');
        }
        if (!this.removedCardConfigBuffer) {
            this.removedCardConfigBuffer = Ext.create('Ext.util.MixedCollection');
        }
    },
    
    afterRemove: function(c){
        this.callParent([c]);
        if (!c.dontRemove) {
            //this is a real remove clean our buffers
            this.cardBuffer.remove(c);
            this.removedCardConfigBuffer.remove(c);
        }
    },

    /**
    * @Override
    **/
    configureItem: function (item) {
        item.layoutManagedHeight = 0;
        item.layoutManagedWidth = 0;

        // skip calling configureItem method of two parent classes
        // done to prevent onHide from being called twice unnecessarily
        this.superclass.superclass.superclass.configureItem.apply(this, arguments);
    },

    /**
     * Makes the given card active.
     *
     *     var card1 = Ext.create('Ext.panel.Panel', {itemId: 'card-1'});
     *     var card2 = Ext.create('Ext.panel.Panel', {itemId: 'card-2'});
     *     var panel = Ext.create('Ext.panel.Panel', {
     *         layout: 'card',
     *         activeItem: 0,
     *         items: [card1, card2]
     *     });
     *     // These are all equivalent
     *     panel.getLayout().setActiveItem(card2);
     *     panel.getLayout().setActiveItem('card-2');
     *     panel.getLayout().setActiveItem(1);
     *
     * @param {Ext.Component/Number/String} newCard  The component, component {@link Ext.Component#id id},
     * {@link Ext.Component#itemId itemId}, or index of component.
     * @return {Ext.Component} the activated component or false when nothing activated.
     * False is returned also when trying to activate an already active card.
     */
    setActiveItem: function(newCard) {
        var me = this,
            owner = me.owner,
            oldCard = me.activeItem,
            newIndex;
        
        var origCard = newCard;
        newCard = me.parseActiveItem(newCard);
        newIndex = owner.items.indexOf(newCard);
        
        // PATCH BEGIN
        //if the item is null than it could have been remove
        //add it back to the container from the initialConfig that was saved
        if (!newCard) {
            newCard = this.removedCardConfigBuffer.get(origCard);

            newIndex = owner.items.items.length;
            newCard = owner.add(newCard);
        }
        
        this._updateBuffer(newCard);
        // PATCH END
        
        // If the card is not a child of the owner, then add it
        if (newIndex == -1) {
            newIndex = owner.items.items.length;
            owner.add(newCard);
        }

        // Is this a valid, different card?
        if (newCard) {
            // If the card has not been rendered yet, now is the time to do so.
            if (!newCard.rendered) {
                me.renderItem(newCard, me.getRenderTarget(), owner.items.length);
                me.configureItem(newCard, 0);
            }
        
            me.activeItem = newCard;

            // Fire the beforeactivate and beforedeactivate events on the cards
            if (newCard.fireEvent('beforeactivate', newCard, oldCard) === false) {
                return false;
            }
            if (oldCard && oldCard.fireEvent('beforedeactivate', oldCard, newCard) === false) {
                return false;
            }
                
            // If the card hasnt been sized yet, do it now
            if (me.sizeAllCards) {
                // onLayout calls setItemBox
                me.onLayout();
            }
            else {
                me.setItemBox(newCard, me.getTargetBox());
            }

            me.owner.suspendLayout = true;

            if (oldCard) {
                if (me.hideInactive) {
                    // PATCH BEGIN
                    me._hideCard(oldCard, newCard);
                    // PATCH END
                }
                oldCard.fireEvent('deactivate', oldCard, newCard);
            }

            // PATCH BEGIN
            this._removeOldCardsFromBuffer();
            this._showCard(newCard);
            // PATCH END        
            
            newCard.fireEvent('activate', newCard, oldCard);
            
            return newCard;
        }
        return false;
    },

    _hideCard: function (currentDashboard, newDashboard) {
        var direction = 'left';

        if(newDashboard.configRecord.isMarketplaceDashboard()) {
            direction = 'down';
        }
        else if(currentDashboard.configRecord.isMarketplaceDashboard()) {
            direction = 'up';
        }

        currentDashboard.setSlideOutDirection(direction);
        newDashboard.setSlideInDirection(direction);

        currentDashboard.hide();
    },

    _showCard: function (dashboard) {
        // Make sure the new card is shown
        this.owner.suspendLayout = false;
        if (dashboard.hidden) {
            dashboard.show();
        
        } else {
            this.onLayout();
            dashboard.slideIn();
        }
    },

    _updateBuffer: function (newCard) {
        //remove and add the new card
        //if the card currently exists in the buffer
        var oldIndex = this.cardBuffer.indexOf(newCard);
        if (oldIndex > -1) {
          this.cardBuffer.removeAt(oldIndex);
        }
        this.cardBuffer.add(newCard);
    },

    _removeOldCardsFromBuffer: function () {
        var me = this;

        var cardsToRemove = me.cardBuffer.getCount() - me.cardBufferSize;
        if (cardsToRemove > 0) {
            for (var i = 0; i < cardsToRemove; i++) {
                var card = me.cardBuffer.getAt(i);

                if (card.rendered) {
                    //save initial config of the removed card
                    me.removedCardConfigBuffer.add(card.initialConfig);

                    //destroy uneeded card - removes from dom and also removes from container
                    card.dontRemove = true;
                    card.destroy();
                    card.dontRemove = false;
                }

                //remove from our buffer
                me.cardBuffer.removeAt(i);
            }
        }
    }
            
});
