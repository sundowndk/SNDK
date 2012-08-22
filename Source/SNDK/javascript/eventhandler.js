
try
{
/*********************************************************************
 * No onMouseOut event if the mouse pointer hovers a child element 
 * *** Please do not remove this header. ***
 * This code is working on my IE7, IE6, FireFox, Opera and Safari
 * 
 * Usage: 
 * <div onMouseOut="fixOnMouseOut(this, event, 'JavaScript Code');"> 
 *		So many childs 
 *	</div>
 *
 * @Author Hamid Alipour Codehead @ webmaster-forums.code-head.com		
**/
function is_child_of (parent, child) 
{
	if (child != null) 
	{			
		while (child.parentNode) 
		{
			if ((child = child.parentNode) == parent) 
			{
				return true;
			}
		}
	}
	return false;
}

function fixOnMouseOut (element, event, JavaScript_code) 
{
	var current_mouse_target = null;
	if (event.toElement) 
	{				
		current_mouse_target = event.toElement;
	} 
	else if (event.relatedTarget) 
	{				
		current_mouse_target = event.relatedTarget;
	}

	if (!is_child_of(element, current_mouse_target) && element != current_mouse_target) 
	{
		eval (JavaScript_code);
	}
}
/*********************************************************************/
// -------------------------------------------------------------------------------------------------------------------------
// Event handling
// -------------------------------------------------------------------------------------------------------------------------
function addEvent (element, type, handler) 
{
	if ((type === "DOMContentLoaded" || type === "domload")) 
	{
		if(typeof domReady === "function") 
		{
			domReady(handler);
			return;
		} 
		else 
		{
			type = "load";
		}
	}
	
	if (element.addEventListener) 
	{
		element.addEventListener(type, handler, false);
	} 
	else 
	{
		// assign each event handler a unique ID
		if (!handler.$$guid) 
		{
			handler.$$guid = addEvent.guid++;
		}
		
		// create a hash table of event types for the element
		if (!element.events) 
		{
			element.events = {};
		}
		
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) 
		{
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) 
			{
				handlers[0] = element["on" + type];
			}
		}
		
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
	
	return  addEvent.guid;
}

// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent (element, type, handler) 
{
	if (element.removeEventListener) 
	{
		element.removeEventListener(type, handler, false);
	} 
	else 
	{
		// delete the event handler from the hash table
		if (element.events && element.events[type]) 
		{
			delete element.events[type][handler.$$guid];
		}
	}
}

function handleEvent (event) 
{
	var returnValue = true;

	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);

	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];

	// execute each event handler
	for (var i in handlers) 
	{
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) 
		{
			returnValue = false;
		}
	}
	
	return returnValue;
}

function fixEvent (event) 
{
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}

fixEvent.preventDefault = function() 
{
	this.returnValue = false;
};

fixEvent.stopPropagation = function() 
{
	this.cancelBubble = true;
};

if (!window.addEventListener) 
{
	document.onreadystatechange = function()
	{
		if (window.onload && window.onload !== handleEvent) 
		{
			addEvent(window, 'load', window.onload);
			window.onload = handleEvent;
		}
	};
}

function triggerEvent (event)
{
	if (document.createEvent) 
	{
		var e = document.createEvent('HTMLEvents');
		e.initEvent(event, true, false);
		document.body.dispatchEvent(e);
	} 
	else if (document.createEventObject) 
	{
		document.body.fireEvent("on"+ event);
	}
}

var domReadyEvent = 
{
	name: "domReadyEvent",
	// Array of DOMContentLoaded event handlers.
	events: {},
	domReadyID: 1,
	bDone: false,
	DOMContentLoadedCustom: null,

	// Function that adds DOMContentLoaded listeners to the array.
	add: function (handler) 
	{
		// Assign each event handler a unique ID. If the handler has an ID, it
		// has already been added to the events object or been run.
		if (!handler.$$domReadyID) 
		{
			handler.$$domReadyID = this.domReadyID++;

			// If the DOMContentLoaded event has happened, run the function.
			if(this.bDone)
			{
				handler();
			}

			// store the event handler in the hash table
			this.events[handler.$$domReadyID] = handler;
		}
	},

	remove: function (handler) 
	{
		// Delete the event handler from the hash table
		if (handler.$$domReadyID) 
		{
			delete this.events[handler.$$domReadyID];
		}
	},

	// Function to process the DOMContentLoaded events array.
	run: function () 
	{
		// quit if this function has already been called
		if (this.bDone) 
		{
			return;
		}

		// Flag this function so we don't do the same thing twice
		this.bDone = true;

		// iterates through array of registered functions 
		for (var i in this.events) 
		{
			this.events[i]();
		}
	},

	schedule: function () 
	{
		// Quit if the init function has already been called
		if (this.bDone) 
		{
			return;
		}
	
		// First, check for Safari or KHTML.
		if (/KHTML|WebKit/i.test(navigator.userAgent)) 
		{
			if (/loaded|complete/.test(document.readyState)) 
			{
				this.run();
			} 
			else 
			{
				// Not ready yet, wait a little more.
				setTimeout(this.name + ".schedule()", 100);
			}
		} 
		else if (document.getElementById("__ie_onload")) 
		{
			// Second, check for IE.
			return true;
		}

		// Check for custom developer provided function.
		if (typeof this.DOMContentLoadedCustom === "function") 
		{
			//if DOM methods are supported, and the body element exists
			//(using a double-check including document.body, for the benefit of older moz builds [eg ns7.1] 
			//in which getElementsByTagName('body')[0] is undefined, unless this script is in the body section)
			if (typeof document.getElementsByTagName !== 'undefined' && (document.getElementsByTagName('body')[0] !== null || document.body !== null)) 
			{
				// Call custom function.
				if (this.DOMContentLoadedCustom()) 
				{
					this.run();
				} 
				else 
				{
					// Not ready yet, wait a little more.
					setTimeout(this.name + ".schedule()", 250);
				}
			}
		}

		return true;
	},

	init: function() 
	{
		// If addEventListener supports the DOMContentLoaded event.
		if(document.addEventListener) 
		{
			document.addEventListener("DOMContentLoaded", function() { domReadyEvent.run(); }, false);
		}

		// Schedule to run the init function.
		setTimeout("domReadyEvent.schedule()", 100);

		function run() 
		{
			domReadyEvent.run();
		}
		
		// Just in case window.onload happens first, add it to onload using an available method.
		if(typeof addEvent !== "undefined") 
		{
			addEvent(window, "load", run);
		} 
		else if (document.addEventListener) 
		{
			document.addEventListener("load", run, false);
		} 
		else if (typeof window.onload === "function") 
		{
			var oldonload = window.onload;
			window.onload = function() 
					{
						domReadyEvent.run();
						oldonload();
					};
		} 
		else 
		{
			window.onload = run;
		}

		/* for Internet Explorer */
		/*@cc_on
			@if (@_win32 || @_win64)
			document.write("<script id=__ie_onload defer src=\"//:\"><\/script>");
			var script = document.getElementById("__ie_onload");
			script.onreadystatechange = function() {
				if (this.readyState == "complete") {
					domReadyEvent.run(); // call the onload handler
				}
			};
			@end
		@*/
	}
};

var onDomReady = function (handler) { domReadyEvent.add(handler); };

domReadyEvent.init ();


function bla ()
{

/*
This function calculates window.scrollbarWidth and window.scrollbarHeight

This must be called
“onload” to work correctly (or on “DOM ready”, if you’re using
a framework that provides such an event)
*/

try
{
var i = document.createElement("p");
i.style.width = "100%";

i.style.height = "200px";

var o = document.createElement("div");
o.style.position = "absolute";
o.style.top = "0px";
o.style.left = "0px";
o.style.visibility = "hidden";
o.style.width = "200px";
o.style.height = "150px";
o.style.overflow = "hidden";
o.appendChild(i);

document.body.appendChild(o);
var w1 = i.offsetWidth;
var h1 = i.offsetHeight;
o.style.overflow = "scroll";
var w2 = i.offsetWidth;
var h2 = i.offsetHeight;
if (w1 == w2) w2 = o.clientWidth;
if (h1 == h2) h2 = o.clientWidth;

document.body.removeChild(o);

window.scrollbarWidth = w1-w2;
window.scrollbarHeight = h1-h2;
}
catch (error)
{

}

};


window.onDomReady (bla);



}
catch (error)
{

}