/*(c) Copyright 2008 Licensed under LGPL3. See details below*/
var o = Ext.Container.prototype.lookupComponent;
Ext.override(Ext.Container, {

    // Override of our container's method to allow raw Elements to be added.
    // This is called in the context of the container.
    lookupComponent: function(comp) {
        if (comp instanceof Ext.Element) {
            return comp;
        } else if (comp.nodeType && (comp.nodeType == 1)) {
            return Ext.get(comp);
        } else {
            return o.call(this, comp);
        }
    }
});

Ext.namespace('Ext.ux.layout');

/**
 * Carousel Layout.
 * <br>
 * <br>See the following for a <a href="http://extjs-ux.org/repo/authors/jerrybrown5/trunk/Ext/ux/layout/Carousel/Demo.html">demo</a>
 * <br>
 * <br> Example Usage
 * <pre>    
 *     margins: '5 5 5 0',
 *     title: 'Photos',
 *     layoutConfig: {
 *         pagedScroll: true
 *     },
 *     layout: '<b>carousel</b>',
 *     items: [{
 *         title: "First",
 *         style: {
 *             margin: '5px 5px 5px 5px'
 *         },
 *         width: 120,
 *         html: "&lt;img src='../view/images/thumbs/dance_fever.jpg'>"
 *     }]
 * </pre>
 * <br>Forum thread: <a href="http://extjs.com/forum/showthread.php?t=47672">http://extjs.com/forum/showthread.php?t=47672</a>
 * @class Ext.ux.layout.Carousel
 * @author Nigel White aka Animal; updated by Jerry Brown, published by SamuraiJack
 * @license Ext.ux.layout.Carousel is licensed under the terms of
 * the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission. 
 * @version 0.2
 */
Ext.ux.layout.Carousel = Ext.extend(Ext.layout.ContainerLayout, {
    constructor: function(config) {
        config = config || {};

//      Non-chunked, then animation makes no sense.
        if (!(config.chunkedScroll || config.pagedScroll)) {
            Ext.applyIf(config, {
                scrollIncrement: 10,
                scrollRepeatInterval: 10,
                marginScrollButtons: 12,
                animScroll: false
            });
        }
        Ext.ux.layout.Carousel.superclass.constructor.call(this, config);

//      Set up animation config depending upon animation requirements.
        if (this.chunkedScroll || this.pagedScroll) {
            this.scrollRepeatInterval = this.scrollDuration * 1000;
            this.scrollAnimationConfig = {
                duration: this.chunkedScroll ? this.scrollDuration : this.scrollDuration * 2,
                callback: this.updateScrollButtons,
                scope: this
            }
        } else {
            this.scrollAnimationConfig = this.animScroll ? {
                duration: this.scrollDuration,
                callback: this.updateScrollButtons,
                scope: this
            } : false;
        }
        
//        if (Ext.isIE){
//	        if (!this.defaults) { this.defaults={} }
//	        if (!this.defaults.bodyStyle) { this.defaults.bodyStyle={} }
//	        this.defaults.bodyStyle.position='static';
//	    }

    },

    /**
     * @cfg {Number} marginScrollButtons This is to set aside space for the left and right navigation buttons.
     */

	marginScrollButtons : 10,
    /**
     * @cfg scrollElementTag {String} The tag name of the carousel item container. If each item's main Element
     * is an &lt;LI> then this could be specified as '&lt;UL>. Defaults to '&lt;DIV>'.
    /**
     * @cfg {Number} scrollIncrement The number of pixels to scroll each time a tab scroll button is pressed (defaults
     * to 10, or if {@link #Ext.ux.layout.Carousel-resizeTabs} = true, the calculated tab width).
     */
    scrollIncrement : 10,
    /**
     * @cfg {Number} scrollRepeatInterval Number of milliseconds between each scroll while a scroll button is
     * continuously pressed (defaults to 10).
     */
    scrollRepeatInterval : 10,
    /**
     * @cfg {Float} scrollDuration The number of seconds that each scroll animation should last (defaults to .35).
     * Only applies when {@link #Ext.ux.layout.Carousel-animScroll} = true.
     */
    scrollDuration : .35,
    /**
     * @cfg {Boolean} animScroll True to animate tab scrolling so that hidden items slide smoothly into view (defaults
     * to true).  Only applies when {@link #Ext.ux.layout.Carousel-enableTabScroll} = true.
     */
    animScroll : true,

    /**
     * @cfg {Boolean} chunkedScroll To control scrolling more than one image at a time
     */

    chunkedScroll: false,

    /**
     * @cfg {Boolean} pageScroll Scroll full pages
     */
	pagedScroll: false, 

    /**
     * @cfg {Boolean} loopCount This does an intro page loop this many times after render
     */
    loopCount: 0,
    /**
     * @cfg {Boolean} loopPictureDelay This controls the delay on each picture during the intro page loop
     */
    loopPictureDelay: 5,

    // private
    monitorResize: true,
    
    /**
     * @cfg scrollButtonPosition (split or right) This determines where the scroll bar buttons will be. Matching style elements need to be in place.
     */
    scrollButtonPosition: 'right',



    loopImages: function(){
    	    	
	    if (this.loopCount <= 0){ return }
	    
        var s = this.getScrollTo(1);
        if (s) {
            s = Math.min(this.getMaxScrollPos(), s);
            if(s != this.getScrollPos()) {
                this.scrollTo(s);
            }else{
            	return; /*it should not get here*/
            }
        }else{
            this.scrollTo(0);
    		this.loopCount--;
	    	if (this.loopCount <= 0){ return }
        }
    	    	
    	this.loopImages.defer(this.loopPictureDelay * 1000, this);
    },


    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.scrollWrap){
            this.scrollWrap = target.createChild({
                cls: 'x-carousel-layout',
                cn: [
                {
                    tag: this.scrollElementTag || 'div',
                    cls: 'x-carousel-scroller',
                    cn: {
                        cls: 'x-carousel-body'
                    }
                }, {
                    cls: 'x-carousel-left-scrollbutton',
                    style: {
                        height: '100%'
                    }
                }, {
                    cls: 'x-carousel-right-scrollbutton',
                    style: {
                        height: '100%'
                    }
                }]
            });

//          Add the class that defines element positions
            this.scrollWrap.addClass('x-scroll-button-position-' + this.scrollButtonPosition);

            this.scrollLeft = this.scrollWrap.child('.x-carousel-left-scrollbutton');
            this.scrollRight = this.scrollWrap.child('.x-carousel-right-scrollbutton');
            this.scroller = this.scrollWrap.child('.x-carousel-scroller');
            this.strip = this.scroller.child('.x-carousel-body');
            
            if (this.pagedScroll) {
                this.scrollLeft.on('click',this.onScrollLeftClick, this);
                this.scrollRight.on('click',this.onScrollRightClick, this);
            } else {
                this.leftRepeater = new Ext.util.ClickRepeater(this.scrollLeft, {
                    interval : this.pagedScroll ? 10000 : this.scrollRepeatInterval,
                    delay: 0,
                    handler: this.onScrollLeftClick,
                    scope: this
                });
                this.rightRepeater = new Ext.util.ClickRepeater(this.scrollRight, {
                    interval : this.pagedScroll ? 10000 : this.scrollRepeatInterval,
                    delay: 0,
                    handler: this.onScrollRightClick,
                    scope: this
                });
            }
            this.renderAll(ct, this.strip);
        }
        this.scroller.setWidth(this.container.getLayoutTarget().getWidth() - (this.scrollLeft.getWidth() + this.scrollRight.getWidth() + this.marginScrollButtons));
        this.updateScrollButtons.defer(10, this);
        
        
    	if (this.loopCount > 0 && (this.chunkedScroll || this.pagedScroll) && !this.startedLoop){ 
    		this.startedLoop=true; /*this var is important since onLayout can be called more than once*/
	    	this.loopImages.defer(this.loopPictureDelay * 1000, this);
    	}

    },

    // private
    renderItem : function(c, position, target){
        if(c) {
            if (c.initialConfig) {
                if (c.rendered){
                    if(typeof position == 'number'){
                        position = target.dom.childNodes[position];
                    }
                    target.dom.insertBefore(c.getEl().dom, position || null);
                } else {
                    c.render(target, position);
                }
            } else if (c instanceof Ext.Element) {
                c.el = c;
                if(typeof position == 'number'){
                    position = target.dom.childNodes[position];
                }
                target.dom.insertBefore(c.dom, position || null);
            }
        }
        c.el.addClass('x-carousel-item');
    },

    // private
    onResize : function(c, position, target){
        Ext.ux.layout.Carousel.superclass.onResize.apply(this, arguments);
        if (Ext.isIE) {
            this.scrollLeft.setHeight(this.scroller.getHeight());
            this.scrollRight.setHeight(this.scroller.getHeight());
        }

		this.setItemsEdges();

//      If width increase has introduced spare space to the right, close it up.
        var r = this.getMaxScrollPos();
        if (this.getScrollPos() > r) {
            this.scrollTo(r);
        }
        

    },

	setItemsEdges:function(){
//      Register strip-relative left/right edges for easy chunked scrolling
        var stripLeft = this.strip.getLeft();
        var t = this.container.items.items;
        var lt = t.length;
        for (var i = 0; i < lt; i++) {
            var c = t[i];
            var e = c.el;
            var b = e.getBox();
            var l = b.x - stripLeft;
            var r = b.right - stripLeft;

//          "left" is the leftmost visible pixel.
//          "leftAnchor" is the postition to scroll to to bring the
//          item correctly into view with half the inter-item gap visible.
//          Same principle applies to "right"
            c.edges = {
                left: l,
                leftAnchor: l,
                right: r,
                rightAnchor: r
            };

//          Adjust anchors to be halfway between items.
            if (i == 0) {
                e.setStyle({'margin-left': '0px'});
            } else {
                if (i == t.length - 1) {
                    e.setStyle({'margin-right': '0px'});
                }
                var prev = t[i - 1];
                var halfGap = ((l - prev.edges.right) / 2);
                prev.edges.rightAnchor += halfGap;
                c.edges.leftAnchor -= halfGap;
            } 
        }

//      Work out average item width
        this.itemWidth = t[lt - 1].edges.rightAnchor / lt;
		
	},
    getNextOnLeft: function() {
        var t = this.container.items.items;
        if (t.length) {
            for (var i = t.length - 1; i > -1; i--) {
                if (t[i].edges.left < this.getScrollPos()) {
                    return t[i];
                }
            }
        }
    },

    getNextOnRight: function() {
        var t = this.container.items.items;
        if (t.length) {
            var scrollRight = this.scroller.dom.scrollLeft + this.getClientWidth();
            for (var i = 0, l = t.length; i < l; i++) {
                if (t[i].edges.right > scrollRight) {
                    return t[i];
                }
            }
        }
    },

/**
 *  Called when a click event is fired by the right scroll button.
 *  May also be used to programatically trigger a right scroll event.
 */

    onScrollRightClick : function(){
        this.loopCount=0;
        var s = this.getScrollTo(1);
        if (s) {
            s = Math.min(this.getMaxScrollPos(), s);
            if(s != this.getScrollPos()) {
                this.scrollTo(s);
            }
        }
    },

/**
 *  Called when a click event is fired by the right scroll button.
 *  May also be used to programatically trigger a left scroll event.
 */

    onScrollLeftClick : function(){
        this.loopCount=0;
        var s = Math.max(0, this.getScrollTo(-1));
        if(s != this.getScrollPos()) {
            this.scrollTo(s);
        }
    },

    // private
    scrollTo : function(pos){

//      Calculate scroll duration based on how far we have to scroll.
        if (this.scrollAnimationConfig) {
            var distance = Math.abs(this.getScrollPos() - pos);
            this.scrollAnimationConfig.duration = this.scrollDuration * (distance / this.itemWidth);
        }

        this.scroller.scrollTo('left', pos, this.scrollAnimationConfig);

//      Scroll animation will have called this in its callback.
        if(!this.scrollAnimationConfig){
            this.updateScrollButtons();
        }
    },

    // private
    updateScrollButtons : function(){
        var pos = this.getScrollPos();
        this.scrollLeft[(pos == 0) ? 'addClass' : 'removeClass']('x-tab-scroller-left-disabled');
        this.scrollRight[(pos >= this.getMaxScrollPos()) ? 'addClass' : 'removeClass']('x-tab-scroller-right-disabled');
    },

    getScrollWidth : function(){
        var t = this.container.items.items;

        if (t.length && ! t[0].edges){
        	this.setItemsEdges();
        }

        return t.length ? t[t.length - 1].edges.rightAnchor : 0;
    },

    // private
    getScrollPos : function(){
        return this.scroller.dom.scrollLeft || 0;
    },

    getMaxScrollPos: function() {
        return this.getScrollWidth() - this.getClientWidth();
    },

    // private
    getClientWidth : function(){
        return this.scroller.dom.clientWidth || 0;
    },

    // private
    getScrollTo : function(dir){
        var pos = this.getScrollPos();

        if (this.chunkedScroll || this.pagedScroll) {
//          -1 for left, 1 for right
            if (dir == -1) {
                var nextLeft = this.getNextOnLeft();
                if (nextLeft) {
                    if (this.pagedScroll) {
                        return nextLeft.edges.rightAnchor - this.getClientWidth();
                    } else {
                        return nextLeft.edges.leftAnchor;
                    }
                }
            } else {
                var nextRight = this.getNextOnRight();
                if (nextRight) {
                    if (this.pagedScroll) {
                        return nextRight.edges.leftAnchor;
                    } else {
                        return (nextRight.edges.rightAnchor - this.getClientWidth());
                    }
                }
            }
        } else {
            return (dir == -1) ? pos - this.scrollIncrement : pos + this.scrollIncrement;
        }
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

});

Ext.Container.LAYOUTS['carousel'] = Ext.ux.layout.Carousel;
