var _elements = new Array ();
var _attributes = attributes;
		
var _temp = 	{ initialized: false,
	  	  
		};
							
setAttributes ();		

// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;	
this._init = init;		

// Functions
this.type = "TEXTBOX";
this.refresh = functionRefresh;	
this.dispose = functionDispose;
this.getAttribute = functionGetAttribute;
this.setAttribute = functionSetAttribute;	
	
// Construct
construct ();

// Initialize	
SNDK.SUI.addInit (this);
