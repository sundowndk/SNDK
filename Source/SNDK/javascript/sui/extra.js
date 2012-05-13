initalized : false,


initialized : false,
strapped : false,
domReady : false,

previousOrientation : 0,

// ------------------------------------
// init
// ------------------------------------	
init : function ()
{
	var init = 	function ()
				{
					window.triggerEvent ("SUIINIT");
					SNDK.SUI.refresh ();
				
					window.addEvent (window, 'orientationchange', SNDK.SUI.checkOrientation)			
					window.addEvent (window, 'resize', SNDK.SUI.refresh);	
				
					SNDK.SUI.initialized = true;
					SNDK.SUI.domReady = true;
				};
	
	if (!SNDK.SUI.strapped)
	{
		window.onDomReady (init);
		SNDK.SUI.strapped = true;
	}						
	else
	{
		if (SNDK.SUI.domReady)
		{
			init ();
		}
	}
},

// ------------------------------------
// addInit
// ------------------------------------	
addInit : function (obj)
{
	var init = 	function ()
				{				
					try
					{
						
						if (obj._temp.initialized != true)
						{
						
//	try
//	{

//								if (obj._attributes.appendTo == null)
//								{
//									obj._attributes.appendTo = document.getElementById ("suistageing");
//								}
	
								if (typeof (obj._attributes.appendTo) == "string")
								{
									obj._attributes.appendTo = document.getElementById (obj._attributes.appendTo);
								}

											
								obj._attributes.appendTo.appendChild (obj._elements["container"])
							
							//console.log (obj._attributes.appendTo)
//	}
//	catch (e)
//	{}
					

							obj._init ();
					
							obj._temp.initialized = true;			
							
							window.removeEvent (window, 'SUIINIT', init);
					
						}
					}
					catch (e)
					{
						console.log (e)
					}
				}

		window.addEvent (window, 'SUIINIT', init);
},

// ------------------------------------
// redraw
// ------------------------------------	
redraw : function ()
{
	if (SNDK.SUI.initialized)
	{
		window.triggerEvent ("SUIINIT");	
		SNDK.SUI.refresh ();	
	}
},

// ------------------------------------
// refresh
// ------------------------------------	
refresh : function ()
{
	var refresh = 	function ()
					{
						window.triggerEvent ("SUIREFRESH");
					};

	try
	{
		refresh ();
	}
	catch (error)
	{	
		window.onDomReady (refresh);
	}	
},

// ------------------------------------
// checkOrientation
// ------------------------------------	
checkOrientation : function ()
{
    if (window.orientation !== SNDK.SUI.previousOrientation)
    {
		SNDK.SUI.previousOrientation = window.orientation;
    }
}
