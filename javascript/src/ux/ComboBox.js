Ext.namespace( "Ozone.form");

Ozone.form.ComboBox = Ext.extend(Ext.form.ComboBox, {

	//Modify Ext.form.ComboBox::doQuery to query queryField instead of displayField
    doQuery : function(q, forceAll){
		if(Ext.isEmpty(this.queryField)) this.queryField = this.displayField;
		if(q === undefined || q === null){
            q = '';
        }
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery !== q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.queryField, q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();
            }
        }
    },
    
	//Modify Ext.form.ComboBox::onTypeAhead to use queryField instead of displayField
    onTypeAhead : function(){
		if(Ext.isEmpty(this.queryField)) this.queryField = this.displayField;
        if(this.store.getCount() > 0){
            var r = this.store.getAt(0);
            var newValue = r.data[this.queryField];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if(selStart != len){
                this.setRawValue(newValue);
                this.selectText(selStart, newValue.length);
            }
        }
    },
    assertValue : function() {
      var val = this.getRawValue();
      var rec = null;

      if (this.value && this.valueField) {
         //find rec based on value
         var r = this.findRecord(this.valueField, this.value);

         //if the displayField matches then we know the value is correct so set the rec
         if (val == r.get(this.displayField)) {
           rec = r;
         }
      }

      //if an appropriate rec is not found with the value then just check against the displayField
      if (!rec) {
        //find rec based on displayfield
        rec = this.findRecord(this.displayField, val);
      }

      if (!rec && this.forceSelection) {
        if (val.length > 0 && val != this.emptyText) {
          this.el.dom.value = Ext.value(this.lastSelectionText, '');
          this.applyEmptyText();
        }
        else {
          this.clearValue();
        }
      }
      else {
        if (rec) {
          if (val == rec.get(this.displayField) && this.value == rec.get(this.valueField)) {
            return;
          }
          val = rec.get(this.valueField || this.displayField);
        }
        this.setValue(val);
      }
    },
  
    //Modify Ext.form.ComboBox::setValue to use queryField instead of displayField
	setValue : function(v){
    	if(Ext.isEmpty(this.queryField)) this.queryField = this.displayField;
    	var text = v;
    	if(this.valueField){
    	   var r = this.findRecord(this.valueField, v);
           if(r){
               text = r.data[this.queryField];
           }else if(this.valueNotFoundText !== undefined){
               text = this.valueNotFoundText;
           }
    	}
    	this.lastSelectionText = text;
    	if(this.hiddenField){
           this.hiddenField.value = v;
    	}
    	Ext.form.ComboBox.superclass.setValue.call(this, text);
    	this.value = v;
	},

	//There's a bug in Ext.form.ComboBox::restrictHeight -- it assumes that property shadow : true
	restrictHeight : function(){
	    this.innerList.dom.style.height = '';
	    var inner = this.innerList.dom;
	    var pad = this.list.getFrameWidth('tb')+(this.resizable?this.handleHeight:0)+this.assetHeight;
	    var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
	    var ha = this.getPosition()[1]-Ext.getBody().getScroll().top;
	    var hb = Ext.core.Element.getViewportHeight()-ha-this.getSize().height;
	    var space = Math.max(ha, hb, this.minHeight || 0)-pad-2;
	    
	    /** BUG FIX **/
	    if ((this.shadow != undefined) && (this.shadow != false)) { space-=this.list.shadow.offset; }
	    
	    h = Math.min(h, space, this.maxHeight);
	    
	    if(Ext.isIE && inner.scrollWidth > inner.offsetWidth) {
	    	h += 20;
    	}
	    
	    this.innerList.setHeight(h + 2);
	    this.list.beginUpdate();
	    this.list.setHeight(h+pad);
	    this.list.alignTo(this.el, this.listAlign);
	    this.list.endUpdate();
	}
});