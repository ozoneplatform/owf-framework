package com.adobe.wheelerstreet.fig.panzoom.utils
{
	import flash.geom.Point;
	
	public class MouseTracker
	{
		private var _lastMouseX : Number;
		private var _lastMouseY : Number;
		private var _currentMouseX : Number;
		private var _currentMouseY : Number;		
		
		private var _lastTime : Number;
		private var vx : Number;
		private var vy : Number;
		private var dx : Number;
		private var dy : Number;
		
		public var stopThresholdTime : Number = 100;
		public var stopThresholdVelocity : Number = 0.01;
		public var maxVelocity : Number = 3.0;
		public var sensitivity : Number = 200;
		
		public function start() : void
		{
			_lastTime = NaN;
			vx = vy = 0;
		}
		
		public function track(mouseX: Number, mouseY: Number) : void
		{
			if (!isNaN(_lastTime))
			{
				_currentMouseX = mouseX;
				_currentMouseY = mouseY;
				
				// Figure out the velocity
				dx =  _currentMouseX - _lastMouseX;
				dy =  _currentMouseY - _lastMouseY;
				var dt : Number = new Date().getTime() - _lastTime;
				
				vx = dx / dt;
				vy = dy / dt;
				
				if (Math.abs(vx) < stopThresholdVelocity)
				{
					vx = 0;
				}
				if (Math.abs(vy) < stopThresholdVelocity)
				{
					vy = 0;
				}
			}
			
			_lastMouseX = _currentMouseX;
			_lastMouseY = _currentMouseY;
			_lastTime = new Date().getTime();			
		}
		
		public function end() : void
		{
			var dt : Number = new Date().getTime() - _lastTime;
			
			if (dt > stopThresholdTime)
				vx = vy = 0;
		}

		public function isThrow() : Boolean
		{
			return (!isNaN(vx) && (vx != 0 || vy != 0));
		}
		
		public function getThrowDistance() : Point
		{
			if (!isThrow())
				return new Point(0, 0);
			
			var v : Point = new Point(vx * sensitivity, vy * sensitivity);
			var v2 : Number = vx*vx + vy*vy;
			
			if (v2 > maxVelocity * maxVelocity)
			{
				var magnitude : Number = Math.sqrt(v2);
				v.x *= maxVelocity / magnitude;
				v.y *= maxVelocity / magnitude;
			}
			
			return v;
		}
		
		public function getMouseDelta():Point
		{
			return new Point(dx , dy);
		}
	}
}