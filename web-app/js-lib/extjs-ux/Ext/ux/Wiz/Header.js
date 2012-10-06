Ext.namespace('Ext.ux.Wiz');

/**
 * @class Ext.ux.Wiz.Header
 * @extends Ext.BoxComponent
 * @desc
 * A specific Ext.BoxComponent that can be used to show the current process in an {@link Ext.ux.Wiz}. <br>
 *
 * An instance of this class is usually being created by {@link Ext.ux.Wiz#initPanels} using the
 * {@link Ext.ux.Wiz#headerConfig}-object. <br/><br/>
 *
 * The homepage: <a href="http://www.siteartwork.de/wizardcomponent">http://www.siteartwork.de/wizardcomponent</a><br/>
 * The forum thread: <a href="http://extjs.com/forum/showthread.php?t=36627">http://extjs.com/forum/showthread.php?t=36627</a>

 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.Wiz.Header = Ext.extend(Ext.BoxComponent, {
  
    /**
     * @cfg {Number} height The height of this component. Defaults to "55".
     */  
    height : 55, 
    
    /**
     * @cfg {String} region The Region of this component. Since a {@link Ext.ux.Wiz} 
     * usually uses a {@link Ext.layout.BorderLayout}, this property defaults to
     * "north". If you want to change this property, you should also change the appropriate
     * css-classes that are used for this component.
     */  
    region : 'north', 
     
    /**
     * @cfg {String} title The title that gets rendered in the head of the component. This
     * should be a text describing the purpose of the wizard.
     */  
    title : 'Wizard',
    
    /**
     * @cfg {Number} steps The overall number of steps the user has to go through
     * to finish the wizard. 
     */
    steps : 0, 

    /**
     * @cfg {String} stepText The text in the header indicating the current process in the wizard.
     * (defaults to "Step {0} of {1}: {2}").
     * {0} is replaced with the index (+1) of the current card, {1} is replaced by the
     * total number of cards in the wizard and {2} is replaced with the title-property of the
     * {@link Ext.ux.Wiz.Card}
     * @type String
     */
    stepText : "Step {0} of {1}: {2}",

    /**
     * @cfg {Object} autoEl The element markup used to render this component.
     */
	autoEl : {
		tag : 'div',
		cls		 : 'ext-ux-wiz-Header',
		children : [{
		  	tag		 : 'div',
		  	cls		 : 'ext-ux-wiz-Header-title'
		}, {
			tag  : 'div',
			children : [{
				tag : 'div',
				cls : 'ext-ux-wiz-Header-step'
			}, {
				tag : 'div',
				cls : 'ext-ux-wiz-Header-stepIndicator-container'
			}]
		}]
	},

    /**
     * @param {Ext.Element}
     * @private
     */
  	titleEl : null,

    /**
     * @param {Ext.Element}
     * @private
     */
    stepEl  : null,
  	
    /**
     * @param {Ext.Element}
     * @private
     */
  	imageContainer : null,
  	
    /**
     * @param {Array}
     * @private
     */  	
  	indicators : null,
  
  	/**
  	 * @param {Ext.Template}
  	 * @private
  	 */
  	stepTemplate : null,
  	
  	/**
  	 * Stores the index of the last active card that was shown
  	 * @param {Number} lastActiveStep 
  	 */
  	lastActiveStep : -1,
  
// -------- helper
    /**
     * Gets called by  {@link Ext.ux.Wiz#onCardShow()} and updates the header
     * with the approppriate information, such as the progress of the wizard 
     * (i.e. which card is being shown etc.)
     *
     * @param {Number} currentStep The index of the card currently shown in 
     * the wizard
     * @param {String} title The title-property of the {@link Ext.ux.Wiz.Card}
     *
     * @private
     */
  	updateStep : function(currentStep, title)
  	{
  		var html = this.stepTemplate.apply({
  			0 : currentStep+1, 
  			1 : this.steps, 
  			2 : title
  		});
  		
  		this.stepEl.update(html);
  		
  		if (this.lastActiveStep != -1) {
  			this.indicators[this.lastActiveStep].removeClass('ext-ux-wiz-Header-stepIndicator-active');
  		}
  		
  		this.indicators[currentStep].addClass('ext-ux-wiz-Header-stepIndicator-active');
  		
  		this.lastActiveStep = currentStep;
  	},
  
  
// -------- listener  
    /**
     * Overrides parent implementation to render this component properly.
     */
	onRender : function(ct, position)
	{
		Ext.ux.Wiz.Header.superclass.onRender.call(this, ct, position);
	
		this.indicators   = [];
		this.stepTemplate = new Ext.Template(this.stepText),
		this.stepTemplate.compile();
	
	    var el = this.el.dom.firstChild;
	    var ns = el.nextSibling;
	    
		this.titleEl        = new Ext.Element(el);
		this.stepEl         = new Ext.Element(ns.firstChild);
		this.imageContainer = new Ext.Element(ns.lastChild);
	
		this.titleEl.update(this.title);
		
		var image = null;
		for (var i = 0, len = this.steps; i < len; i++) {
			image = document.createElement('div');
			image.innerHTML = "&#160;";
			image.className = 'ext-ux-wiz-Header-stepIndicator';
			this.indicators[i] = new Ext.Element(image);
			this.imageContainer.appendChild(image);
		} 
	}
});