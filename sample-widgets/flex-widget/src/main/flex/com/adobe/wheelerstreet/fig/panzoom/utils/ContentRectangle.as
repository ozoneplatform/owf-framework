package com.adobe.wheelerstreet.fig.panzoom.utils
{
	import flash.geom.Rectangle;
	import flash.geom.Point;
	
	public class ContentRectangle extends Rectangle
	{
		
		private var _viewRectangle:Rectangle
	
		private var _scaleX:Number = 1;
		private var _scaleY:Number = 1;
		
		private var _zoom:Number = _scaleX;
		
		private var _unscaledWidth:Number;
		private var _unscaledHeight:Number;
		
		private var _zoomOrigin:Point;
		
		
		/////////////////////////////////////////////////////////
		//
		// constructor
		//
		/////////////////////////////////////////////////////////		
		
		
		/** 
		 * The ContentRectangle tracks it's position in relation to the
		 * to the view via a reference to the 'view rectangle' which 
		 * is added to the constructor.
		 */
		 
		 		
		public function ContentRectangle(x:Number, y:Number, width:Number, height:Number, viewRectangle:Rectangle)
		{
			super(x, y, width, height);
			
			_unscaledWidth  = width;
			_unscaledHeight = height;
			_viewRectangle = viewRectangle;
			_zoomOrigin = new Point();

		}

	
		/////////////////////////////////////////////////////////
		//
		// public getters/setters
		//
		/////////////////////////////////////////////////////////
		
		/** 
		 * the zoomOrigin represents the point in which the zoom originates.
		 */
		 
		public function get zoomOrigin():Point
		{
			return _zoomOrigin;
		}
		public function set zoomOrigin(value:Point):void
		{
			if (value == _zoomOrigin)
				return;
			
			_zoomOrigin = value;
		}
		
		/**
		 * ScaleX is the rectangles percent width
		 */
		 
		public function get scaleX():Number
		{
			return _scaleX;
		}
		public function set scaleX(value:Number):void
		{
			if (value == _scaleX)
				return;
			
			_scaleX = value;
			_zoom = value;
			
			width = _unscaledWidth * _scaleX;

		}
		
		/**
		 * ScaleY is the rectangles percent height
		 */
		public function get scaleY():Number
		{
			return _scaleY;
		}
		public function set scaleY(value:Number):void
		{
			if (value == _scaleY)
				return;
			
			_scaleY = value;
			_zoom = value;
			
			height = _unscaledHeight * _scaleY;
			
		}
		
		/**
		 * unscaledWidth is the basis for scaleX values.
		 */		
		public function get unscaledWidth():Number
		{
		 	return _unscaledWidth;
		}
		
		/**
		 * unscaledWidth is the basis for scaleX values.
		 */				
		public function get unscaledHeight():Number
		{
		 	return _unscaledHeight;
		}

		/**
		 * scales trhe rectangle based on the center of the 
		 * current view rectangle.
		 */
		 				
		[Bindable]
		public function get zoom():Number
		{
			return _zoom;
		}
		public function set zoom(value:Number):void
		{
			if (value == _zoom)
				return;
			_zoom = value;
			zoomByView(value);			
		}

		/**
		 * scales the rectangle based on the origin point.
		 */		
		public function get zoomByOrigin():Number
		{
			return _zoom;
		}
		public function set zoomByOrigin(value:Number):void
		{
			if (value == _zoom)
				return;
			
			_zoom = value;
			scaleByOrigin(value);	
		}
		/////////////////////////////////////////////////////////
		//
		// public functions
		//
		/////////////////////////////////////////////////////////		
		

		public function scaleByOrigin(scaleValue:Number):void
		{
			if (scaleValue == scaleX || scaleValue == scaleY)
				return;
			

			var origScaleX:Number;
			var origScaleY:Number;
			var origX:Number;
			var origY:Number;
			var newX:Number;
			var newY:Number;
			var scaledOriginX:Number;
			var scaledOriginY:Number;
		
			
			var originX:Number = _zoomOrigin.x;
			var originY:Number = _zoomOrigin.y;

			
			// Remember the original appearance
			origScaleX = scaleX;
			origScaleY = scaleY;
			newX = origX = x;
			newY = origY = y;


			// Origin position adjusted for scale
			scaledOriginX = originX * origScaleX;

			// Origin position adjusted for scale
			scaledOriginY = originY * origScaleY;
			
			scaledOriginX = Number(scaledOriginX.toFixed(1));
			scaledOriginY = Number(scaledOriginY.toFixed(1));
			
			scaleX = scaleValue//value[0];
			scaleY = scaleValue//value[1];


			origX += Number(x.toFixed(1)) - newX;
			origY += Number(y.toFixed(1)) - newY;			

			var ratioX:Number = scaleValue / origScaleX;
			var ratioY:Number = scaleValue / origScaleY;
			
			var newOriginX:Number = scaledOriginX * ratioX;
			var newOriginY:Number = scaledOriginY * ratioY;
	
			newX = scaledOriginX - newOriginX + origX;
			newY = scaledOriginY - newOriginY + origY;
			
			newX = Number(newX.toFixed(1));
			newY = Number(newY.toFixed(1));
			
			// Adjust position relative to the origin	
			x = newX;
			y = newY;
			
			scaleX = scaleValue;
			scaleY = scaleValue;

		}
		
		/**
		 * centers the rectangle on a point in the view rectangles space.
		 */
		public function centerToPoint(centerPoint:Point):void
		{
			x = centerPoint.x - width/2;
			y = centerPoint.y - height/2;
		}

		/**
		 * scales and centers the rectangle to the view rectangle.
		 */
		public function viewAll(viewRectangle:Rectangle):void
		{
			fitToRectangle(viewRectangle);
		}
		
		/**
		 * scales the rectangle based on the view rectangles origin
		 */		
		public function zoomByView(scaleValue:Number):void
		{
			if (scaleValue <= 0)
				return;
			if (scaleValue == scaleX || scaleValue == scaleY)
				return;
				
			//var __localOrigin:Point;
				
			if (width <= _viewRectangle.width && height <= _viewRectangle.height)
			{
				//trace("all is shown");
				
				_zoomOrigin = new Point( _unscaledWidth/2, _unscaledHeight/2);
				scaleByOrigin(scaleValue);		
				centerToPoint(new Point(_viewRectangle.width/2,_viewRectangle.height/2));
				
			} else
			{				
				//trace("partial shown");	
				_zoomOrigin = new Point((-x + _viewRectangle.width/2)* 1/scaleX, (-y + _viewRectangle.height/2) * 1/scaleY);
				scaleByOrigin(scaleValue);					
			}
		}
		
		
		/**
		 * returns the rectangles aspect ratio:  width / height
		 */
		public function get aspectRatio():Number
		{
			return width/height;
		}
		
		
		/////////////////////////////////////////////////////////
		//
		// private functions
		//
		/////////////////////////////////////////////////////////		
		
		/**
	    *  @private
	    */

		private function fitToRectangle(rectangle:Rectangle):void
		{
			
			var _scaleRatioX:Number  =  _unscaledWidth  / rectangle.width;
			var _scaleRatioY:Number  =  _unscaledHeight / rectangle.height;
			
			var _viewAspectRatio:Number = rectangle.width/rectangle.height;
			var _contentAspectRatio:Number = _unscaledWidth/_unscaledHeight;
			
			//trace("_scaleRatioX" + _scaleRatioX);
			//trace("_scaleRatioY" + _scaleRatioY);	
			//trace("_contentAspectRatio: " + _contentAspectRatio);			
			
			if (_scaleRatioX < _scaleRatioY)  // is content wider or thinner than view?
			{
				// if  thinner.
				var yRatio:Number = rectangle.height/_unscaledHeight							
				scaleX = yRatio;
				scaleY = yRatio;
				
			} else 
			{			
				// if wider.
				var xRatio:Number = rectangle.width/_unscaledWidth;
				scaleX = xRatio;
				scaleY = xRatio;
			}
			// center position
			centerToPoint(new Point(rectangle.width/2, rectangle.height/2));
		}


		

	}
}