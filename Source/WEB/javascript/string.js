// ------------------------------------
// format
// ------------------------------------	
format : function (format,args)
{
    var result = format;
    for(var i = 1 ; i < arguments.length ; i++) 
    {
        result = result.replace (new RegExp( '\\{' + (i-1) + '\\}', 'g' ),arguments[i]);
    }
    return result;
},

// ------------------------------------
// isNullOrEmpty
// ------------------------------------	
isNullOrEmpty : function (value)
{
    if(value)
    {
        if( typeof (value) == 'string' )
        {
             if (value.length > 0)
             return false;
        }
	if (value != null)
        return false;
    }
    return true;
},

/**
 * Checks whether a string contains a given character.
 * @param {string} s The string to test.
 * @param {string} ss The substring to test for.
 * @return {boolean} True if {@code s} contains {@code ss}.
 */
contains : function (s, ss) 
{
	return s.indexOf(ss) != -1;
},

trimEnd : function (s, ss)
{	
	if (s.substr (s.length - ss.length, ss.length) == ss)
	{
		return s.substr (0, s.length - ss.length);
	}
	
	return s;
}

