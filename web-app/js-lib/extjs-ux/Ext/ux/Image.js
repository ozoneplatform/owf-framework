Ext.namespace('Ext.ux');

/**
 * @class Ext.ux.Image
 * @extends Ext.BoxComponent
 * @desc
 * Image component for ExtJs<br><br>
 * 
 * Forum Thread : <a href="http://extjs.com/forum/showthread.php?p=286538">http://extjs.com/forum/showthread.php?p=286538</a><br>
 * Project Home : <a href="http://code.google.com/p/ext-ux-image/">http://code.google.com/p/ext-ux-image/</a>
 * 
 * @version 1.0
 * @licence <a href="http://www.gnu.org/licenses/gpl.html">GPLv3</a>
 * @author Charles Opute Odili (chalu) <a href="mailto:chaluwa@gmail.com">chaluwa@gmail.com</a>
 * 
 * @constructor
 * @param {Object} config The config object
 */ 
Ext.ux.Image = Ext.extend(Ext.BoxComponent, {
	/**
	 * @cfg {String} src the URL of an image to initiaize it with, 
	 * deafults to Ext.BLANK_IMAGE_URL
	 */
	src : Ext.BLANK_IMAGE_URL,
	
	autoEl : {
		tag : 'img',
		cls : 'tng-managed-image',
		src : Ext.BLANK_IMAGE_URL		
	},
	
	/**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
	initComponent: function () {		
		Ext.ux.Image.superclass.initComponent.apply(this, arguments);
	},
	
	/**
     * Renders the component within it's container
     */
	onRender: function(){
		Ext.ux.Image.superclass.onRender.apply(this, arguments);
		
		if(!Ext.isEmpty(this.src) && (this.src !== Ext.BLANK_IMAGE_URL)){
			this.setSrc(this.src);
		}
		this.relayEvents(this.el, 
			[
				"click", "dblclick", "mousedown", "mouseup", "mouseover",
				"mousemove", "mouseout", "keypress", "keydown", "keyup"
			]
		);				
	},
	
	/**
	 * Sets the src for the image component
	 * @cfg {String} src the new src
	 */
	setSrc: function (src) {
		this.el.dom.src = src;
	}
});

Ext.reg('image', Ext.ux.Image);
