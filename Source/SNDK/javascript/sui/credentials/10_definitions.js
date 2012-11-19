// Private variables
var _attributes = attributes;
var _elements = new Array ();				
var _temp = 	{ 
					initialized: false,
					ready: false  			
				};
		
// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;	
this._init = init;			
			
// Functions
this.type = "SNDK.SUI.CREDENTIALS";
this.refresh = functionRefresh;
this.dispose = functionDispose;
this.getAttribute = functionGetAttribute;
this.setAttribute = functionSetAttribute;	
				
// Init attributes
setAttributes ();																											
																																																																			
// Construct
construct ();					

// Init Control
SNDK.SUI.addInit (this);