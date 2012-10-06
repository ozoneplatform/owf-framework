package com.adobe.wheelerstreet.fig.panzoom.commands
{
	import com.adobe.wheelerstreet.fig.panzoom.ImageViewer;
	import com.adobe.wheelerstreet.fig.panzoom.interfaces.ICommand;
	import com.adobe.wheelerstreet.fig.panzoom.utils.ContentRectangle;
	
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	
	import mx.effects.AnimateProperty;
	import mx.events.TweenEvent;

	public class ZoomCommand extends EventDispatcher implements ICommand
	{
		private var _isExecuting:Boolean = false;
		private var _client:ImageViewer
		private var _reciever:ContentRectangle;
		private var _direction:String;
		
		private var _animateProperty:AnimateProperty;
	
		/**
	    *  sets the direction of the zoom.  "in" or "out"
	    */			
	
		public function set direction(value:String):void
		{
			if (value == _direction)
				return;	
				
			_direction = value;
		}
		public function get direction():String
		{
			return _direction;
		}
		
		/**
	    * scales the Image Viwer's content rectangle (_reciever) based on
	    * the center of the view rectangle. 
	    */			
		
		public function ZoomCommand(client:ImageViewer, reciever:ContentRectangle):void
		{
			_client = client;
			_reciever = reciever;
		}


		public function execute():void
		{		
			_isExecuting = true;
			_animateProperty = new AnimateProperty();
			_animateProperty.addEventListener(TweenEvent.TWEEN_UPDATE, handleTween);
			_animateProperty.property = "zoom";
			_animateProperty.fromValue = _reciever.zoom;
			
			switch (_direction)
			{
				case "in":
				
					if (_reciever.zoom * 2 > _client.bitmapScaleFactorMax)
					{
						_animateProperty.toValue = _client.bitmapScaleFactorMax;
					} else 
					{
						_animateProperty.toValue = _reciever.zoom * 2;						
					}

					break;
				
				case "out":
				
					if (_reciever.zoom / 2 < _client.bitmapScaleFactorMin)
					{
						_animateProperty.toValue = _client.bitmapScaleFactorMin;
					} else 
					{
						_animateProperty.toValue = _reciever.zoom / 2;						
					}					
					break;
			}

			_animateProperty.play([_reciever]);

		}		
		
		public function isExecuting():Boolean
		{
			return _isExecuting;
		}
		
		public function cancel():void
		{
			_isExecuting = false;
		}	
			
		/**
	    *  @private
	    */	
		private function handleTween(e:TweenEvent):void
		{	
			_client.bitmapScaleFactor = Number(e.value);
		}
		
	}
}