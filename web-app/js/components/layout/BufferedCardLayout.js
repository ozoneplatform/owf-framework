Ext.define('Ozone.components.layout.BufferedCardLayout', {
    extend: 'Ext.layout.container.Card',
    alias: 'layout.bufferedcard',
    
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
     * Sets the active (visible) item in the layout.
     * @param {String} item The string component id or numeric index of the item to activate
     */
//    setActiveItemOld: function(item){
//
//        this.initCardBuffers();
//
//        var ai = this.activeItem, ct = this.owner;
//        var origItem = item;
//        item = ct.getComponent(item);
//
//        //if the item is null than it could have been remove
//        //add it back to the container from the initialConfig that was saved
//        if (!item) {
//            item = this.removedCardConfigBuffer.get(origItem);
//
//            //recreate dash store
//            var stateStore = Ext.create('Ozone.data.StateStore', {
//              storeId: item.config.guid,
//              data: item.config.state
//            });
//            item.stateStore = stateStore;
//
//            item = ct.add(item);
//        }
//
//        //remove and add the new card
//        //if the card currently exists in the buffer
//        var oldIndex = this.cardBuffer.indexOf(item);
//        if (oldIndex > -1) {
//          this.cardBuffer.removeAt(oldIndex);
//        }
//        this.cardBuffer.add(item);
//
//        // Is this a valid, different card?
//        if (item && ai != item) {
//
//            // Changing active cards, hide the current one
//            if (ai) {
//                ai.hide();
//                if (ai.hidden !== true) {
//                    return false;
//                }
//                ai.fireEvent('deactivate', ai);
//
//                //check to see if we need
//                //to remove from our buffer - if so destroy the card
//                var cardsToRemove = this.cardBuffer.getCount() - this.cardBufferSize;
//                if (cardsToRemove > 0) {
//                    for (var i = 0; i < cardsToRemove; i++) {
//                        var card = this.cardBuffer.getAt(i);
//
//                        if (card.rendered) {
//                            //save initial config of the removed card
//                            this.removedCardConfigBuffer.add(card.initialConfig);
//
//                            //destroy uneeded card - removes from dom and also removes from container
//                            card.dontRemove = true;
//                            card.destroy();
//                            card.dontRemove = false;
//                        }
//
//                        //remove from our buffer
//                        this.cardBuffer.removeAt(i);
//                    }
//                }
//            }
//
//            var layout = item.doLayout && (this.layoutOnCardChange || !item.rendered);
//
//            // Change activeItem reference
//            this.activeItem = item;
//
//            // The container is about to get a recursive layout, remove any deferLayout reference
//            // because it will trigger a redundant layout.
//            delete item.deferLayout;
//
//            // Show the new component
//            item.show();
//
//            this.layout();
//
//            if (layout) {
//                item.doLayout();
//            }
//
//            item.fireEvent('activate', item);
//        }
//    },
    
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
        
        //if the item is null than it could have been remove
        //add it back to the container from the initialConfig that was saved
        if (!newCard) {
            newCard = this.removedCardConfigBuffer.get(origCard);

            //recreate dash store
            var stateStore = Ext.create('Ozone.data.StateStore', {
                storeId: newCard.config.guid,
                data: []
            });
            newCard.stateStore = stateStore;

            newIndex = owner.items.items.length;
            newCard = owner.add(newCard);
        }
        
        //remove and add the new card
        //if the card currently exists in the buffer
        var oldIndex = this.cardBuffer.indexOf(newCard);
        if (oldIndex > -1) {
          this.cardBuffer.removeAt(oldIndex);
        }
        this.cardBuffer.add(newCard);
        
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
                    oldCard.hide();
                }
                oldCard.fireEvent('deactivate', oldCard, newCard);
            }

            //check to see if we need
            //to remove from our buffer - if so destroy the card
            var cardsToRemove = this.cardBuffer.getCount() - this.cardBufferSize;
            if (cardsToRemove > 0) {
                for (var i = 0; i < cardsToRemove; i++) {
                    var card = this.cardBuffer.getAt(i);
                    
                    if (card.rendered) {
                        //save initial config of the removed card
                        this.removedCardConfigBuffer.add(card.initialConfig);
                        
                        //destroy uneeded card - removes from dom and also removes from container
                        card.dontRemove = true;
                        card.destroy();
                        card.dontRemove = false;
                    }
                    
                    //remove from our buffer
                    this.cardBuffer.removeAt(i);
                }
            }
            
            // Make sure the new card is shown
            me.owner.suspendLayout = false;
            if (newCard.hidden) {
                newCard.show();
            
                // The container is about to get a recursive layout, remove any deferLayout reference
                // because it will trigger a redundant layout.
                delete newCard.deferLayout;
            
            } else {
                me.onLayout();
            }
            
            newCard.fireEvent('activate', newCard, oldCard);
            
            return newCard;
        }
        return false;
    }
            
});
