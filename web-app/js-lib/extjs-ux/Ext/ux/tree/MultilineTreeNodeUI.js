Ext.ns('Ext.ux.tree');

/**
* This uiProvider adds multi-line tree node support.
* <br><br><b>Usage:<b><br>
* <br>
* <b>Implement these styles on your page:</b><br />
* <div style="margin:20px; margin-top:5px;" class="codeblock">
* 	<pre dir="ltr">        .x-tree-multiline-node-expanded .x-tree-elbow-line-multiline-expanded {
*         	background-image: url(/<span style="color:#000080">&lt;YOUR EXT AREA&gt;</span>/resources/images/default/tree/elbow-line.gif);
*         }
*         
*         .x-tree-multiline-node-collapsed .x-tree-elbow-line-multiline-expanded {
*         	background-image: none;
*         }
*         
*         .x-tree-multiline-node-details {
*             ANY: 'property you want to set for the look of your control';
*         }</pre>
* </div>Where <b>x-tree-multiline-node-details</b> is the class that controls how the extra lines will look.<br />
* <br />
* <b>In your code:</b><br />
* If you want to include more lines in a node then you provide ...<br />
* 1) details: an array of strings to add<br />
* 2) uiProvider:  Ext.ux.tree.MultilineTreeNodeUI<br />
* <br />
* <b>Example</b><br />
* <div style="margin:20px; margin-top:5px;" class="codeblock">
* 	<pre dir="ltr">... in your node ...
*           details   : ['Some more text...','And more text...'],
*           uiProvider: Ext.ux.tree.MultilineTreeNodeUI,
* ... in your node continued ...</pre>
* 
* <br>
* <br>Demo link: <a href="http://extjs-ux.org/repo/authors/JosephFrancis/trunk/Ext/ux/tree/examples/multiline-tree-nodes.html">here</a>
* <br>
* <br>
* @class Ext.ux.tree.MultilineTreeNodeUI
* @extends Ext.tree.TreeNodeUI
* @author Lars Dittrich (<a href="http://www.extjs.com/forum/member.php?u=41094">Adversus</a>)   (published by Joseph Francis <a href="http://www.extjs.com/forum/member.php?u=2345">Joe</a>)
* @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
* @version 1.00 - March 26, 2009
*/

Ext.ux.tree.MultilineTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    //private
    renderElements: function(n, a, targetNode, bulkRender) {

        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = typeof a.checked == 'boolean';

        var href = a.href ? a.href : Ext.isGecko ? "" : "#";
        var buf =
            ['<li class="x-tree-node ' + ((this.node.ownerTree.lines == false || this.node.ownerTree.useArrows) ? 'x-tree-multiline-node-collapsed' : 'x-tree-multiline-node-expanded') + '"><div ext:tree-node-id="', n.id, '" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls, '" unselectable="on">',
            '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " " + a.iconCls : ""), '" unselectable="on" />',
            cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
            '<a hidefocus="on" class="x-tree-node-anchor" href="', href, '" tabIndex="1" ',
             a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", '><span unselectable="on">', n.text, "</span></a>"].join('');

        if (n.attributes.details) {
            for (var x = 0; x < n.attributes.details.length; x++) {

                buf += ["<br/>",
                        '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
                        (!n.nextSibling && n.hasChildNodes()) ? '<span style="margin-left: 16px;"></span>' : '',
                        n.nextSibling ? '<img src="' + this.emptyIcon + '" class="x-tree-ec-icon x-tree-elbow-line" />' : '',
                        (n.hasChildNodes()) ? '<img src="' + this.emptyIcon + '" class="x-tree-ec-icon x-tree-elbow-line-multiline-expanded" style="margin-right: 2px;"/>' : '<span style="margin-left: 16px;"></span>',
                        (n.isLast() && !n.isExpandable()) ? '<span style="margin-left: 16px;"></span>' : '',
                        '<span class="x-tree-multiline-node-details">' + n.attributes.details[x] + '</span>'].join('');

            }
        }
        buf += ["</div>",
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"].join('');

        var nel;
        if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if (cb) {
            this.checkbox = cs[3];

            this.checkbox.defaultChecked = this.checkbox.checked;
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    },

    //private
    updateExpandIcon: function() {

        if (this.rendered) {
            var n = this.node, c1, c2;
            var cls = n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
            if (n.isExpandable()) {
                if (n.expanded) {
                    Ext.fly(this.elNode).replaceClass('x-tree-multiline-node-collapsed', 'x-tree-multiline-node-expanded');
                    cls += "-minus";
                    c1 = "x-tree-node-collapsed";
                    c2 = "x-tree-node-expanded";
                } else {
                    Ext.fly(this.elNode).replaceClass('x-tree-multiline-node-expanded', 'x-tree-multiline-node-collapsed');
                    cls += "-plus";
                    c1 = "x-tree-node-expanded";
                    c2 = "x-tree-node-collapsed";
                }
                if (this.wasLeaf) {
                    this.removeClass("x-tree-node-leaf");
                    this.wasLeaf = false;
                }
                if (this.c1 != c1 || this.c2 != c2) {
                    Ext.fly(this.elNode).replaceClass(c1, c2);
                    this.c1 = c1; this.c2 = c2;
                }
            } else {
                if (!this.wasLeaf) {
                    Ext.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
                    delete this.c1;
                    delete this.c2;
                    this.wasLeaf = true;
                }
            }
            var ecc = "x-tree-ec-icon " + cls;
            if (this.ecc != ecc) {
                this.ecNode.className = ecc;
                this.ecc = ecc;
            }
        }
    }
});
