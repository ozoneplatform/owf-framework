define([    
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    
    /*
     * This is the base class for a form element that is editable
     * For this to work it is assumed that the editable control is immediately preceded by the read only control.
     * 
     * As it turns out this is pretty specific to the applicationConfiguration stuff.  For now we can leave it here
     * as there are def pieces that could be leveraged (like enableCellEditing).
     * 
     * 
     */
    return Backbone.View.extend({
        
        _defaultImage: function(){
            return "../themes/common/images/agency/agencyDefault.png";
        },

        //Use value from input to update model and reset the form
        //Currently this takes the val and sets it in the model, we may want this to just take the model
        _saveStringApplicationConfig: function(e, val, callback, postSaveCallback){
            
            var me = this;
                
            //Capture the prior value in case of an error
            me.model.set({errors: null, saveSuccessful: null})
            me.model.capturePriorValue();
            me.model.set({value : val});

            //Do the save
            me.model.save(null, {
                success: function(model, response, xhr){
                    if(response.success == false){
                        //If there is a validation error then the code registeres there was a success
                        //but the message says otherwise (TODO maybe return a bad server code then move this to failure callback

                        me.model.resetValue();  //Reset the value in the model
                        me.model.set({errors: response.message, saveSuccessful: false});
                    } else {
                        me.model.set({errors: null, saveSuccessful: true});

                        if(typeof postSaveCallback === 'function' ){
                            postSaveCallback(response);
                        }
                    }
                    me.model.trigger("postSave");
                }
            });
                        
            if(typeof callback === 'function' ){
                callback();
            }
        }
    });
});