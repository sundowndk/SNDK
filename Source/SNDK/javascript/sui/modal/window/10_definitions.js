var _initialized = false;
var _attributes = attributes;	
var _elements = new Array ();
	
var _temp = 	{ 			  
		  controls: 0,
		  tabs: 0,
		  controlWidth: "533px",
		  controlWidthTabbed: "510px",
		  top: 0,
		  left: 0,
		  isBusy: false,
		  cache: Array (),
		  isOpen: false
		}
		
setAttributes ();

// Values
var _valuehidden = true;

// Methods		
this.open = functionOpen;
this.close = functionClose;	
this.dispose = functionDispose;
this.toggleBusy = functionToggleBusy;
	
this.getUIElement = functionGetUIElement;
this.addUIElement = functionAddUIElement;
//	this.addUIElementsByXML = functionAddUIElementsByXML;

this.setAttribute = functionSetAttribute;
this.getAttribute = functionGetAttribute;
	
// Construct
construct ();

// Init Control
init ();
