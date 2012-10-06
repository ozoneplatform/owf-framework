package com.adobe.wheelerstreet.fig.panzoom.interfaces
{
	public interface ICommand
	{
		function execute():void;
		function isExecuting():Boolean;
		
		function cancel():void;
	}
}