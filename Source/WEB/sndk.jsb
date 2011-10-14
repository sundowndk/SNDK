<solution name="SNDK" outputdirectory="">	
	<project name="sndk">
		<class name="SNDK">	
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
			</class>			
			<class name="SUI">
				<js file="javascript/sui/listview.js" />
				<js file="javascript/sui/checkbox.js" />
				<js file="javascript/sui/button.js" />
				<js file="javascript/sui/dropbox.js" />				
				<js file="javascript/sui/iconview.js" />
				<js file="javascript/sui/textarea.js" />
				<js file="javascript/sui/textbox.js" />
				<js file="javascript/sui/upload.js" />
				<js file="javascript/sui/container.js" />
				<js file="javascript/sui/layoutbox.js" />
				<js file="javascript/sui/label.js" />
				<js file="javascript/sui/tabview.js" />
				<js file="javascript/sui/text.js" />
				<js file="javascript/sui/canvas.js" />				
				
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
		</class>		
		<js file="javascript/prototypes.js" />
		<js file="javascript/client.js" />
		<js file="javascript/eventhandler.js" />	
		<js file="javascript/init.js" />
	</project>	
</solution>