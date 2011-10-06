initalized : false,

previousOrientation : 0,

checkOrientation : function()
{

    if(window.orientation !== SNDK.SUI.previousOrientation){
	SNDK.SUI.previousOrientation = window.orientation;

//	alert (SNDK.SUI.previousOrientation +" "+ screen.width)

//	window.addEvent (window, 'resize', SNDK.SUI.refresh);	

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

//				setTimeout (	function () 
//				{	
//					window.triggerEvent ("SUIREFRESH");
//			
//				}, 100);
			}

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
// init
// ------------------------------------	
init : function ()
{
	var init = 	function ()
			{
				window.triggerEvent ("SUIINIT");	
				SNDK.SUI.refresh ();
				SNDK.SUI.running = true;
				
				var test = function ()
				{
					SNDK.SUI.refresh ();	
				}
				
				window.addEvent (window, 'orientationchange', SNDK.SUI.checkOrientation)
				
				window.addEvent (window, 'resize', SNDK.SUI.refresh);	
			}
			
	window.onDomReady (init);
},

addInit : function (obj)
{
	var init = 	function ()
			{
				try
				{
				if (obj._temp.initalized != true)
				{

					if (typeof (obj._attributes.appendTo) == "string")
					{
						obj._attributes.appendTo = document.getElementById (obj._attributes.appendTo);
					}

//					console.log (obj)
					obj._attributes.appendTo.appendChild (obj._elements["container"])


					obj._init ();
					
					obj._temp.initialized = true;
				}
				}
				catch (e)
				{
					console.log (e)
				}
			}

	if (SNDK.SUI.initalized)
	{
		init ();
		SNDK.SUI.refresh ();
	}
	else
	{
		window.addEvent (window, 'SUIINIT', init);
	}
}
