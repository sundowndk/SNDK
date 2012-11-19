// ------------------------------------
// Events
// ------------------------------------		
// ------------------------------------
// eventOnChange
// ------------------------------------	
function eventOnChange ()
{
	if ((_elements["username"].getAttribute ("value")) != "" && (_elements["password"].getAttribute ("value") != ""))
	{
		_temp.ready = true;
		eventOnReady ();
	}
	else
	{
		_temp.ready = false;
	}
	
	if (_attributes.onChange != null)
	{
		setTimeout( function () { _attributes.onChange (this)}, 1);
	}
}

// ------------------------------------
// eventOnReady
// ------------------------------------	
function eventOnReady ()
{						
	if (_temp.ready)
	{							
		if (_attributes.onReady != null)
		{
			setTimeout( function () { _attributes.onReady ({username: _elements["username"].getAttribute (value), password: _elements["password"].getAttribute (value)}); }, 1);
		}						
	}
}

// ------------------------------------
// eventOnEnter
// ------------------------------------	
function eventOnEnter ()
{	
	if (_temp.ready)
	{		
		if (_attributes.onEnter != null)
		{
			setTimeout( function () { _attributes.onEnter ({username: _elements["username"].getAttribute ("value"), password: _elements["password"].getAttribute ("value")}); }, 1);
		}						
	}
}	

// ------------------------------------
// onFocus
// ------------------------------------		
function eventOnFocus ()
{
	if (!_attributes.disabled)
	{
		if (!_attributes.focus)
		{
			_attributes.focus = true;
			refresh ();
			
			if (_attributes.onFocus != null)
			{
				setTimeout( function () { _attributes.onFocus (_attributes.name); }, 1);
			}					
		}		
	}
}

// ------------------------------------
// onBlur
// ------------------------------------		
function eventOnBlur ()
{
	if (!_attributes.disabled)
	{
		if (_attributes.focus)
		{				
			_attributes.focus = false;
			refresh ();

			if (_attributes.onBlur != null)
			{
				setTimeout( function () { _attributes.onBlur (_attributes.name); }, 1);
			}									
		}
	}
}			