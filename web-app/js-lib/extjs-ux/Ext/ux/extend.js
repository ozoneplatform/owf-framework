/**
 * @class
 * @name Ext.ux
 * @desc This package provides fully backward-compatible drop-in replacement (patch) for Ext.extend with soft-coded inheritance support. See {@link #Ext.ux-extend} for details.
 * It also add new overloading features to <b>Function</b> prototype. See {@link Function} 
 * <br/><br/>Link to the test suite: <a href="http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/extend/Ext.ux.extend.html">http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/extend/Ext.ux.extend.html</a>
 * <br/>Link to the forum thread: <a href="http://extjs.com/forum/showthread.php?t=49083">http://extjs.com/forum/showthread.php?t=49083</a>
 * @version 0.1
 * @author <a href="http://extjs.com/forum/member.php?u=36826">SamuraiJack</a>
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 */
Ext.ux.extend = function () {

	/**
	 * Improved <b>Ext.ux.extend</b>. Provides exactly the same interface as standard <b>Ext.ux.extend</b> plus allows to use soft-coded inheritance in different formats.<br>
	 * So instead of<pre>
    Ext.ux.myWindow = Ext.extend(Window, {
        onRender : function (ct, position) {
            <b>Ext.ux.myWindow.superclass</b>.onRender.apply(this, arguments);
            ...
        }
    });
</pre> you can write<pre>
    Ext.ux.myWindow = <b>Ext.ux.extend</b>(Window, {
        onRender : function (ct, position) {
            <b>this.superclass()</b>.onRender.apply(this, arguments);
            ...
        }
    });
</pre>or, without apply<pre>
    Ext.ux.myWindow = <b>Ext.ux.extend</b>(Window, {
        onRender : function (ct, position) {
            <b>this.superclass().onRender(ct, position);</b>
            ...
        }
    });
</pre>note, that <b>superclass()</b> is a function call, not property access. <br>Previous 2 formats are sub-optimal, though the most "natural". 
The fastest variant will be to specify the method name as a parameter to <b>superclass()</b> call<pre>
    Ext.ux.myWindow = <b>Ext.ux.extend</b>(Window, {
        onRender : function (ct, position) {
            this.superclass('onRender',ct, position);
            ...            
        }
    });
</pre>or with unmodified parameters (note big 'C')<pre>
    Ext.ux.myWindow = <b>Ext.ux.extend</b>(Window, {
        onRender : function (ct, position) {
            this.super<b>C</b>lass('onRender', arguments);
            ...            
        }
    });
</pre>
	
     * @param {Class} subClass The class inheriting the functionality
     * @param {Class} superClass The class being extended
     * @param {Object} [overrides] A literal with members which are copied into the subclass's prototype, and are therefore shared between all instances of the new class.
     * @return {Class} The subclass constructor.
	 */
	Ext.ux.extend = function (subClass, superClass, overrides){
		if(typeof superClass == 'object'){
            overrides = superClass;
            superClass = subClass;
            subClass = overrides.constructor != Object ? overrides.constructor : function(){ superClass.apply(this, arguments); };
        }
        
        var F = function(){};
        F.prototype = superClass.prototype;
        
        subClass.prototype = new F();
        
        subClass.prototype.constructor = subClass;
        subClass.__definedIn = subClass;
        
        subClass.__superclass = superClass;
        
        superClass.prototype.constructor = superClass;
        if (!superClass.__definedIn) {
        	superClass.__definedIn = superClass;

        	for (var property in superClass.prototype) {
	        	if (typeof superClass.prototype[property] == 'function') {
	        		superClass.prototype[property].__definedIn = superClass;
	        	}
        	}
        }
        
        for (var property in overrides) {
        	if (overrides.hasOwnProperty(property))	{
        		subClass.prototype[property] = overrides[property];
        		if (typeof subClass.prototype[property] == 'function') {
        			if (subClass.prototype[property].__definedIn && property != 'constructor') throw "function " + property + " is already using as class method";
        			
        			subClass.prototype[property].__definedIn = subClass;
        		}
        	}
        }
        
        subClass.superclass = superClass.prototype;
        subClass.prototype.superclass = function (){
	        var calledFromFunction = arguments.callee.caller;
	        if (!calledFromFunction) throw ('superclass() used outside from class method');
	        calledFromFunction = (calledFromFunction.caller && calledFromFunction.caller.__slots) ? calledFromFunction.caller : calledFromFunction;
	        
	        
	        if (!calledFromFunction.__definedIn) throw ('superclass() used outside from class method');
	        var upFromClass = calledFromFunction.__definedIn.__superclass;
	        
	        var res = {};
	        
	        if (arguments.length) {
	        	var args = Array.prototype.slice.call(arguments);
	        	var methodName = args.shift();
	        	if (typeof upFromClass.prototype[methodName] != 'function') throw 'Superclass method ' + methodName + ' not found';
	        	
	        	return upFromClass.prototype[methodName].apply(this, args);
	        } else {
		        for (var property in upFromClass.prototype) {
		        	if (typeof upFromClass.prototype[property] == 'function') {
		        		res[property] = upFromClass.prototype[property].createDelegate(this);
		        	}
		        }
		        return res;
	        }
        }
        
		subClass.prototype.superClass = function (){
	        var calledFromFunction = arguments.callee.caller;
	        if (!calledFromFunction) throw ('superclass() used outside from class method');
	        calledFromFunction = (calledFromFunction.caller && calledFromFunction.caller.__slots) ? calledFromFunction.caller : calledFromFunction;
	        
	        if (!calledFromFunction.__definedIn) throw ('superClass() used outside from class method');
	        var upFromClass = calledFromFunction.__definedIn.__superclass;
	        
	        
	        if (!arguments.length) throw 'superClass() called without arguments';
        	var args = Array.prototype.slice.call(arguments);
        	var methodName = args.shift();
        	if (typeof upFromClass.prototype[methodName] != 'function') throw 'Superclass method ' + methodName + ' not found';
        	args = args.shift();
        	if (!args || (typeof args.length == 'undefined')) throw 'superClass() called without arguments array';
        	
        	return upFromClass.prototype[methodName].apply(this, args);
        }        
        
        return subClass;
	};
	
	
	var Signature = {
		equal : function (source, target) {
			if (!target && !source) return true;
			if (!(target && source)) return false;
			
			if (target.length != source.length) return false;
			
			for (var i = 0; i < source.length; i++) {
				if (source[i] !== target[i]) return false;
			}
			
			return true;
		},
		
		argsToSignature : function (args) {
			var res = [];
			for (var i = 0; i < args.length; i++) {
				if (typeof args[i] == 'undefined') res.push( args[i] )
				else if (args[i] === null) res.push( Object )
				else {
					res.push( args[i].constructor );
				}
			}
			
			return res;
		},
		
		matchQuality : function (source, target) {
			if (!(target && source)) return 0;

			if (target.length != source.length) return 0;
			
			if (!target.length && !source.length) return 100;
			
			var sum = 0;
			
			for (var i = 0; i < source.length; i++) {
				if (source[i] === target[i]) { sum += 100 } 
				else if (target[i].isa(source[i])) { sum += 80 } 
				else if (source[i] == String && target[i] == Number) { sum += 60 } 
				else if (source[i] === undefined) { sum += 50 } 
				else return 0;
			}
			
			sum /= source.length;
			
			return sum;
		}
		
	};
	
	
	var OverloadContainer = {
		__addSlot : function (slot) {
			for (var i = 0; i < this.__slots.length; i++) {
				if ( Signature.equal(this.__slots[i].__signature, slot.__signature) ) throw "Cant add 2 identical signatures to overloaded function";
			}
			
			if (slot.__definedIn && this.__definedIn) throw "Cant overload 2 methods of class";
			
			this.__slots.push(slot);
				
			if (slot.__definedIn) {
				this.__definedIn = slot.__definedIn;
				
				var definedInClassProto = slot.__definedIn.prototype;
				
				for (var method in definedInClassProto) {
					if (definedInClassProto[method] == slot) {
						definedInClassProto[method] = this;
						break;
					}
				}
				slot.__definedIn = undefined;
			}
		}
	};
	
	
	/**
	 * Native <b>Function</b> with overloading support.
	 * @class
	 * @name Function
	 */
	Ext.override(Function, {
		
		/**
		 * Overloads this function with the target function and return the overloaded function. See {@link #Function-signature} for details.<br>  
		 * <b>Examples:</b><br>
		 * Creating the default value for one of the arguments
		 * <pre>
Ext.ux.extend = function (superClass, subClass, overrides) {
    ...
}.signature(Function, Function, Object).<b>overload</b>(
    function (subClass, overrides) {
        return Ext.ux.extend(
            function () { this.superClass('constructor', arguments); },
            subClass,
            overrides
        ); 
    }.signature(Function, Object)
);
</pre>
Creating a variants, which will process Array and Function as a parameters.
<pre>
this.add = function (item) {
    this.items.push(item);
}.<b>overload</b>(
    function (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.add(arr[i]);
        } 
    }.signature(Array)
).<b>overload</b>(
    function (func) {
        this.add( func() );
    }.signature(Function)
);
</pre>
		 * @param {Function} target Target function to overload with
		 * @methodOf Function
		 * @name Function#overload
		 * @return {Function} The overloaded function.
		 */
		overload : function (target) {
			if (typeof target != 'function') throw "Invalid overloading target";
				
			if (target.__slots && this.__slots) throw "Cant mix together 2 overloaded functions";
			
			if (!target.__slots && !this.__slots) {

				var container = function (){
					var callSignature = Signature.argsToSignature(arguments);
					var self = arguments.callee;
					
					for (var i = 0; i < self.__slots.length; i++) {
						if ( Signature.equal(self.__slots[i].__signature, callSignature) ) return self.__slots[i].apply(this, arguments);
					}
					
					var maxQuality = 0;
					var bestMatch, catcher;
					
					for (var i = 0; i < self.__slots.length; i++) {
						if (!self.__slots[i].__signature) catcher = self.__slots[i];
						
						var q = Signature.matchQuality(self.__slots[i].__signature, callSignature);
						if (q > maxQuality) {
							maxQuality = q;
							bestMatch = self.__slots[i];
						}
					}
					
					if (bestMatch || catcher) return (bestMatch || catcher).apply(this, arguments);
					
					throw "Ambiguous call";
				};
				container.__slots = [];
				Ext.apply(container, OverloadContainer);
				
				return container.overload(target).overload(this);
			}
			
			var container = target.__slots ? target : this;
			var slot = target.__slots ? this : target; 
			
			container.__addSlot(slot);
			
			return container;
		},
		
		/**
		 * This function implements special kind of overloading - iterating over the array.
		 * So instead of 
		 * <pre>
var myFunc = function (item) {
   ...
}.overload(
    function (arr) {
        for (var i = 0; i < arr.length; i++) myFunc.call(this, arr[i]);
    }.signature(Array)
)
</pre>you can write<pre>
var myFunc = function (item) {
   ...
}.addIterator();
</pre>
         * @methodOf Function
         * @name Function#addIterator
         * @return {Function} The function overloaded with array iterator. 
         */
        addIterator : function() {
            var self = this.overload(
                function (arr) {
                    for (var i = 0; i < arr.length; i++) self.call(this, arr[i]);
                }.signature(Array)
            );
            return self;
        },
        
        
        /**
         * This function implements special kind of overloading - inspecting the properties of passed object.
         * So instead of 
         * <pre>
var myFunc = function (name, value) {
   ...
}.overload(
	function (obj) {
		for (var i in obj) myFunc.call(this, i, obj[i]);
	}.signature(Object)
)
</pre>you can write<pre>
var myFunc = function (item) {
   ...
}.addInspector();
</pre>
		 * @methodOf Function
		 * @name Function#addInspector
		 * @return {Function} The function overloaded with object inspector. 
		 */
		addInspector : function() {
			var self = this.overload(
				function (obj) {
					for (var i in obj) self.call(this, i, obj[i]);
				}.signature(Object)
			);
			return self;
		},
		

		/**
		 * This function adds a signature to this function, so it can be distingished during overloading call. 
		 * This function accepts variable numbers of parameters, each of them should be a constructor, values generated with which the function will accept.
		 * Function also will accept the values, which were generated with subclasses of signatures constructor (if no better matched variants available).
		 * So if you are planning to overload a function with variant, which will accept Arrays, you should call
		 * <pre>
function (){}.signature(Array)
</pre>
If you planning to overload with variant, which will accept string as 1st parameter and Ext.Component as a 2nd, you should call <pre>
function (){}.signature(String, Ext.Component)
</pre>
etc<br><br>For variant with no parameters call signature without arguments:<pre>
function (){}.signature()
</pre>
<b>Note:</b> If the function have no signature it will be used as a "catcher" during overloading - it will be called if and only if no other variants with matched signatures founded.<br>
<b>Note:</b> If <b>undefined</b> is used as a constructor value it will match any value<br>
<br><b>Examples</b><br>
Function will accept Array as a parameter 
<pre>
function (arr) {
    for (var i = 0; i < arr.length; i++) {
        this.add(arr[i]);
    } 
}.<b>signature</b>(Array)
</pre>
Function will accept Function as a 1st parameter and Ext.Container or any of its subclasses (Ext.Panel, Ext.Window etc) as a 2nd
<pre>
function (func, panel) {
    this.add( func(panel) );
}.<b>signature</b>(Function, Ext.Container)
</pre>
Function will accept 2 any parameters.
<pre>
function (param1, param2) {
    this.add( func(panel) );
}.<b>signature</b>(undefined, undefined)
</pre>

  
		 * @param {Function} constructor1
		 * @param {Function} constructor2 
		 * @param {Function} constructor3
		 * @param ...  
		 * @methodOf Function
		 * @name Function#signature
		 * @return {Function} The function with defined signature.
		 */
		signature : function () {
			if (this.__slots) throw "Cant define a signature for overloaded function";
			
			this.__signature = Array.prototype.slice.call(arguments);
			return this;
		},
		
		/**
		 * This function checks if this class is a passed class or its subclass.
		 * @param {Class} superClass The class to check
		 * @methodOf Function
		 * @name Function#isa
		 * @return {Boolean} The result of check
		 * @example
Ext.ux.myWindow = <b>Ext.ux.extend</b>(Window, {
    ...
});

Ext.ux.myDialog = <b>Ext.ux.extend</b>(Ext.ux.myWindow, {
    ...
});

if (Ext.ux.myDialog.<b>isa</b>(Ext.ux.myWindow)) {
    ...
}
</pre> 
		 */
		isa : function (superClass) {
			for (var currClass = this; currClass; currClass = currClass.__superclass) {
				if (currClass === superClass) return true;
			}
			return false;
		}
	});
	
};

