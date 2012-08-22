<solution name="SNDK" outputdirectory="" buildjsm="true">	
	<project name="sndk">
		<class name="SNDK">	
			<js file="javascript/definitions.js" />
			<class name="cookie">	
				<js file="javascript/cookie.js" />
			</class>		
			<class name="tools">
				<js file="javascript/tools.js" />
			</class>			
			<class name="animation">
				<js file="javascript/animation/animate.js" />
				<js file="javascript/animation/scene.js" />
				<js file="javascript/animation/other.js" />
				<class name="ease">
					<js file="javascript/animation/ease.js" />
				</class>				
			</class>
			<class name="page">
				<js file="javascript/page.js" />
			</class>
			<class name="widgets">
				<js file="javascript/widgets/rotator.js" />
				<js file="javascript/widgets/blobmenu.js" />
				<js file="javascript/widgets/simplamenu.js" />
				<js file="javascript/widgets/shortcuts.js" />
			</class>			
			<class name="SUI">		
				<class name="modal">
					<js file="javascript/sui/modal/definitions.js" />
					<js file="javascript/sui/modal/functions.js" />					
					<class name="dialog">											
						<constructor name="base" variables="attributes">
							<js file="javascript/sui/modal/dialog/base/10_definitions.js" />
							<js file="javascript/sui/modal/dialog/base/20_private_functions.js" />
							<js file="javascript/sui/modal/dialog/base/30_public_functions.js" />					
						</constructor>
						<class name="alert">
							<js file="javascript/sui/modal/dialog/alert.js" />								
						</class>
						<class name="confirm">
							<js file="javascript/sui/modal/dialog/confirm.js" />
						</class>
					</class>
					<class name="chooser">
						<constructor name="base" variables="attributes">
							<js file="javascript/sui/modal/chooser/base/10_definitions.js" />
							<js file="javascript/sui/modal/chooser/base/20_private_functions.js" />
							<js file="javascript/sui/modal/chooser/base/30_public_functions.js" />					
						</constructor>
					</class>
					<constructor name="window" variables="attributes">
						<js file="javascript/sui/modal/window/10_definitions.js" />
						<js file="javascript/sui/modal/window/20_private_functions.js" />
						<js file="javascript/sui/modal/window/30_public_functions.js" />					
					</constructor>					
				</class>					
				<constructor name="canvas" variables="attributes">
					<js file="javascript/sui/canvas/10_definitions.js" />
					<js file="javascript/sui/canvas/20_private_functions.js" />
					<js file="javascript/sui/canvas/30_public_functions.js" />					
				</constructor>					
				<constructor name="container" variables="attributes">
					<js file="javascript/sui/container/10_definitions.js" />
					<js file="javascript/sui/container/20_private_functions.js" />
					<js file="javascript/sui/container/30_public_functions.js" />					
				</constructor>									
				<constructor name="listview" variables="attributes">
					<js file="javascript/sui/listview/10_definitions.js" />
					<js file="javascript/sui/listview/20_private_functions.js" />
					<js file="javascript/sui/listview/30_public_functions.js" />
					<js file="javascript/sui/listview/40_events.js" />
				</constructor>
				<constructor name="textbox" variables="attributes">
					<js file="javascript/sui/textbox/10_definitions.js" />
					<js file="javascript/sui/textbox/20_private_functions.js" />
					<js file="javascript/sui/textbox/30_public_functions.js" />					
					<js file="javascript/sui/textbox/40_events.js" />	
				</constructor>									
				<js file="javascript/sui/checkbox.js" />
				<js file="javascript/sui/layoutbox.js" />
				<js file="javascript/sui/button.js" />
				<js file="javascript/sui/dropbox.js" />				
				<js file="javascript/sui/iconview.js" />
				<js file="javascript/sui/textarea.js" />
				
				<js file="javascript/sui/upload.js" />							
				<js file="javascript/sui/label.js" />
				<js file="javascript/sui/tabview.js" />
				<js file="javascript/sui/text.js" />
				
				<js file="javascript/sui/htmlview.js" />			
				<js file="javascript/sui/image.js" />
						
						
				<js file="javascript/sui/field.js" />
					
				
				<class name="builder">
					<js file="javascript/sui/builder.js" />
				</class>	
				<class name="helpers">
					<js file="javascript/sui/helpers.js" />				
				</class>
				<js file="javascript/sui/extra.js" />
			</class>			
			<class name="ajax">
				<js file="javascript/ajax/request.js" />
			</class>
			<class name="string">
				<js file="javascript/string.js" />
			</class>
			<js file="javascript/include.js" />
		</class>	
		<js file="javascript/prototypes.js" />
		<js file="javascript/client.js" />
		<js file="javascript/eventhandler.js" />	
		<js file="javascript/init.js" />
	</project>	
</solution>