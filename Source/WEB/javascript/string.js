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
}
