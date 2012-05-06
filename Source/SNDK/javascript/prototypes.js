// ------------------------------------
// startsWith
// ------------------------------------	
String.prototype.startsWith = function (prefix, ignoreCase) 
{
    if (!prefix) return false;
    if (prefix.length > this.length ) return false;
    if (ignoreCase) 
    {
        if (ignoreCase == true) 
        {
            return (this.substr (0, prefix.length).toUpperCase () == prefix.toUpperCase ());
        }
    }
    return (this.substr (0, prefix.length) === prefix);
}

// ------------------------------------
// endsWidth
// ------------------------------------	
String.prototype.endsWith = function (suffix,ignoreCase) 
{
    if (!suffix) return false;
    if (suffix.length > this.length) return false;
    if (ignoreCase) 
    {
        if (ignoreCase == true)
        {
            return (this.substr (this.length - suffix.length).toUpperCase () == suffix.toUpperCase ());
        }
    }
    return (this.substr (this.length - suffix.length) === suffix);
}

// ------------------------------------
// trim
// ------------------------------------	
String.prototype.trim = function () 
{
    return this.replace (/^\s+|\s+$/g, '');
}

// ------------------------------------
// trimEnd
// ------------------------------------	
String.prototype.trimEnd = function (character)
{	
	if (this.substr (this.length-1, 1) == character)
	{
		return this.substr (0, this.length - character.length);
	}
	
	return this;
}
