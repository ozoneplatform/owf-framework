/**
 * this is a tree column that does not have any icons
 */
Ext.define('Ozone.components.tree.SimpleTreeColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.simpletreecolumn',

    initComponent: function() {
        var origRenderer = this.renderer || this.defaultRenderer,
            origScope    = this.scope || window;

        this.renderer = function(value, metaData, record, rowIdx, colIdx, store, view) {
            var buf   = [],
                format = Ext.String.format,
                depth = record.getDepth(),
                treePrefix  = Ext.baseCSSPrefix + 'tree-',
                elbowPrefix = treePrefix + 'elbow-',
                expanderCls = treePrefix + 'expander',
                imgText     = '<img src="{1}" class="{0}" />',
                checkboxText= '<input type="button" role="checkbox" class="{0}" {1} />',
                formattedValue = origRenderer.apply(origScope, arguments),
                href = record.get('href'),
                target = record.get('hrefTarget'),
                cls = record.get('cls');

            while (record) {
                if (!record.isRoot() || (record.isRoot() && view.rootVisible)) {
                    if (record.getDepth() === depth) {
//                        buf.unshift(format(imgText,
//                            treePrefix + 'icon ' +
//                            treePrefix + 'icon' + (record.get('icon') ? '-inline ' : (record.isLeaf() ? '-leaf ' : '-parent ')) +
//                            (record.get('iconCls') || ''),
//                            record.get('icon') || Ext.BLANK_IMAGE_URL
//                        ));
//                        if (record.get('checked') !== null) {
//                            buf.unshift(format(
//                                checkboxText,
//                                (treePrefix + 'checkbox') + (record.get('checked') ? ' ' + treePrefix + 'checkbox-checked' : ''),
//                                record.get('checked') ? 'aria-checked="true"' : ''
//                            ));
//                            if (record.get('checked')) {
//                                metaData.tdCls += (' ' + treePrefix + 'checked');
//                            }
//                        }
//                        if (record.isLast()) {
//                            if (record.isExpandable()) {
//                                buf.unshift(format(imgText, (elbowPrefix + 'end-plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
//                            } else {
//                                buf.unshift(format(imgText, (elbowPrefix + 'end'), Ext.BLANK_IMAGE_URL));
//                            }
//
//                        } else {
//                            if (record.isExpandable()) {
//                                buf.unshift(format(imgText, (elbowPrefix + 'plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
//                            } else {
//                                buf.unshift(format(imgText, (treePrefix + 'elbow'), Ext.BLANK_IMAGE_URL));
//                            }
//                        }
                    }
                    else {
//                        if (record.isLast() || record.getDepth() === 0) {
                            buf.unshift(format(imgText, (elbowPrefix + 'empty'), Ext.BLANK_IMAGE_URL));
//                        } else if (record.getDepth() !== 0) {
//                            buf.unshift(format(imgText, (elbowPrefix + 'line'), Ext.BLANK_IMAGE_URL));
//                        }
                    }
                }
                record = record.parentNode;
            }
            if (href) {
                buf.push('<a href="', href, '" target="', target, '">', formattedValue, '</a>');
            } else {
                buf.push(formattedValue);
            }
            if (cls) {
                metaData.tdCls += ' ' + cls;
            }
            return buf.join('');
        };
        this.callParent(arguments);
    },

    defaultRenderer: function(value) {
        return value;
    }
});
