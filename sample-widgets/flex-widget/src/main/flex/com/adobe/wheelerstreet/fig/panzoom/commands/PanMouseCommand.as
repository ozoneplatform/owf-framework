package com.adobe.wheelerstreet.fig.panzoom.commands
{
	import com.adobe.wheelerstreet.fig.panzoom.ImageViewer;
	import com.adobe.wheelerstreet.fig.panzoom.events.PanZoomEvent;
	import com.adobe.wheelerstreet.fig.panzoom.interfaces.ICommand;
	import com.adobe.wheelerstreet.fig.panzoom.utils.ContentRectangle;
	import com.adobe.wheelerstreet.fig.panzoom.utils.MouseTracker;
	
	import flash.events.EventDispatcher;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Timer;
	
	import mx.core.UIComponent;
	import mx.effects.AnimateProperty;
	import mx.events.TweenEvent;
	import mx.events.EffectEvent;
	


	public class PanMouseCommand extends EventDispatcher implements ICommand
	{

		private static var TRANSLATE_TOLERANCE:Number = .25;

		
		private var _client:UIComponent;
		private var _reciever:ContentRectangle;
		private var _isExecuting:Boolean;

		private var _initOrginPoint:Point;
		
		private var _mouseDownPosition:Point;
		private var _mousePosition:Point;

		private var _panTimer:Timer
		private var _animatePropertyX:AnimateProperty
		private var _animatePropertyY:AnimateProperty
		
		private var _edgeViolationDirectionX:String
		private var _edgeViolationDirectionY:String
		
		private var _mouseTracker:MouseTracker;
		
		private var _panAnimationSpeed:Number = .25;
		private var _springAnimationSpeed:Number = .125;		
		
		
		/////////////////////////////////////////////////////////
		//
		// constructor
		//
		/////////////////////////////////////////////////////////
		/**
		 * the PanMouseCommand triggers movement of the the ContentRectangle (_reciever) against
		 * the bitmap ImageView (_client).
		 */
		
		public function PanMouseCommand(client:ImageViewer, reciever:ContentRectangle):void
		{
			_client = client;
			_reciever = reciever;
		}
		
		
		/////////////////////////////////////////////////////////
		//
		// interface
		//
		/////////////////////////////////////////////////////////
		/**
	    * begins pan mouse action by listening for mouse movements and animating the 
	    * transition between fired mouseMove positions.
	    */		
		public function execute():void
		{
			// remove previous listeners
			if(_panTimer != null)
			{
				_client.stage.removeEventListener(MouseEvent.MOUSE_UP, handleMouse);	
				_client.stage.removeEventListener(MouseEvent.MOUSE_MOVE, handleMouse);	
				_panTimer.removeEventListener(TimerEvent.TIMER, handlePanTimer);
			}

			if (_animatePropertyX != null && _animatePropertyX.isPlaying)
			{
				_animatePropertyX.pause();
			}
			if (_animatePropertyY != null && _animatePropertyY.isPlaying)
			{
				_animatePropertyY.pause();
			}	
						
			_animatePropertyX = new AnimateProperty(_reciever);	
			_animatePropertyX.property = "x";
			_animatePropertyY = new AnimateProperty(_reciever);	
			_animatePropertyY.property = "y";
								
			_isExecuting = true;
			
			_edgeViolationDirectionX = "";
			_edgeViolationDirectionY = "";
						
			// objects
			_panTimer = new Timer(10,0);					
			_mouseTracker = new MouseTracker();
			_mouseDownPosition = new Point(_client.mouseX, _client.mouseY);
			_mousePosition = new Point(_mouseDownPosition.x, _mouseDownPosition.y);
			_initOrginPoint = new Point( _reciever.x, _reciever.y);
	
			// listeners
			_client.stage.addEventListener(MouseEvent.MOUSE_UP, handleMouse);	
			_client.stage.addEventListener(MouseEvent.MOUSE_MOVE, handleMouse);	
			_panTimer.addEventListener(TimerEvent.TIMER, handlePanTimer);
	
		}
		public function cancel():void
		{
			_isExecuting = false;
		}
		public function isExecuting():Boolean
		{
			return _isExecuting;
		}

		
		/////////////////////////////////////////////////////////
		//
		// interface
		//
		/////////////////////////////////////////////////////////
		/**
	    *  @private
	    */
	    
		private function handleMouse(e:MouseEvent):void
		{			
			switch (e.type)
			{
				case "mouseUp":

					_panTimer.stop();
					_mouseTracker.end();	
					
					//					
					// events
					_client.stage.removeEventListener(MouseEvent.MOUSE_UP, handleMouse);		
					_panTimer.removeEventListener(TimerEvent.TIMER, handlePanTimer);
					
					//
					// objects	
					trace(_mouseTracker.isThrow());

 					if(_reciever.containsRect(ImageViewer(_client).viewRect))
					{
						if (_mouseTracker.isThrow())
						{
							cancel();
							// add mouse throw animation here...				
							
						} else {
							cancel();
						}
						
					} else
					{
						addEventListener(PanZoomEvent.COMMAND_COMPLETE, handleSpringComplete);
											
						switch (_edgeViolationDirectionX)
						{
							case "left":
		
								_animatePropertyX.addEventListener(TweenEvent.TWEEN_UPDATE, handleSpringTween);
								_animatePropertyX.addEventListener(EffectEvent.EFFECT_END, handleSpringEnd);							
								_animatePropertyX.toValue = ImageViewer(_client).viewRect.left;
								_animatePropertyX.play();	
								
								break;
		
							case "right":
								
								_animatePropertyX.addEventListener(TweenEvent.TWEEN_UPDATE, handleSpringTween);
								_animatePropertyX.addEventListener(EffectEvent.EFFECT_END, handleSpringEnd);																						
								_animatePropertyX.toValue = ImageViewer(_client).viewRect.width - _reciever.width;
								_animatePropertyX.play();		
								
								break;
						}
						
						switch (_edgeViolationDirectionY)
						{
							case "top":						
								
								_animatePropertyY.addEventListener(TweenEvent.TWEEN_UPDATE, handleSpringTween);							
								_animatePropertyY.addEventListener(EffectEvent.EFFECT_END, handleSpringEnd);							
								_animatePropertyY.toValue = ImageViewer(_client).viewRect.top;
								_animatePropertyY.play();						
								
								break;
		
							case "bottom":

								_animatePropertyY.addEventListener(TweenEvent.TWEEN_UPDATE, handleSpringTween);							
								_animatePropertyY.addEventListener(EffectEvent.EFFECT_END, handleSpringEnd);
								_animatePropertyY.toValue = ImageViewer(_client).viewRect.height - _reciever.height;
								_animatePropertyY.play();			
								
								break;
						}
					} 

					break;
					
				case "mouseMove":
					
					//
					// events
					
					// removing the move listener here forces the move event to fire once.  
					_client.stage.removeEventListener(MouseEvent.MOUSE_MOVE, handleMouse);	
					addEventListener(PanZoomEvent.COMMAND_COMPLETE, handleSpringComplete);
										
					_panTimer.start();
					_mouseTracker.start();
					
					
					
					break;
			}
		}
		/**
	    *  @private
	    */		
		private function handlePanTimer(e:TimerEvent):void
		{			

			trace(_edgeViolationDirectionX);

			// begin tracking stage's mouse (note: this captures mouse
			// events outside the player and/or browser)
			_mouseTracker.track(_client.systemManager.stage.mouseX, _client.systemManager.stage.mouseY);

			var dx:int = _mouseTracker.getMouseDelta().x;
			var dy:int = _mouseTracker.getMouseDelta().y;
		
			// begins to slow drag if the image is past the extents
			// of the _viewRect by tweeking the _mousePosition, 
			// and track wich edge was violated.
			if (_reciever.left > ImageViewer(_client).viewRect.left)
			{		
				_reciever.x = 0;
				_mousePosition.x = _client.mouseX;					
				
				_edgeViolationDirectionX = "left";
				
			} else if (_reciever.right < ImageViewer(_client).viewRect.right) 
			{

				_reciever.x = ImageViewer(_client).viewRect.width - _reciever.width;
				_mousePosition.x = _client.mouseX;						
				
				_edgeViolationDirectionX = "right";		

			} else
			{
				_mousePosition.x += dx;	
				_edgeViolationDirectionX = "";	
			}
			
			// and the y
			if (_reciever.top >= ImageViewer(_client).viewRect.top)
			{
				
				_reciever.y = 0;			
				_mousePosition.y = _client.mouseY;
				_edgeViolationDirectionY = "top";
				
			} else if (_reciever.bottom <= ImageViewer(_client).viewRect.bottom) 
			{
				_reciever.y = ImageViewer(_client).viewRect.height - _reciever.height;
				_mousePosition.y = _client.mouseY;
				_edgeViolationDirectionY = "bottom";

			} else
			{
				_mousePosition.y += dy;
				_edgeViolationDirectionY = "";						
			}			
			
			// animate twards _mousePosition
			_reciever.x += _panAnimationSpeed * ((_mousePosition.x - _mouseDownPosition.x) - (_reciever.x - _initOrginPoint.x));
			_reciever.y += _panAnimationSpeed * ((_mousePosition.y - _mouseDownPosition.y) - (_reciever.y - _initOrginPoint.y))
	
			_client.invalidateDisplayList();

		}
		/**
	    *  @private
	    */		
		private function handleSpringTween(e:TweenEvent):void
		{
			_client.invalidateDisplayList();
			trace(_reciever.x);
		}
		/**
	    *  @private
	    */		
		private function handleSpringEnd(e:EffectEvent):void
		{
			switch (_edgeViolationDirectionX)
			{
				case "left":

					_reciever.x = -1;
				
					break;

				case "right":
					
					ImageViewer(_client).viewRect.width - _reciever.width + 1
						
					break;
			}
			
			switch (_edgeViolationDirectionY)
			{
				case "top":						
					
					_reciever.y = -1;
									
					break;

				case "bottom":

					_reciever.y = ImageViewer(_client).viewRect.height - _reciever.height + 1;			
					
					break;
			}
		}
		/**
	    *  @private
	    */		
 		private function handleSpringComplete(e:PanZoomEvent):void
		{
			cancel();
			removeEventListener(PanZoomEvent.COMMAND_COMPLETE, handleSpringComplete);


			
		} 
	}
}