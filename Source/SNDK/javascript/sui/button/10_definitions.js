var _elements = new Array ();			
var _attributes = attributes;				

var _temp = 	{ 
					initialized: false,
		  			mouseDown: false,
		  			mouseOver: false,
		  			enterDown: false,
		  			cache: new Array ()
				};

_attributes.id = SNDK.tools.newGuid ();				

setAttributes ();	
		
// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;	
this._init = init;			
			
// Functions
this.type = "BUTTON";
this.refresh = functionRefresh;
this.dispose = functionDispose;
this.getAttribute = functionGetAttribute;
this.setAttribute = functionSetAttribute;	
								
// Construct
construct ();
			
// Init Control
SNDK.SUI.addInit (this);	