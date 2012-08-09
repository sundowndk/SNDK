// -----------------------------------------------------------------------------------------------------------------
// Public functions
// ----------------------------------------------------------------------------------------------------------------- 	
// ------------------------------------
// addUIElement
// ------------------------------------			
function functionAddUIElement (element)
{		
	//_elements.ui[element.getAttribute ("tag")] = element;
	
	_elements.ui.canvas.addUIElement (element);
	
	//return element;

}

// ------------------------------------
// addUIElementByXML
// ------------------------------------	
function functionAddUIElementsByXML (xml, appendTo)
{
	var elements = SNDK.SUI.builder.construct ({XML: xml, appendTo: appendTo});
	
	for (i in elements)
	{		
		_elements["ui"][i] = elements[i];		
	}
}

// ------------------------------------
// getUIElement
// ------------------------------------	
function functionGetUIElement (tag)
{

	if (_elements.ui[tag] != null)
	{
		return _elements.ui[tag];
	}
	else
	{
		throw "No UI element with tag '"+ tag +"' was found.";
	}									
}

//	function showBusy ()
//	{
//		_elements["busy"].style.display = "block";
//		SNDK.animation.opacityFade (_elements["busy"], 0, 100, 150);
//	}

//	function hideBusy ()
//	{
//		SNDK.animation.opacityFade (_elements["busy"], 100, 0, 150);
//		
//				setTimeout (	
//		function () 
//				{ 
//					_elements["busy"].style.display = "none";	
//				}, 150);
//
//	}




// ------------------------------------
// open
// ------------------------------------		
function functionOpen ()
{
	open ();
	
}

// ------------------------------------
// close
// ------------------------------------		
function functionClose ()
{
	close ();
}

// ------------------------------------
// dispose
// ------------------------------------	
function functionDispose ()
{
	dispose ();
}	

// ------------------------------------
// toggleBusy
// ------------------------------------	
function functionToggleBusy ()
{
	toggleBusy ();
}	


