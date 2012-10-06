/**
 * Uses the idProperty of the model to create ids
 */
Ext.define('Ozone.data.ModelIdGenerator', {
    extend: 'Ext.data.IdGenerator',
    alias: 'idgen.model',

    //overrideIdProperty: undefined,

    /**
     * @cfg {String} id
     * The id by which to register a new instance. This instance can be found using the
     * {@link Ext.data.IdGenerator#get} static method.
     */

    getRecId: function (rec) {
        var idField = this.overrideIdProperty || rec.idProperty;
        return rec.get(idField);
    },

    generate: function () {
        return null;
    }

});

