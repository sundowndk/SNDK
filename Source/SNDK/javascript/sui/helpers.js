

// ------------------------------------
// getContainer
// ------------------------------------	
getContainer : function (options)
{
	var element;

	if (options.appendTo != null)
	{
		if (typeof (options.appendTo) == "string")
		{
			element = SNDK.tools.newElement ("div", {appendTo: document.getElementById (options.appendTo)});
		}
		else
		{
			element = SNDK.tools.newElement ("div", {appendTo: options.appendTo});
		}
	}
	else if (options.element != null)
	{
		if (typeof (options.element) == "string")
		{
			element = document.getElementById (options.element);
			options.name = options.element;
		}
		else
		{
			element = options.element;
			options.name = container.id;
		}
	}
	else
	{
		throw "Nowhere to park control.";
	}
	
	if (options.id)
	{
		element.setAttribute ("id", options.id);
	}

	// TODO: remove this.	
	if (options.stylesheet)
	{
		element.className = options.stylesheet;	
	}
	
	return element;
}