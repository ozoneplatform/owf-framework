Ext.define('Ozone.components.dashboarddesigner.Pane', {
    extend: 'Ext.container.Container',
    alias: [
        'widget.dashboarddesignerpane',
        'widget.Ozone.components.dashboarddesigner.Pane'
    ],

    layout: {
        type: 'fit'
    },
    componentCls: 'dashboarddesignerpane droppable',

    paneType: null,
    
    initComponent: function() {

        if(this.htmlText)
            this.html = '<h3>' + Ext.htmlEncode(this.htmlText) + '</h3>';
        
        if(this.paneType)
            this.componentCls += " " + this.paneType;

        this.listeners = {
            afterrender: {
                fn: this.onAfterPaneRender,
                scope: this
            },
            destroy: function() {
                this.el.removeAllListeners();
            }
        };

        this.addEvents(
            'paneselect'
        );
        this.enableBubble(['paneselect']);

        this.callParent(arguments);
    },

    getBubbleTarget : function() {
        return this.up('dashboarddesignerworkingarea');
    },
    
    onAfterPaneRender: function() {
        var me = this,
            showFocus = true;

        this.textEl = this.el.down('h3');
        
        this.el.set({
            tabIndex: 0
        });
                
        this.el.on({
            mousedown: function() {
                showFocus = false;
            },
            mouseup: function() {
                showFocus = true;
            },
            focus: function(evt, dom) {
                if(showFocus)
                    Ext.fly(dom).addCls('highlight-dashboard-designer-drop');
            },
            blur: function(evt, dom) {
                if(showFocus)
                    Ext.fly(dom).removeCls('highlight-dashboard-designer-drop');
            },
            click: me.showBoxLayout,
            scope: me
        });

        if(this.textEl)
            this.enableEditing();   
    },

    showBoxLayout: function(evt, dom) {
        this.fireEvent('paneselect', this);
    },

    onKeyUp: function(evt, dom) {
        if(evt.getKey() === Ext.EventObject.ENTER && dom.nodeName !== 'INPUT') {
            this.fireEvent('paneselect', this);
            this.disableEditing();
            this.startEdit(evt, this.textEl);
        }
    },

    enableEditing: function() {
        if(this._editingEnabled || !this.textEl)
            return;

        this.el.on('dblclick', this.startEdit, this, {delegate: 'h3'});
        this.el.on('keyup', this.onKeyUp, this);

        this._editingEnabled = true;
    },

    disableEditing: function() {
        this.el.un('dblclick', this.startEdit, this, {delegate: 'h3'});
        this.el.un('keyup', this.onKeyUp, this);

        this._editingEnabled = false;
    },

    startEdit: function(evt, target) {
        evt.stopEvent();

        this.editor = this.editor || new Ext.Editor({
            updateEl: true,
            shadow: false,
            floating: false,
            revertInvalid: false,
            field: {
                xtype: 'textfield',
                validator: function(newValue) {
                    var num = parseFloat(newValue);

                    if(isNaN(num)) {
                        return "Nice try! Invalid input, please enter a valid value. For example, 400px or 50%."
                    }

                    if(newValue.charAt(newValue.length-1) === "%") {
                        if(num <= 0) {
                            return "Width/Height of 0% or lower is not allowed";
                        }
                        else if(num >= 100) {
                            return "Width/Height of 100% or higher is not allowed";
                        }
                    }
                    else if(num < 36) {
                        return "Minimum width/height allowed is 36px";
                    }

                    return true;
                }
            },
            listeners: {
                complete: this.editComplete,
                canceledit: this.resetFocus,
                scope: this
            },
            parentEl: this.el
        });
        this.editor.startEdit(Ext.get(target));
    },

    editComplete: function(editor, newValue, oldValue) {
        var currentWidth = this.el.getWidth(),
            num = parseFloat(newValue),
            nextPane = this.getNextPane(),
            htmlText,
            isInHbox;
        
        if(newValue.charAt(newValue.length-1) === "%") {
            // percent
            this.initialConfig.flex = this.flex = num/100;

            htmlText = (100 - num) + '%';
            nextPane.initialConfig.flex = nextPane.flex = (100-num)/100;

            // dont update if sibling is doesn't have a textEl
            // sibling is a container with nested panes
            if(nextPane.textEl) {
                nextPane.textEl.update(htmlText);
            }

            this.initialConfig.htmlText = num + "%"; // for values such as 30%asfsdf
            nextPane.initialConfig.htmlText = htmlText;
        }
        else {
            //pixels
            delete this.initialConfig.flex;
            delete this.flex;

            isInHbox = this.ownerCt.initialConfig.layout && this.ownerCt.initialConfig.layout.type === "hbox";

            if(isInHbox) {
                this.initialConfig.width = num;
                this.width = num;
            }
            else {
                this.initialConfig.height = num;
                this.height = num;
            }

            this.initialConfig.htmlText = num + 'px';
            nextPane.initialConfig.htmlText = 'Variable';
            
            // dont update if sibling is doesn't have a textEl
            // sibling is a container with nested panes
            if(nextPane.textEl) {
                nextPane.textEl.update('Variable');
            }

            nextPane.initialConfig.flex = nextPane.flex = 1;
        }

        this.textEl.update(this.initialConfig.htmlText);
        
        this.up('container').doLayout();

        this.resetFocus();
    },

    resetFocus: function() {
        var me = this;

        // because Ext's Editor also has a defer of 10ms
        Ext.defer(function() {
            
            me.el.focus();

            me.enableEditing();

        }, 100);
    },

    getNextPane: function() {
            if (this.next() && this.next().next()) {
                return this.next().next();
            } else if (this.prev() && this.prev().prev()) {
                return this.prev().prev();
            }
            return null;
    }
});