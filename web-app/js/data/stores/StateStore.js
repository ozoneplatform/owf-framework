Ext.define('Ozone.data.StateStore',{
    extend:'Ext.data.Store',
    model:'Ozone.data.State',
    proxy:{
        type:'ajax',
        url:Ozone.util.contextPath() + '/dashboard'
    },

    findByReceiveIntent: function (intent) {
        return _.filter(this.data.items, function (state) {
            
            if(!intent.dataType) {
                return false;
            }

            var intents = state.get('intents'),
                found = false;

            _.each(intents.receive, function (componentIntent) {
                if(componentIntent.action === intent.action) {
                    _.each(componentIntent.dataTypes, function (dataType) {
                        if(dataType === intent.dataType) {
                            found = true;
                        }
                    })
                }
            });

            return found;

        });
    }

});