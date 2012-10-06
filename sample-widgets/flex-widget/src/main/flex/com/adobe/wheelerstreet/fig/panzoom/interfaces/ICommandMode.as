package com.adobe.wheelerstreet.fig.panzoom.interfaces
{
	public interface ICommandMode 
	{
		function activate():void;
		function deactivate():void;
		
		function isActivated():Boolean;
	}
}