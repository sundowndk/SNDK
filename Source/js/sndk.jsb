<solution name="SNDK" outputdirectory="../../Binary/">
	<project name="sndk">
		<class name="SNDK">	
			<class name="tools">
				<js file="sndk/tools.js" />
			</class>			
			<class name="animation">
				<js file="sndk/animation/animate.js" />
				<js file="sndk/animation/scene.js" />
				<js file="sndk/animation/other.js" />
				<class name="ease">
					<js file="sndk/animation/ease.js" />
				</class>				
			</class>
			<class name="page">
				<js file="sndk/page.js" />
			</class>
			<class name="widgets">
				<js file="sndk/widgets/rotator.js" />
				<js file="sndk/widgets/blobmenu.js" />
			</class>			
			<class name="SUI">
				<js file="sndk/sui/checkbox.js" />
				<js file="sndk/sui/button.js" />
				<js file="sndk/sui/dropbox.js" />				
				<js file="sndk/sui/iconview.js" />
				<js file="sndk/sui/listview.js" />
				<js file="sndk/sui/textarea.js" />
				<js file="sndk/sui/textbox.js" />
				<js file="sndk/sui/upload.js" />
				<js file="sndk/sui/container.js" />
				<js file="sndk/sui/layoutbox.js" />
				<js file="sndk/sui/label.js" />
				<js file="sndk/sui/tabview.js" />
				<js file="sndk/sui/scrollbox.js" />
				
				<class name="builder">
					<js file="sndk/sui/builder.js" />
				</class>	
				<class name="helpers">
					<js file="sndk/sui/helpers.js" />				
				</class>
				<js file="sndk/sui/extra.js" />
			</class>			
			<class name="ajax">
				<js file="sndk/ajax/request.js" />
			</class>
			<class name="string">
				<js file="sndk/string.js" />
			</class>
		</class>		
		<js file="sndk/prototypes.js" />
		<js file="sndk/client.js" />
		<js file="sndk/eventhandler.js" />	
		<js file="sndk/init.js" />
	</project>	
</solution>