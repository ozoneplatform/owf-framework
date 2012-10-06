Ext.namespace('Ext.ux');

/**
 * @class Ext.ux.Wiz
 * @extends Ext.Window
 * @desc
 * A specific <a href="http://extjs.com/deploy/dev/docs/?class=Ext.Window">Ext.Window</a> that models a wizard component.
 * A wizard is basically a dialog that guides a user through various steps
 * where he has to fill out form-data. 
 * A Ext.ux.Wiz - component consists typically of a {@link Ext.ux.Wiz.Header}
 * and window-buttons Ext.Button which are linked to the {@link Ext.ux.Wiz.Card}s
 * which themself represent the forms the user has to fill out.<br><br>
 *
 * In order to switch between the cards in the wizard, you need the {@link Ext.ux.layout.CardLayout},
 * which will check if an active-item can be hidden, before the requested new item will be set to
 * 'active', i.e. shown. This is needed since the wizard may not allow a card to be hidden, if
 * the input entered by the user was not valid. You can get this custom layout at <a href="http://www.siteartwork.de/cardlayout">http://www.siteartwork.de/cardlayout</a>.<br><br>
 * 
 * The homepage: <a href="http://www.siteartwork.de/wizardcomponent">http://www.siteartwork.de/wizardcomponent</a><br/>
 * The forum thread: <a href="http://extjs.com/forum/showthread.php?t=36627">http://extjs.com/forum/showthread.php?t=36627</a>
 * 
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @author Thorsten Suckow-Homberg <a href="mailto:ts@siteartwork.de">ts@siteartwork.de</a>
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.Wiz = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {Object} loadMaskConfig An object containing the messages for the {@link Ext.LoadMask}
	 * covering the card-panel on request, whereas the property identifies the
	 * msg-text to show, and the value is the message text itself. Defaults to
	 <pre><code>
{
    default : 'Saving...'
}	 
	 </code></pre>
	 *
	 * Depending on the contexts the loadMask has to be shown in (using the method 
	 * showLoadMask of this class), the object can be configure to hold
	 * various messages.
<pre><code>
this.loadMaskConfig = {
    default    : 'Saving...',
    validating : 'Please wait, validating input...',
};	 
// loadMask will be shown, displaying the message 'Please wait, validating input...'
this.showLoadMask(true, 'validating');
	 </code></pre>	 
	 */
	loadMaskConfig : {
	    'default' : 'Saving...'
	},
	
    /**
	 * @cfg {Number} height The height of the dialog. Defaults to "400".	
	 */
    height : 400,
    
    /**
	 * @cfg {Number} width The width of the dialog. Defaults to "540".	
	 */
    width : 540,
    
    /**
	 * @cfg {Boolean} closable Wether the dialog is closable. Defaults to "true".	
	 */
	closable : true,
	
	/**
	 * @cfg {Boolean} resizable Wether the dialog is resizable. Defaults to "false".	
	 */
	resizable : false,
	
	/**
	 * @cfg {Boolean} modal Wether the dialog is modal. Defaults to "true".	
	 */
	modal : true,  	
	
	/**
	 * @cfg {Array} cards A numeric array with the configured {@link Ext.ux.Wiz.Card}s.
	 * The index of the cards in the array represent the order in which they get displayed
	 * in the wizard (i.e. card at index 0 gets displayed in the first step, card at index 1 gets
	 * displayed in the second step and so on).
	 */
	cards : null,
	
	/**
	 * @cfg {String} previousButtonText The text to render the previous-button with.
	 * Defaults to "&lt; Back" (< Back)
	 */
	previousButtonText : '&lt; Previous',
	
	/**
	 * @cfg {String} nextButtonText The text to render the next-button with.
	 * Defaults to "Next &gt;" (Next >)
	 */
	nextButtonText : 'Next &gt;',
	
	/**
	 * @cfg {String} cancelButtonText The text to render the cancel-button with.
	 * Defaults to "Cancel"
	 */
	cancelButtonText : 'Cancel',	
	
	/**
	 * @cfg {String} finishButtonText The text to render the next-button with when the last
	 * step of the wizard is reached. Defaults to "Finish"
	 */
	finishButtonText : 'Finish',	
	
	/**
	 * @cfg {Object} headerConfig A config-object to use with {@link Ext.ux.Wiz.Header}.
	 * If not present, it defaults to an empty object.
	 */
	headerConfig : {},
	
	/**
	 * @cfg {Object} cardPanelConfig A config-object to use with {@link Ext.Panel}, which
	 * represents the card-panel in this dialog.
	 * If not present, it defaults to an empty object
	 */
	cardPanelConfig : {},	
	
	/**
	 * @param {Ext.Button} The window-button for paging to the previous card.
	 * @private
	 */
	previousButton : null,
	
	/**
	 * @param {Ext.Button} The window-button for paging to the next card. When the
	 * last card is reached, the event fired by and the text rendered to this button
	 * will change.
	 * @private
	 */
	nextButton : null,
	
	/**
	 * @param {Ext.Button} The window-button for canceling the wizard. The event
	 * fired by this button will usually close the dialog.
	 * @private
	 */	
	cancelButton : null,
	
	/**
	 * @param {Ex.Panel} The card-panel that holds the various wizard cards 
	 * ({@link Ext.ux.Wiz.Card}). The card-panel itself uses the custom 
	 * {@link Ext.ux.layout.CardLayout}, which needs to be accessible by this class.
	 * You can get it at {@link http://www.siteartwork.de/cardlayout}.
	 * @private
	 */
	cardPanel : null,
	
	/**
	 * @param {Number} currentCard The current {@link Ext.ux.Wiz.Card} displayed.
	 * Defaults to -1.
	 * @private
	 */
	currentCard : -1,
	
	/**
     * @param {Ext.ux.Wiz.Header} The header-panel of the wizard. 
     * @private
     */
    headPanel : null,
    
    /**
     * @param {Number} cardCount Helper for storing the number of cards used
     * by this wizard. Defaults to 0 (inherits "cards.length" later on).
     * @private
     */
    cardCount : 0,

    /**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
	initComponent : function()
	{
	    this.initButtons();
	    this.initPanels();
	    
	    var title = this.title || this.headerConfig.title;
	    title     = title || "";
	    	    
	    Ext.apply(this, {
	        title     : title,
	        layout    : 'border',    
	        cardCount : this.cards.length,
		    buttons   : [
		        this.previousButton,
			    this.nextButton,
			    this.cancelButton
		    ],
		    items : [
		        this.headPanel,
			    this.cardPanel
		    ]  
	    });
	    
	    this.addEvents(
            /**
             * Fires after the cancel-button has been clicked.
             * @event cancel 
             * @param {Ext.ux.Wiz} this
             */   
            'cancel',
            /**
             * Fires after the last card was reached in the wizard and the next/finish-button has been clicked.
             * @event finish 
             * @param {Ext.ux.Wiz} this
             * @param {Object} data The collected data of the cards, whereas the index is the id of the card and the specific values are objects with key/value pairs in the form formElementName : value
             */   
            'finish'
	    );
	    
		Ext.ux.Wiz.superclass.initComponent.call(this);
	},
	
// -------- helper
    /**
     * Returns the form-data of all cards in this wizard. The first index is the
     * id of the card in this wizard,
     * and the values are objects containing key/value pairs in the form of
     * fieldName : fieldValue.
     *
     * @return {Array}
     */
    getWizardData : function()
    {
        var formValues = {};
		var cards = this.cards;
		for (var i = 0, len = cards.length; i < len; i++) {
		    if (cards[i].form) {
		        formValues[cards[i].id] = cards[i].form.getValues(false);    
		    } else {
		        formValues[cards[i].id] = {};
		    }
		}
		
		return formValues;
    },
     
	/**
	 * Switches the state of this wizard between disabled/enabled.
	 * A disabled dialog will have a {@link Ext.LoadMask} covering the card-panel
	 * to prevent user input, and the buttons will be rendered disabled/enabled.
	 * If the dialog is clsable, the close-tool will be masked, too.
	 *
	 * @param {Boolean} enabled "false" to prevent user input and mask the elements,
	 * otherwise true.
	 * @param {String} type The type of msg for the {@Ext.LoadMask} covering 
	 * the cardPanel, as defined in the cfg property "loadMaskConfig"
	 */
	switchDialogState : function(enabled, type)
	{
	    this.showLoadMask(!enabled, type);
        
        this.previousButton.setDisabled(!enabled);
        this.nextButton.setDisabled(!enabled);
        this.cancelButton.setDisabled(true);
        
        if (this.closable) {
            var ct = this.tools['close'];
            switch (enabled) {
                case true:
                    this.tools['close'].unmask();			    
                break;
                
                default:
                    this.tools['close'].mask();    
                break;    
            }    
        }
	},
	
    /**
     * Shows the load mask for this wizard. By default, the cardPanel's body
     * will be masked.
     *
     * @param {Boolean} show true to show the load mask, otherwise false.
     * @param {String} type The type of message for the {@Ext.LoadMask} covering 
	 * the cardPanel, as defined in the cfg property "loadMaskConfig"
     */
    showLoadMask : function(show, type)
    {
        if (!type) {
	        type = 'default';
	    }
	    
    	if (show) {
	        if (this.loadMask == null) {
	            this.loadMask = new Ext.LoadMask(this.body);
	        } 
	        this.loadMask.msg = this.loadMaskConfig['type'];
        	this.loadMask.show();
        } else {
        	if (this.loadMask) {
        		this.loadMask.hide();	
        	}
        }
    }, 	


    /**
     * Inits the listener for the various {@link Ext.ux.Wiz.Card}s used
     * by this component.
     */
	initEvents : function()
	{
	    Ext.ux.Wiz.superclass.initEvents.call(this);
	    
		var cards = this.cards;
		
		for (var i = 0, len = cards.length; i < len; i++) {
			cards[i].on('show', this.onCardShow, this);
			cards[i].on('hide', this.onCardHide, this);
			cards[i].on('clientvalidation', this.onClientValidation, this);
		}
	},

    /**
     * Creates the head- and the card-panel.
     * Be sure to have the custom {@link Ext.ux.layout.CardLayout} available
     * in order to make the card-panel work as expected by this component
     * ({@link http://www.siteartwork.de/cardlayout}).
     */
    initPanels : function()
    {
        var cards           = this.cards;
        var cardPanelConfig = this.cardPanelConfig;
        
        Ext.apply(this.headerConfig, {
            steps : cards.length    
        });
        
        this.headPanel = new Ext.ux.Wiz.Header(this.headerConfig);	
        
        Ext.apply(cardPanelConfig, {
            layout : new Ext.ux.layout.CardLayout(),
            items  : cards	
        });
        
        Ext.applyIf(cardPanelConfig, {
			region     : 'center',
			border     : false,
			activeItem : 0
        }); 
        
        this.cardPanel = new Ext.Panel(cardPanelConfig);  
    }, 

    /**
     * Creates the instances for the the window buttons.
     */
    initButtons	: function()
    {
		this.previousButton = new Ext.Button({
			text 	 : this.previousButtonText,
			disabled : true,
			minWidth : 75,
			handler  : this.onPreviousClick,
			scope	 : this
		});
		
		this.nextButton = new Ext.Button({
			text	 : this.nextButtonText,
			minWidth : 75,
			handler  : this.onNextClick,
			scope	 : this
		});
		
		this.cancelButton = new Ext.Button({
			text	 : this.cancelButtonText,
			handler  : this.onCancelClick,
			scope	 : this,
			minWidth : 75		
		});
    },

// -------- listeners	
    /**
     * By default, the card firing this event monitors user input in a frequent
     * interval and fires the 'clientvalidation'-event along with it. This listener
     * will enable/disable the next/finish-button in accordance with it, based upon
     * the parameter isValid. isValid" will be set by the form validation and depends
     * on the validators you are using for the different input-elemnts in your form.
     * If the card does not contain any forms, this listener will never be called by the
     * card itself.
     *
     * @param {Ext.ux.Wiz.Card} The card that triggered the event.
     * @param {Boolean} isValid "true", if the user input was valid, otherwise
     * "false"
     */
	onClientValidation : function(card, isValid)
	{
		if (!isValid) {
			this.nextButton.setDisabled(true);	
		} else {
			this.nextButton.setDisabled(false);	
		}
	},
	
	/**
	 * This will render the "next" button as disabled since the bindHandler's delay
	 * of the next card to show might be lagging on slower systems
	 * 
	 */
	onCardHide : function(card)
	{
	    if (this.cardPanel.layout.activeItem.id === card.id) {
	        this.nextButton.setDisabled(true);	
	    }
	},
	
	
	/**
	 * Listener for the "show" event of the card that gets shown in the card-panel.
	 * Renders the next/previous buttons based on the position of the card in the wizard
	 * and updates the head-panel accordingly.
	 *
	 * @param {Ext.ux.Wiz.Card} The card being shown.
	 */
	onCardShow : function(card)
	{
		var parent = card.ownerCt;
		
		var items = parent.items;
		
		for (var i = 0, len = items.length; i < len; i++) {
			if (items.get(i).id == card.id) {
				break;	
			}	
		}
		
		this.currentCard = i;
		this.headPanel.updateStep(i, card.title);
		
		if (i == len-1) {
			this.nextButton.setText(this.finishButtonText);	
		} else {
			this.nextButton.setText(this.nextButtonText);
		}
		
		if (card.isValid()) {
			this.nextButton.setDisabled(false);
		}
		
		if (i == 0) {
			this.previousButton.setDisabled(true);
		} else {
			this.previousButton.setDisabled(false);	
		}
		
	},
	
	/**
	 * Fires the 'cancel'-event. Closes this dialog if the return value of the 
	 * listeners does not equal to "false".
	 */
	onCancelClick : function()
	{
	    if (this.fireEvent('cancel', this) !== false) {
            this.close();
        }
	},
	
	/**
	 * Fires the 'finish'-event. Closes this dialog if the return value of the 
	 * listeners does not equal to "false".
	 */
	onFinish : function()
	{
	    if (this.fireEvent('finish', this, this.getWizardData()) !== false) {
            this.close();
        }
	},	
	
	/**
	 * Listener for the previous-button. 
	 * Switches to the previous displayed {@link Ext.ux.Wiz.Card}.
	 */
	onPreviousClick : function()
	{
		if (this.currentCard > 0) {
			this.cardPanel.getLayout().setActiveItem(this.currentCard - 1);	
		}
	},
	
	/**
	 * Listener for the next-button. Switches to the next {@link Ext.ux.Wiz.Card}
	 * if the 'beforehide'-method of it did not return false. The functionality
	 * for this is implemented in {@link Ext.ux.layout.CardLayout}, which is needed
	 * as the layout for the card-panel of this component.
	 */
	onNextClick : function()
	{
		if (this.currentCard == this.cardCount-1) {
			this.onFinish();
		} else {
			this.cardPanel.getLayout().setActiveItem(this.currentCard+1);
		}
	}
});