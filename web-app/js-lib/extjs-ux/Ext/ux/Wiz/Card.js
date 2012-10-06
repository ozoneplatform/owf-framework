Ext.namespace('Ext.ux.Wiz');

/**
 * @class Ext.ux.Wiz.Card
 * @extends Ext.FormPanel
 * @desc
 * A specific Ext.FormPanel that can be used as a card in a 
 * {@link Ext.ux.Wiz}-component. An instance of this card does only work properly
 * if used in a panel that uses a Ext.layout.CardLayout-layout.<br><br>
 * The homepage: <a href="http://www.siteartwork.de/wizardcomponent">http://www.siteartwork.de/wizardcomponent</a><br/>
 * The forum thread: <a href="http://extjs.com/forum/showthread.php?t=36627">http://extjs.com/forum/showthread.php?t=36627</a>

 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.Wiz.Card = Ext.extend(Ext.FormPanel, {
	
	/**
	 * @cfg {Boolean} header "True" to create the header element. Defaults to
	 * "false". See Ext.form.FormPanel.header
	 */
	header : false,
	
	/**
	 * @cfg {Strting} hideMode Hidemode of this component. Defaults to "offsets".
	 * See Ext.form.FormPanel.hideMode
	 */
	hideMode : 'display',

    initComponent : function()
    {
        this.addEvents(
        	/**
        	 * If you want to add additional checks to your card which cannot be easily done
        	 * using default validators of input-fields (or using the monitorValid-config option), 
        	 * add your specific listeners to this event.
        	 * This event gets only fired if the activeItem of the ownerCt-component equals to
        	 * this instance of {@see Ext.ux.Wiz.Card}. This is needed since a card layout usually
        	 * hides it's items right after rendering them, involving the beforehide-event. 
        	 * If those checks would be attached to the normal beforehide-event, the card-layout 
        	 * would never be able to hide this component after rendering it, depending on the 
        	 * listeners return value.
        	 * @event beforecardhide 
        	 * @param {Ext.ux.Wiz.Card} card The card that triggered the event
        	 */
            'beforecardhide'
        );  
	
	
        Ext.ux.Wiz.Card.superclass.initComponent.call(this);
        
    },
	
// -------- helper
	isValid : function()
	{
		if (this.monitorValid) {
			return this.bindHandler();	
		}
		
		return true;
	},	
	
// -------- overrides	
    /**
     * Overrides parent implementation since we allow to add any element
     * in this component which must not be neccessarily be a form-element.
     * So before a call to "isValid()" is about to be made, this implementation
     * checks first if the specific item sitting in this component has a method "isValid"
     * to prevent errors.
     */
    bindHandler : function()
    {
        if(!this.bound){
            return false; // stops binding
        }
        var valid = true;
        this.form.items.each(function(f){
            if(f.isValid && !f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.buttons){
            for(var i = 0, len = this.buttons.length; i < len; i++){
                var btn = this.buttons[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    },
    
	/**
	 * Overrides parent implementation. This is needed because in case 
	 * this method uses "monitorValid=true", the method "startMonitoring" must
	 * not be called, until the "show"-event of this card fires. 
	 */
	initEvents : function()
	{
		var old = this.monitorValid;
		this.monitorValid = false;
        Ext.ux.Wiz.Card.superclass.initEvents.call(this);
		this.monitorValid = old;
		
		this.on('beforehide',     this.bubbleBeforeHideEvent, this);
		
		this.on('beforecardhide', this.isValid,    this);
	    this.on('show',           this.onCardShow, this);
		this.on('hide',           this.onCardHide, this);
    },

// -------- listener	
    /**
     * Checks wether the beforecardhide-event may be triggered.
     */
    bubbleBeforeHideEvent : function()
    {
        var ly         = this.ownerCt.layout;
        var activeItem = ly.activeItem;
        
        if (activeItem && activeItem.id === this.id) {
            return this.fireEvent('beforecardhide', this);    
        }
        
        return true;
    },

    /**
     * Stops monitoring the form elements in this component when the
     * 'hide'-event gets fired.
     */
	onCardHide : function()
	{
		if (this.monitorValid) {
			this.stopMonitoring();	
		}
	},

    /**
     * Starts monitoring the form elements in this component when the
     * 'show'-event gets fired.
     */
	onCardShow : function()
	{
	    if (this.monitorValid) {
			this.startMonitoring();	
		}
	}
	
});