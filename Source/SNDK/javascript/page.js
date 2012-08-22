hasFocus : true,
		
init : function ()
{
	try
	{
	document.onkeypress = SNDK.page.onKeyDown;
	}
	catch (erorr)
	{}
},

keyHandler : function (event)
{		
	var key = SNDK.tools.getKey (event);

	if (!SNDK.page.hasFocus)
	{
		if (key == 38)
		{
			return false;
		}

		if (key == 40)
		{
			return false;
		}			
	}

	if (key == 27)															// Esc
	{ 			
		return false;
	}				

	return true;
},
				
onKeyDown : function (event)
{
	return SNDK.page.keyHandler (event);
}