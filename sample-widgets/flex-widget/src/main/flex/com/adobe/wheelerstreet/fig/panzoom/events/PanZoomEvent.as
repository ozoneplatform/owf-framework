package com.adobe.wheelerstreet.fig.panzoom.events
{
	import flash.events.Event;
	import flash.geom.Point;	

	public class PanZoomEvent extends Event
	{

		public static const COMMAND_COMPLETE:String = "commandComplete";

		/**
	    * the center point the pan/zoom event used when executed.
	    */
		public var centerPoint:Point;
		
		public function PanZoomEvent(type:String, centerPoint:Point)
		{
			this.centerPoint = centerPoint;
			super(type);
		}
		/**
	    *  @private
	    */
		public override function clone():Event
		{
			return new PanZoomEvent(type, centerPoint);
		}
		/**
	    *  @private
	    */		
		public override function toString():String
		{
			return formatToString("PanZoomEvent", "type", "bubbles", "cancelable", "eventPhase", "centerPoint");
		}
			

	}
}