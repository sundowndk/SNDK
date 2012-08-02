// -----------------------------------------------------------------------------------------------------------------
// Private functions
// ----------------------------------------------------------------------------------------------------------------- 	
// ------------------------------------
// Init
// ------------------------------------
function init ()
{
	updateCache ();
			
	refresh ();		
}

// ------------------------------------
// Construct
// ------------------------------------
function construct ()
{			
	SNDK.debugStopRefresh = true;
	
	// Blocker.
	_elements.blocker = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
	SNDK.tools.changeOpacityByObject (_elements.blocker, 0);	

	// Container.
	_elements.container = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
	_elements.container.className = "modal";
	_elements.container.style.display = "none";		
	SNDK.tools.changeOpacityByObject (_elements.container, 0);								
	
	// Bar.
	_elements.bar = SNDK.tools.newElement ("div", {appendTo: _elements.container});
	_elements.bar.className = "modal-bar";
	
	// Title.
	_elements.title = SNDK.tools.newElement ("h2", {appendTo: _elements.bar});
	
	// Content.
	_elements.content = SNDK.tools.newElement ("div", {appendTo: _elements.container});
	_elements.content.className = "modal-bg";		

	// Canvas.
	var canvas = new SNDK.SUI.canvas ({canScroll: false, appendTo: _elements.content,  width: "100%", height: "100%"});
				
	// UI.
	_elements.ui = {};
	
	
	
	
	// Process UI from xml document.
	if (_attributes.UIXML)
	{
		_elements.ui = SNDK.SUI.builder.construct ({XML: _attributes.UIXML, appendTo: canvas});	
	}
	
	// Fetch UI from URL.
	if (_attributes.UIURL != null)
	{				
		_elements.ui = SNDK.SUI.builder.construct ({URL: _attributes.UIURL, appendTo: canvas});	
	}
	
	_elements.ui.canvas = canvas;
															
	SNDK.SUI.init ();
			
	// Busy.
	_elements.busy = SNDK.tools.newElement ("div", {appendTo: _elements.content});
	_elements.busy.style.display = "none";
	_elements.busy.className = "modal-busy";
			
	// Hook events.		
	window.addEvent (window, 'resize', refresh);				
	
	SNDK.debugStopRefresh = false;
}

// ------------------------------------
// Refresh
// ------------------------------------				
function refresh ()
{
	_elements.title.innerHTML = _attributes.title;
	
	setDimensions ();
}	
	
// ------------------------------------
// updateCache
// ------------------------------------
function updateCache ()
{
	_temp.cache["containerBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);

	_temp.cache["barBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);
	_temp.cache["barHeight"] = SNDK.tools.getElementStyledHeight (_elements["bar"]);
						
	_temp.cache.containerHeight = _temp.cache.containerBoxDimensions.vertical + _temp.cache.barHeight + _temp.cache.barBoxSize.vertical ;
	_temp.cache.containerWidth = _temp.cache.containerBoxDimensions.horizontal + _temp.cache.barBoxSize.horizontal;
	
	_temp.cache["barBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);		
}	

// ------------------------------------
// Refresh
// ------------------------------------	
function setAttributes ()
{
	// Width
	if (!_attributes.width) 
		_attributes.width = "content";	
					
	if (_attributes.width != "content")
	{
		if (_attributes.width.substring (_attributes.width.length - 1) == "%")
		{	
			_attributes.widthType = "percent";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
		}
		else
		{	
			_attributes.widthType = "pixel";
			_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
		}
	}
	else
	{
		_attributes.widthType = "content";
	}
	
	// Height
	if (!_attributes.height) 
		_attributes.height = "content";
				
	if (_attributes.height != "content")
	{
		if (_attributes.height.substring (_attributes.height.length - 1) == "%")
		{
			_attributes.heightType = "percent";
			_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
		}
		else
		{
			_attributes.heightType = "pixel";
			_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
		}	
	}
	else
	{
		_attributes.heightType = "content";		
	}
	
	// Title
	if (!_attributes.title) 
		_attributes.title = "";					
}
	
// ------------------------------------
// SetDimensions
// ------------------------------------			
function setDimensions ()
{
	var width = 0;
	var height = 0;

	if (_attributes.widthType != "pixel")
	{																										
		width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
	}
	else
	{	
		width = _attributes.width ;
	}	
		
	if (_attributes.heightType != "pixel")
	{																										
		height = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100);
	}
	else
	{	
		height = _attributes.height ;
	}			

	_elements["content"].style.width = width - (_temp.cache.containerWidth) +"px";
	_elements["content"].style.height = height - (_temp.cache.containerHeight) +"px";
	
	_elements["busy"].style.width = width - (_temp.cache.containerWidth) +"px";		
	_elements["busy"].style.height = height - (_temp.cache.containerHeight) +"px";
	
	
	
	
			
	var windowSize = SNDK.tools.getWindowSize ();							
	
//		console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
//		console.log (_temp.cache.containerWidth)
//		console.log (_temp.cache.containerHeight)						
//		console.log (windowSize)		
//		console.log (width)

	var left = (windowSize[0] - width) / 2;				
	var top = (windowSize[1] - height) / 2;
	
	
	_temp.top = top;
	_temp.left = left;
	
//		console.log (windowSize[0] - width)

	_elements["container"].style.left = left +"px";					
	_elements["container"].style.top = top +"px";				
}				

// ------------------------------------
// open
// ------------------------------------	
function open ()
{
	if (!_temp.isOpen)
	{
		// If no other windows are open, we need to setup the modal container.
		if (SNDK.SUI.modal.depth == 0)
		{			
			SNDK.SUI.modal.container.className =  "with-blocker";		
		}
		
		// Add modal depth.
		SNDK.SUI.modal.depth++;
		
		// Show blocker.
		_elements.blocker.className = "modal-blocker visible";
		_elements.blocker.style.display = "block";
		SNDK.animation.opacityFade (_elements.blocker, 0, 100, 150);
		
		// Show container.
		_elements.container.style.display = "block";			
		SNDK.animation.opacityFade (_elements.container, 0, 100, 200);		
		
		// Set Window dimensions.
		setDimensions ();	

		// Animate container.
		var anim = new SNDK.animation.animate ({ element: _elements["container"], 
							 duration: 350, 
							 fps: 60, 
							 top: {	begin: (_temp.top - 80) +"px", 
							 	end: _temp.top +"px", 
							 	ease: "outexpo"
							 	}
							});
		//anim.play ();	
		
		SNDK.SUI.refresh ();
		
		_temp.isOpen = true;		
	}
}

// ------------------------------------
// close
// ------------------------------------	
function close ()
{
	if (_temp.isOpen)
	{		
		// Hide blocker.
		SNDK.animation.opacityFade (_elements.container, 100, 0, 200);
					
		// Hide container.
		SNDK.animation.opacityFade (_elements.blocker, 100, 0, 200);
	
		// Animate container.		
		var anim = new SNDK.animation.animate ({ element: _elements.container, 
							 duration: 350, 
							 fps: 60, 
							 top: {	begin: _temp.top +"px", 
							 	end: (_temp.top - 80) +"px", 
							 	ease: "outexpo"
							 	}
							});
//		anim.play ();
		
		// Unblock content underneath when done.
		var onDone = 	function ()
				{
					// Remove modal depth.
					SNDK.SUI.modal.depth--;
		
					// If no other windows are open, we need to remove the blocker.
					if (SNDK.SUI.modal.depth == 0)
					{			
						SNDK.SUI.modal.container.className =  "";		
					}		
					
					_elements.blocker.className = "";
					_elements.blocker.style.display = "none";			
				
					_temp.isOpen = false;
				};	
				
		setTimeout (onDone, 400);
	}
}

// ------------------------------------
// dipose
// ------------------------------------				
function dispose ()
{	
	close ();
	
	// When all is done, make sure to remove all traces of the modal window.
	var onDone =	function ()
			{		
				// Dispose all UI elements.																														
				for (index in _elements.ui)
				{
					try
					{
						_elements.ui[index].dispose ();
					}
					catch (e)
					{
						console.log (e);
						console.log ("CANNOT DISPOSE: ");
						console.log (_elements.ui[index]);
					}
				}								

				SNDK.SUI.modal.container.removeChild (_elements.blocker);
				SNDK.SUI.modal.container.removeChild (_elements.container);
			};
			
	// Unhook events.
	window.removeEvent (window, 'resize', refresh);					
					
	setTimeout (onDone, 400 + 10); 
}	

function toggleBusy ()
{
	if (!_temp.isBusy)
	{
		_elements.busy.style.display = "block";
		SNDK.animation.opacityFade (_elements.busy, 0, 50, 150);	
		_temp.isBusy = true;
	}
	else
	{
		SNDK.animation.opacityFade (_elements.busy, 50, 0, 150);
		
		var onDone = 	function ()
				{
					_elements.busy.style.display = "none";
					_temp.isBusy = false;
				};
		
		setTimeout (onDone, 150);			
	}
}
