/*(c) Copyright 2008 Licensed under LGPL3. See details below*/
/**
 *  Insert a placeholder into the document where the Field will be inserted later.
 */
Ext.util.Format.field = function(fld) {
    return '<span id="' + (fld.name || fld.id) + '-tpl-wrap"></span>'
};

Ext.namespace('Ext.ux.layout');

/**
 * Template Layout.
 * <br>
 * <br>See the following for a <a href="http://extjs-ux.org/repo/authors/jerrybrown5/trunk/Ext/ux/layout/Template/Demo.html">demo</a>
 * <br>
 * <br> Example Usage
 * <pre>    
 * layout: '<b>template</b>',
 * tpl: '&lt;table&gt;' + 
 *     '&lt;tr&gt;&lt;td&gt;Name (First/Last)&lt;/td&gt;&lt;td&gt;{first:field} &nbsp; {last:field}&lt;/td&gt;&lt;/tr&gt;' +
 *     '&lt;tr&gt;&lt;td&gt;{[values.company.fieldLabel]}&lt;/td&gt;&lt;td&gt;{company:field}&lt;/td&gt;&lt;/tr&gt;' +
 *     '&lt;tr&gt;&lt;td&gt;Email&lt;/td&gt;&lt;td&gt;{email:field}&lt;/td&gt;&lt;/tr&gt;' +
 *     '&lt;tr&gt;&lt;td&gt;Time&lt;/td&gt;&lt;td&gt;{time:field}&lt;/td&gt;&lt;/tr&gt;' +
 *     '&lt;/table&gt;',
 * defaults: {width: 230},
 * defaultType: 'textfield',
 * items: [{
 *         fieldLabel: 'First Name',
 *         name: 'first',
 *         allowBlank:false
 *     },{
 *         fieldLabel: 'Last Name',
 *         name: 'last'
 *     },{
 *         fieldLabel: 'Company',
 *         name: 'company'
 *     }, {
 *         fieldLabel: 'Email',
 *         name: 'email',
 *         vtype:'email'
 *     }, new Ext.form.TimeField({
 *         fieldLabel: 'Time',
 *         name: 'time',
 *         minValue: '8:00am',
 *         maxValue: '6:00pm'
 *     })
 * ]
 * </pre>    
 * @class Ext.ux.layout.Template
 * @author Nigel White aka Animal; updated by Jerry Brown
 * @license Ext.ux.layout.Template is licensed under the terms of
 * the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission. 
 * @version 0.2
 */
Ext.ux.layout.Template = Ext.extend(Ext.layout.ContainerLayout, {

    /**
     * @cfg {String} tpl Use arbitrary html to place fields in this container. You can override this in the beforeRender Event. See the above example for more information. 
     */


    tpl: undefined,


    setContainer : function(ct){
        Ext.ux.layout.Template.superclass.setContainer.apply(this, arguments);
        ct.el.addClass('x-form-template-layout');
    },

    renderAll : function(ct, target){
        var it = ct.items.items;

//		this allows a beforeRender event to change the tpl		
        if (!this.tpl) {
            this.tpl = ct.tpl;
        }
        if (typeof this.tpl == 'string') {
            this.tpl = new Ext.XTemplate(this.tpl);
        }

//      Create the templated output. Fields are represented by
//      spans before which they are then rendered.
        var fields = {};
        for (var i = 0, l = it.length; i < l; i++) {
            var fld = it[i];
            fields[fld.name || fld.id] = fld;
        }
        this.tpl.overwrite(ct.body, fields);

//      Render the fields before the spans.
//      If they have already been rendered, the field's "el" will
//      be re-inserted if the rendered flag is cleared.
//      Remove each field's span once the field has been rendered.
        for (var i = 0, l = it.length; i < l; i++) {
            var fld = it[i];
            fld.rendered = false; 
            
			/*...each field that will be displayed is going to get rendered twice...just need to deal with it..
			  ...fields that are not in the tpl will not get rendered...
			*/

            var pos = Ext.getDom((fld.name || fld.id) + '-tpl-wrap');
            if (pos){
	            fld.render(pos.parentNode, pos);
	            Ext.fly(pos).remove();
	        }
        }
    }
});
Ext.Container.LAYOUTS['template'] = Ext.ux.layout.Template;
