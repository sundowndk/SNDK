show : function (attributes)
{
	var dialog;
		
	var onClick =	function ()
					{
						dialog.dispose ();
					};
	
	var buttons = [{label: attributes.buttonLabel, onClick: onClick}];


	dialog = new SNDK.SUI.modal.dialog.base ({text: attributes.text, width: "400px", height: "90px", buttons: buttons});
	
	dialog.open ();
}
