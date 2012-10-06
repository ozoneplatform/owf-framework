Ext.namespace('Ext.fc');
/**
 * A form field to upload and preview uploaded files<br>
 * <h2>Features</h2>
 * <ul>
 *    <li>Preview uploaded Images, Flash Files, and Regular Files</li>
 *    <li>Styled input field - <em>get rid of those ugly input fields</em></li>
 *    <li>Compact size  - <em>only occupies the space of a standard text box when closed</em></li>
 *    <li>Delete File callback - <em>useful in forms so you can delete a file without replacing it </em></li>
 *    <li>Only shows the file name, not the complete path</li>
 *    <li>FakeFileName <em>- you can have your file with and unique name (345653456765456.jpg) and show as if it was 'Garden.jpg'</em></li>
 *    <li>Great for forms and cms</li>
 * </ul>
 *
 * 
 * @class Ext.fc.mediaField
 * @version    0.1
 * @author     Nuno Costa - sven@francodacosta.com
 * @copyright  Copyright (c) 2009
 * @license    GPL v3 - http://www.gnu.org/licenses/gpl-3.0.html
 * @link       http://www.francodacosta.com/extjs/mediafield
 * @since      2009-01-28
 */

Ext.fc.MediaField  = function(config){
	defaults = {
		/**
		 * @cfg: {boolean} showDele : it true show the delete file button
		 */
		showDelete: false
		/**
		 * @cfg: {String} value : the file url
		 */
		,value: false
		/**
		 * @cfg: {integer} mediaWidth : it true show the delete file button
		 */
		,mediaWidth: 0
		/**
		 * @cfg: {integer} mediaHeight : it true show the delete file button
		 */
		,mediaHeight: 0
		,deleteTooltip : 'Delete file'
		,previewCloseTooltip : 'Hide preview'
		,previewOpenTooltip  : 'Show preview'
		,baseClass : ''
		,fileSize: ''
	};
	Ext.fc.MediaField.superclass.constructor.call(this, Ext.apply({}, config, defaults));
}

Ext.extend(Ext.fc.MediaField ,Ext.form.TextField, {
	
	setValue: function (value){
		if(value)
			this.txtField.dom.value = this.formatValue(value);
	}

	,formatValue : function(value){
		return value.replace(/.*[\/|\\]/,'');
	}
	
	,initValue: function(){
		this.setValue(this.fakeFileName || this.value);
	}
	
	,onRender: function(ct, position){
		Ext.QuickTips.init(); //should it be here ?
    	Ext.fc.MediaField.superclass.onRender.call(this, ct, position);
    	
    	//create main container
    	var container = ct.createChild({
    			'tag'   : 'div',
    			'class' : this.baseClass + ' mf-container'
		});
    	
    	var inputFieldContainer = container.createChild({
			'tag' : 'div'
			,'class' : 'mf-inputFieldContainer'
    	});
    	
    	//insert text box
    	var txt = ct.select('input.x-form-text').item(0);
    	txt.addClass('mf-text');
    	inputFieldContainer.appendChild(txt);
    	
    	//browse ...
    	var uploadLink = inputFieldContainer.createChild({
			'tag'   : 'a',
			'class' : 'mf-upload'
    	});
    	
    	//delete, only show if value exists and showDelete = true
    	if ( (this.showDelete != false) && ( (this.value != '' ) && (this.value != false) )	){
	    	var deleteLink = container.createChild({
				'tag'   : 'a'
				,'class' : 'mf-delete'
	    	});
	    	deleteLink.addClassOnOver('mf-delete-over');
	    	deleteLink.addClassOnClick('mf-delete-down');
	    	
	    	Ext.QuickTips.register({
				target:  deleteLink                   
				,text: this.deleteTooltip
				,enabled: true
			});
	    	
	    	deleteLink.on('click', function(){
	    		this.fireEvent('delete', this) ;
	    	}, this);
    	}
    	
    	//preview
    	if( (this.value != '' ) && (this.value != false) ){
    		//preview link
	    	var previewLink = container.createChild({
					'tag'   : 'a',
					'class' : 'mf-preview'
		    	});
	    		previewLink.addClassOnOver('mf-preview-over');
		    	previewLink.addClassOnClick('mf-preview-down');
	    	
	    		Ext.QuickTips.register({
					target:  previewLink                   
					,text: this.previewOpenTooltip
					,enabled: true
				});
	    		
	    		previewLink.on('click', function(){
	        		this.tooglePreview();
	        	}, this);
		    	
	    	//preview content
	    		var previewContainer = container.createChild({
	        		'tag' : 'div'
	        		,'class' : 'mf-preview-container'
	        	});
	
	        	this.drawMediaPreview(this.getFileType(), previewContainer);
	        	
    	}// preview
	    	
	    	
	    //public values
    	this.txtField = txt ;
    	this.container = container ;
    	this.uploadLink = uploadLink ;
    	this.inputFieldContainer = inputFieldContainer ;
    	if(previewLink) this.previewLink = previewLink ;
    	if(deleteLink)  this.deleteLink = deleteLink;
    	if(previewContainer) this.previewContainer = previewContainer ;
    	
    	//hidden input box
    	this.drawInputBox();
	}
	
	/*
	 * resets fields, delete, preview Link and media preview will be hidden, file was deleted
	 * so no reason to have those itens visible  
	 */
	,clearFields: function(){
		if (this.previewContainer.getStyles('display').display != 'none')
			this.tooglePreview() ;
		
		if(this.previewLink) this.previewLink.setStyle({'display' : 'none'});
		if(this.deleteLink) this.deleteLink.setStyle({'display' : 'none'});
		this.txtField.dom.value = '';
		//remove and recreate the hidden input field, in order to clear its value
		this.inputField.remove();
		this.drawInputBox();
	}
	
	/*
	 * Draws the hidden input box and positions it above the fake field
	 */
	,drawInputBox: function(){
    	var inputField = this.inputFieldContainer.createChild({
			'tag'   : 'input'
			,'type'  : 'file'
			,'style' : 'opacity: 0; filter:alpha(opacity=0);'
			,'class'  : 'mf-inputField'
			,'name' : this.name
    	});
		
    	// some style functions
    	inputField.on('mouseover', function(){
    		this.uploadLink.addClass('mf-upload-over');
    		this.uploadLink.removeClass('mf-upload-down');
    	}, this);
    	inputField.on('mouseout', function(){
    		this.uploadLink.removeClass('mf-upload-over');
    		this.uploadLink.removeClass('mf-upload-down');
    	}, this);
    	inputField.on('click', function(){
    		this.uploadLink.addClass('mf-upload-down');
    		this.uploadLink.removeClass('mf-upload-over');
    	}, this);
    	
    	inputField.on('change', function(){
    		this.setValue(inputField.getValue());
    	}, this);
    	
    	this.inputField = inputField;
    	return inputField ;
	}
	
	,tooglePreview: function(){
		if ( this.previewContainer.getStyles('display').display == 'none'){
			if(this.previewType == 'flash'){//do not slideIn if we are showing flash, get's' really ugly
				this.previewContainer.setStyle('display','block');
				this.previewLink.addClass('mf-preview-opened');
			}else{
			
				this.previewContainer.slideIn('t', {
					easing: 'easeOut'
					,scope: this
					,callback: function(){
						this.previewLink.addClass('mf-preview-opened');
						
					}
				});
			}
			Ext.QuickTips.register({
				target:  this.previewLink                   
				,text: this.previewCloseTooltip
				,enabled: true
			});
			
		}else{
			
			if(this.previewType == 'flash'){ //do not slideOut if we are showing flash, get's' really ugly          
				this.previewContainer.setStyle('display', 'none');
				this.previewLink.removeClass('mf-preview-opened');
			}else{
				this.previewContainer.slideOut('t', {
						easing: 'easeIn'
	    			    ,useDisplay: true
	    			    ,scope: this
	    			    ,callback : function(){
							this.previewLink.removeClass('mf-preview-opened');
						}
	    			}, this.previewContainer);
			}
	
			Ext.QuickTips.register({
				target:  this.previewLink                   
				,text: this.previewOpenTooltip
				,enabled: true
			});
		}
	}
	
	/*
	 * Draws the media preview box
	 */
	,drawMediaPreview: function(previewType, previewContainer){
		switch(previewType){
			case 'image' :
    			var img = previewContainer.createChild({
	        		'tag': 'img'
        			,'class': 'mf-preview-img'
	        		,'src': this.value
        		});
    			if(parseInt(this.mediaWidth) > 0)
    				img.setStyle('width',  this.mediaWidth+'px' );
    				
    			if(parseInt(this.mediaHeight) >0 )
    				img.setStyle('height', this.mediaHeight+'px' );
			break;
				
			case 'flash':
				
				var cnt = previewContainer.createChild({
	        		'tag': 'p'
        			,'class': 'mf-preview-flash-container'
        			,'style' : 'width: '+this.mediaWidth+'px; height: '+this.mediaHeight+'px'
        		});
			
				cnt.createChild({
	        		'tag': 'object'
        			,'type': 'application/x-shockwave-flash'
        			,'data': this.value
        			,'width': this.mediaWidth
        			,'height': this.mediaHeight
        			,'html': '<param name="movie" value="'+ this.value+'" />'
	        	});
			break;
				
			default:
				
				var cnt = previewContainer.createChild({
	        		'tag': 'p'
        			,'class': 'mf-preview-file-container'
        		});
				
				
				cnt.update('<table><tr> \
						<td><img class="mf-mime-unknown mf-mime-' + this.fileExtension +'" src="'+ Ext.BLANK_IMAGE_URL +'"></td> \
						<td><p class="mf-mime-filename">' + (this.fakeFileName || this.formatValue(this.value)) + '<span>' + this.fileSize  + '</span></p></td> \
				</tr></table>');
				break;
		}
		previewContainer.setStyle({'display' : 'none'});
	}
	
	/*
	 * Not really file type, but according to file extension return the type of preview needed
	 */
	,getFileType: function(){
		var fileType = null;
		var ext = (/[.]/.exec(this.value.toLowerCase())) ? /[^.]+$/.exec(this.value.toLowerCase())[0] : undefined
    	switch(ext){
    		case 'swf' :
    		//case 'flv' :
    			fileType="flash";
			break;
			
    		case 'jpg' :
    		case 'jpeg':
    		case 'png' :
    		case 'gif' :
    		case 'bmp' :
    		case 'tiff':
    			fileType="image";
			break;
			
			default:
				fileType="file";
			break;
    	}
    	this.previewType = fileType ;
    	this.fileExtension = ext ;
    	return fileType;
	}
});

Ext.reg('mediafield', Ext.fc.MediaField);
