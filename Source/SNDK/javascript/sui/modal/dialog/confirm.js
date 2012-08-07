show : function (attributes)
{
	var dialog;
		
	var onClick =	function (result)
					{											
						dialog.dispose ();
						
						if (attributes.onDone != null)
						{
							setTimeout (function () {attributes.onDone (result)}, 1);
						}
					};
	
	var buttons = [{label: attributes.buttonLabel1, onClick: function () {onClick (1)}}, {label: attributes.buttonLabel2, onClick: function () {onClick (2)}}];

	dialog = new SNDK.SUI.modal.dialog.base ({text: attributes.text, width: "400px", height: "90px", buttons: buttons});
	
	dialog.open ();
}

