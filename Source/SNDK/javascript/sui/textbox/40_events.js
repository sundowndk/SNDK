// ------------------------------------
// Events
// ------------------------------------
// ------------------------------------	

// ------------------------------------
// eventOnKeyPress
// ------------------------------------			
function eventOnKeyPress (event)
{
	_attributes.value = _elements["input"].value;			
							
	
}

function getValue ()
{
	var result = _attributes.value;

	switch (_attributes.textTransform.toLowerCase ())
	{
		case "uppercase":
		{				
			result = result.toUpperCase ();
			break;
		}
	}				
	
	return result;
}

function transform ()
{

	switch (_attributes.textTransform.toLowerCase ())
	{
		case "uppercase":
		{
			//_attributes.value = _attributes.value.toUpperCase ();
			return _attributes.value.toUpperCase ();
			//_elements["input"].value = _attributes.value.toUpperCase ();
			break;
		}
	}				
}

// ------------------------------------
// onKeyUp
// ------------------------------------	
function eventOnKeyUp (event)
{
	var result = true;
		
	var key = keyHandler (event);
	
	

	//_attributes.value = _elements["input"].value;				
				
	if (_attributes.onKeyUp != null)
	{
		setTimeout( function () { _attributes.onKeyUp (_attributes.tag); }, 1);
	}	
	
	// ONENTER
	if (key == 13)
	{
		if (_attributes.onEnter != null)
		{
			setTimeout( function () { _attributes.onEnter (_attributes.tag); }, 1);
		}	
	}
	

	
	eventOnChange ();
						
	return result;
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
				setTimeout( function () { _attributes.onFocus (_attributes.tag); }, 1);
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
				setTimeout( function () { _attributes.onBlur (_attributes.tag); }, 1);
			}			
		}
	}
}	

// ------------------------------------
// onChange
// ------------------------------------			
function eventOnChange ()
{	
	_attributes.value = _elements["input"].value;
		
	if (_attributes.onChange != null)
	{	
		setTimeout( function () { _attributes.onChange (_attributes.tag); }, 1);
	}
}
