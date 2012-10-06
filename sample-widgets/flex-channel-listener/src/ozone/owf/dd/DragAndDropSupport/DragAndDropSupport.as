/*
This code is licensed under the MIT License:

Copyright (c) 2007 Ali Rantakari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
package ozone.owf.dd.DragAndDropSupport
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.InteractiveObject;
	import flash.display.Stage;
	import flash.events.EventDispatcher;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.geom.Point;
	
	import mx.core.FlexGlobals;
	import mx.events.FlexEvent;
	
	import spark.events.ElementExistenceEvent;

	public final class DragAndDropSupport extends EventDispatcher
	{
		private static var _stage:Stage;
		private static var _lastEventTarget:InteractiveObject = null;
		
		private static var _INSTANCE:DragAndDropSupport = null;
		private static var _interactiveObjects:Array = null;
		
		public function DragAndDropSupport()
		{
			if (_INSTANCE != null)
			{
				throw new Error("You can't create more than one instance of this class because it is a singleton. Use DragAndDropSupport.getInstance to get a handle to it.");
			}
			else
			{
				_interactiveObjects = getMouseEnabledInteractiveObjectsOnStage();
				
				if (ExternalInterface.available)
				{
					ExternalInterface.addCallback("dispatchExternalMouseEvent", externalMouseEventHandler);
					ExternalInterface.addCallback("updateInteractiveObjects", function():void {
						//ExternalInterface.call('console.log', 'updating _interactiveObjects');
						_interactiveObjects = getMouseEnabledInteractiveObjectsOnStage();
					});
				}
			}
		}
		
		public static function getInstance(stage:Stage):DragAndDropSupport
		{
			if (stage == null)
				throw new Error("stage property can not be null");
			else
			{
				_stage = stage;
				if (_INSTANCE == null)
					_INSTANCE = new DragAndDropSupport();
				
				return _INSTANCE;
			}
		}
		
		// handler for the calls coming from JavaScript
		private function externalMouseEventHandler(pageX:Number, pageY:Number):void
		{
			var mouseEvent:MouseEvent;
			
			if (_interactiveObjects.length == 0)
				return;
			
			// see which ones pass a hittest with the mouse cursor
			var hitTestObjs:Array = _interactiveObjects.filter(function(aItem:*, aIndex:int, aArray:Array):Boolean {
				return (aItem.hitTestPoint(pageX, pageY, true));
			});
			
			// create array of hittest-passing objects and their levels in the displaylist
			var rObjs:Array = getDisplayListLevelsFor(hitTestObjs);
			
			// see which ones of the remaining are highest in the displaylist
			var highestLevel:uint = 0;
			for (var m:uint = 0; m < rObjs.length; m++)
			{
				if (rObjs[m].level > highestLevel) highestLevel = rObjs[m].level;
			}
			var onTheHighestLevel:Array = rObjs.filter(function(aItem:*, aIndex:int, aArray:Array):Boolean {
				return (aItem.level == highestLevel);
			});
			
			// pick the last one from the ones that have the highest level
			var highestInDisplayList:Object = {object:null, level:(-10000)};
			for (var n:uint = 0; n < onTheHighestLevel.length; n++)
			{
				if (onTheHighestLevel[n].level > highestInDisplayList.level)
					highestInDisplayList = onTheHighestLevel[n];
			}
			
			// make it dispatch a MouseEvent event
			if (highestInDisplayList.object != null)
			{
				if (highestInDisplayList.object.dispatchEvent)
				{
					var localCoords:Point = highestInDisplayList.object.globalToLocal(new Point(pageX, pageY));
					if(!_lastEventTarget) {
						highestInDisplayList.object.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_OVER, true, false,
							localCoords.x, localCoords.y,
							null //relatedObject -- doesn't apply here
						));
					}
					else if(_lastEventTarget !== highestInDisplayList.object) {
						_lastEventTarget.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_OUT, true, false,
							localCoords.x, localCoords.y,
							null //relatedObject -- doesn't apply here
						));
						highestInDisplayList.object.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_OVER, true, false,
							localCoords.x, localCoords.y,
							null //relatedObject -- doesn't apply here
						));
					}
					highestInDisplayList.object.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_MOVE, true, false,
						localCoords.x, localCoords.y,
						null //relatedObject -- doesn't apply here
					));
					_lastEventTarget = highestInDisplayList.object;
				}
			}
		}
		
		/**
		 * Returns an array of Objects, specifying the display list levels
		 * for a specified array of DisplayObjects. The return Object will
		 * be in the following format:
		 * 
		 * {object:<DisplayObject>, level:<uint>}
		 * 
		 * @param aObjs		An array of DisplayObjects
		 * 
		 * @return			An array of Objects, containing the
		 *					objects and their levels in the DisplayList
		 */
		private function getDisplayListLevelsFor(aObjs:Array):Array
		{
			var objs:Array = new Array();
			
			if (aObjs.length > 0)
			{
				if (aObjs[0].stage != null)
				{
					objs = travelDisplayList(aObjs[0].stage);
					var currLevel:uint = 0;
					
					function travelDisplayList(container:DisplayObjectContainer):Array
					{
						var retArr:Array = new Array();
						var child:DisplayObject;
						for (var i:uint=0; i < container.numChildren; i++)
						{
							currLevel++;
							child = container.getChildAt(i);
							if (aObjs.indexOf(child) != (-1)) retArr.push({object:child, level:currLevel});
							if (container.getChildAt(i) is DisplayObjectContainer)
							{
								var grandChildren:Array = travelDisplayList(DisplayObjectContainer(child));
								for (var j:uint = 0; j < grandChildren.length; j++)
									retArr.push(grandChildren[j]);
							}
						}
						return retArr;
					}
				}
			}
			
			return objs;
		}
		
		/**
		 * Returns all the DisplayObjectContainer on stage that are able to
		 * dispatch mouse events
		 * 
		 * @return			An array of DisplayObjectContainer Objects
		 */
		private function getMouseEnabledInteractiveObjectsOnStage():Array
		{
			var objs:Array = new Array();
			
			objs = travelDisplayList(_stage);
			
			function travelDisplayList(container:DisplayObjectContainer):Array
			{
				var retArr:Array = new Array();
				var child:DisplayObject;
				for (var i:uint=0; i < container.numChildren; i++)
				{
					child = container.getChildAt(i);
					if (child is InteractiveObject)
					{
						if (!child.visible)
							continue;
						
						if ((child as InteractiveObject).mouseEnabled)
							retArr.push(child);
						
						// fljot: get children only if they are mouse-enabled. otherwise no need to scan them
						if (child is DisplayObjectContainer && (child as DisplayObjectContainer).mouseChildren)
						{
							var grandChildren:Array = travelDisplayList(DisplayObjectContainer(child));
							for (var j:uint = 0; j < grandChildren.length; j++)
								retArr.push(grandChildren[j]);
						}
					}
				}
				return retArr;
			}
			
			return objs;
		}
	}
}