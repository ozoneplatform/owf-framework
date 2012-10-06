Ext.ns('Ext.ux.tree');
/**
* A control that allows an array to strings to updated by be user.  The order can be updated via arrow buttons or via drag/drop.
* New values can be added, the existing entries updated or removed.
* <br><br><b>Usage:<b><br>
* <br>
* <br>Use setList(Array) to set the list .. the user can modify .. then use getList to get the values back as an Array 
* <br>A toolbar with Add, Edit, Remove, Up and Down buttons provides standard functionality 
* <br>User can use drag/drop to re-order the list (standard Tree/TreePanel functionality). 
* <br>A single click of the selected item/node will activate edit mode (standard TreeEditor functionality). 
* <br>The icons, tooltips, button text and other options can be supplied as config options 
* <br>
* <br>Demo link: <a href="http://extjs-ux.org/repo/authors/JosephFrancis/trunk/Ext/ux/tree/examples/SelectionList.html">here</a>
* <br>Forum thread: <a href="http://www.extjs.com/forum/showthread.php?p=307490#post307490">here</a>
* <br>Any and all original code is made available as is for whatever purpose you see fit.
* <br>
* <br>Note that the code is provided as-is and has been tested against Ext-JS 2.2 
* <br>
* @class Ext.ux.tree.SelectionList
* @extends Ext.tree.TreePanel
* @author Joseph Francis (<a href="http://www.extjs.com/forum/member.php?u=2345">Joe</a>)
* @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
* @version 1.00 - March 23, 2009
*/

Ext.ux.tree.SelectionList = Ext.extend(Ext.tree.TreePanel, {
    //reconfigurables
    /**
    * @cfg {String} iconClsAdd iconCls define for the Add button.  (defaults to "")
    */
    iconClsAdd: '',
    /**
    * @cfg {String} iconClsRemove iconCls define for the Remove button.  (defaults to "")
    */
    iconClsRemove: '',
    /**
    * @cfg {String} iconClsEdit iconCls define for the Edit button.  (defaults to "")
    */
    iconClsEdit: '',
    /**
    * @cfg {String} iconClsUp iconCls define for the Up button.  (defaults to "")
    */
    iconClsUp: '',
    /**
    * @cfg {String} iconClsDown iconCls define for the Down button.  (defaults to "")
    */
    iconClsDown: '',
    /**
    * @cfg {String} iconClsEntry iconCls define for the existing tree view entries.  (defaults to "")
    */
    iconClsEntry: '',
    /**
    * @cfg {String} iconClsNewEntry iconCls define for the new tree view entries.  (defaults to "")
    */
    iconClsNewEntry: '',


    /**
    * @cfg {String} addText The text for the Add button.  (defaults to "Add")
    */
    addText: 'Add',
    /**
    * @cfg {String} editText The text for the Edit button.  (defaults to "Edit")
    */
    editText: 'Edit',
    /**
    * @cfg {String} removeText The text for the Remove button.  (defaults to "Remove")
    */
    removeText: 'Remove',
    /**
    * @cfg {String} upText The text for the Up button. Provide "" for no text (icon is needed if no text provided). (defaults to "Up")
    */
    upText: 'Up',
    /**
    * @cfg {String} downText The text for the Down button.  (defaults to "Down")
    */
    downText: 'Down',

    /**
    * @cfg {String} tooltipAdd The tooltip text for the Add button.  (defaults to "Add New Entry")
    */
    tooltipAdd: 'Add New Entry',
    /**
    * @cfg {String} tooltipEdit The tooltip text for the Edit button.  (defaults to "Edit Selected Item")
    */
    tooltipEdit: 'Edit Selected Item',
    /**
    * @cfg {String} tooltipRemove The tooltip text for the Remove button.  (defaults to "Remove Selected Item")
    */
    tooltipRemove: 'Remove Selected Item',
    /**
    * @cfg {String} tooltipUp The tooltip text for the Up button.  (defaults to "Move Selected Item Up")
    */
    tooltipUp: 'Move Selected Item Up',
    /**
    * @cfg {String} tooltipDown The tooltip text for the Down button.  (defaults to "Move Selected Item Down")
    */
    tooltipDown: 'Move Selected Item Down',

    /**
    * @cfg {Integer} width The control width.  (defaults to 300)
    */
    width: 300,

    /**
    * @cfg {Integer} height The control width.  (defaults to 200)
    */
    height: 200,

    /**
    * @cfg {Text} newEntryText The text to display in a newly created entry.  (defaults to "New Entry")
    */
    newEntryText: 'New Entry',
    /**
    * @cfg {Text} blankText The blankText to use for the Tree Editors. (defaults to "Blank entries are not allowed")
    */
    blankText: 'Blank entries are not allowed',
    /**
    * @cfg {Array} list The array of strings to initially load.  (defaults to undefined)
    */

    /**
    * @constructor
    * creates a new SelectionList
    * @name Ext.ux.tree.SelectionList
    * @methodOf Ext.ux.tree.SelectionList
    * @param {Object} config Configuration options
    */
    constructor: function(config) {
        var config = config || {};

        Ext.applyIf(this, config);

        Ext.applyIf(config, { animate: true,
            enableDD: true,
            lines: false,
            containerScroll: true,
            rootVisible: false,
            split: true,
            autoScroll: true,
            margins: '5 0 5 5'
        });

        Ext.ux.tree.SelectionList.superclass.constructor.call(this, config);
    },

    /**
    * Get the number of entries in the Selection List.
    * @return {integer} The total number of entries in the edit list.
    */
    getCount: function() {
        if (!this.root.childNodes) { return 0 };
        return this.root.childNodes.length
    },
    //private
    setEnabled: function(theCriteria, theObj) {
        theObj[(theCriteria) ? 'enable' : 'disable']();
    },
    //private
    selectionChanged: function(obj, node) {
        this.ge.completeEdit(false);
        for (aBtn in this.selButtons) {
            this.setEnabled(node, this.selButtons[aBtn]);
        };
        if (node) {
            if (node.isLast()) {
                this.setEnabled(false, this.btnDown);
            } else if (node.isFirst()) {
                this.setEnabled(false, this.btnUp);
            }
        }
    },
    //private
    initComponent: function() {
        if (!this.iconClsNewEntry && this.iconClsEntry) { this.iconClsNewEntry = this.iconClsEntry };
        this.btnAdd = new Ext.Toolbar.Button({
            text: this.addText,
            iconCls: this.iconClsAdd,
            tooltip: this.tooltipAdd,
            handler: this.addNew.createDelegate(this, [this.newEntryText])
        });
        this.btnRemove = new Ext.Toolbar.Button({
            text: this.removeText,
            iconCls: this.iconClsRemove,
            tooltip: this.tooltipRemove,
            disabled: true,
            handler: this.removeSelected.createDelegate(this)
        });
        this.btnEdit = new Ext.Toolbar.Button({
            text: this.editText,
            iconCls: this.iconClsEdit,
            tooltip: this.tooltipEdit,
            disabled: true,
            handler: this.editSelected.createDelegate(this)
        });
        this.btnUp = new Ext.Toolbar.Button({
            text: this.upText,
            iconCls: this.iconClsUp,
            tooltip: this.tooltipUp,
            disabled: true,
            handler: this.moveUp.createDelegate(this)
        });
        this.btnDown = new Ext.Toolbar.Button({
            text: this.downText,
            tooltip: this.tooltipDown,
            iconCls: this.iconClsDown,
            disabled: true,
            handler: this.moveDown.createDelegate(this)
        });
        this.selButtons = {
            btnRemove: this.btnRemove,
            btnEdit: this.btnEdit,
            btnDown: this.btnDown,
            btnUp: this.btnUp
        };

        this.tbar = new Ext.Toolbar({
            items: [this.btnAdd, this.btnRemove, this.btnEdit, this.btnUp, this.btnDown]
        })

        this.ge = new Ext.tree.TreeEditor(this, {
            allowBlank: false,
            completeOnEnter: true,
            blankText: this.blankText,
            selectOnFocus: true
        });


        this.root = new Ext.tree.TreeNode({
            text: 'List',
            allowDrag: false,
            allowDrop: true
        });

        Ext.ux.tree.SelectionList.superclass.initComponent.call(this);

        this.getSelectionModel().on('selectionchange', this.selectionChanged, this);

        if (this.list && Ext.isArray(this.list)) {
            this.loadList(this.list)
        }
    },
    /**
    * Returns the array of values = same as the getList method
    * @return {Array} An array of values found.  Returns array with count of zero if empty.
    */
    getList: function() {
        var myList = [];
        this.root.eachChild(
			function(theChild) {
			    myList.push(theChild.text);
			}
		)
        return myList;
    },
    /**
    * Clears the selection list.
    */
    clearList: function() {
        var myList = this.root.childNodes;
        var myCnt = myList.length;
        for (var i = 0; i < myCnt; i++) {
            this.root.removeChild(this.root.firstChild)
        }
    },
    /**
    * Loads the selection list.  Existing values are cleared.
    * @param {Array/String} An array of values to load or a string with a comma delim value.
    */
    loadList: function(values) {
        this.clearList();
        if (typeof (values) == 'string') {
            if (values == '') { return };
            this.loadList(values.split(','));
            return;
        };

        if (typeof (values.length) == 'undefined') { return };

        this.selectionList = values;

        for (var iVal = 0; iVal < values.length; iVal++) {
            var myConfig = {
                text: values[iVal],
                allowDrag: true,
                leaf: true,
                iconCls: this.iconClsEntry
            };
            this.root.appendChild(
				new Ext.tree.TreeNode(myConfig)
			);
        };
    },
    //private
    initEditor: function() {
    },
    //private
    editNode: function(node) {
        this.ge.editNode = node;
        this.ge.startEdit(node.ui.textNode);
    },
    /**
    * Adds a new value to the list.
    * @param {object} text The text to use.  (defaults to "New Entry")
    */
    addNew: function(text) {

        var text = text ? text : 'New Entry'
        var node = this.root.appendChild(
			new Ext.tree.TreeNode({
			    text: text,
			    allowDrag: true,
			    leaf: true,
			    iconCls: this.iconClsNewEntry
			})
        );

        this.getSelectionModel().select(node);
        this.editNode.defer(20, this, [node]);

    },
    //private
    moveNode: function(theNode, isUp) {
        var myPos = this.root.indexOf(theNode);
        myPos = isUp ? myPos - 1 : myPos + 1;
        var myReplace = this.root.item(myPos);
        if (isUp) {
            this.root.insertBefore(theNode, myReplace);
        } else {
            this.root.insertBefore(myReplace, theNode);
        };
        this.getSelectionModel().select(theNode);
        this.selectionChanged(this, theNode);
    },
    //private
    moveUp: function() {
        var mySel = this.getSelectionModel().getSelectedNode();
        if (!mySel) {
            alert('Select an entry to move.');
            return;
        };
        if (mySel.isFirst()) {
            alert('Can not move up anymore.');
            return;
        };
        this.moveNode(mySel, true);
    },
    //private
    moveDown: function() {
        var mySel = this.getSelectionModel().getSelectedNode();
        if (!mySel) {
            alert('Select an entry to move.');
            return;
        };
        if (mySel.isLast()) {
            alert('Can not move down anymore.');
            return;
        };
        this.moveNode(mySel, false);
    },
    //private
    removeSelected: function() {
        this.root.removeChild(this.getSelectionModel().getSelectedNode());
    },
    //private
    editSelected: function() {
        this.editNode(this.getSelectionModel().getSelectedNode());
    }


});
