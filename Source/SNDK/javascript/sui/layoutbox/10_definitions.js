var _elements = new Array ();
var _attributes = attributes;
var _temp = 	{ initialized: false,
	 	  cache: new Array (),
	 	  contentHeight: 0
		};

_attributes.id = SNDK.tools.newGuid ();

setAttributes ();	

// Private functions
this._attributes = _attributes;
this._elements = _elements;
this._temp = _temp;	
this._init = init;	

this._height = getContainerHeight ();

// Functions		
this.refresh = functionRefresh;	
this.dispose = functionDispose;
this.addPanel = functionAddPanel;
this.getPanel = functionGetPanel;		
this.setAttribute = functionSetAttribute;
this.getAttribute = functionGetAttribute;

// Construct
construct ();
							
// Initialize
SNDK.SUI.addInit (this);
