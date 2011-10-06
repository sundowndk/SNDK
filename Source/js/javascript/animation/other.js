
// ------------------------------------
// opacityFade
// ------------------------------------		
opacityFade : function (element, opacitystart, opacityend, delay) 
{
	var speed = Math.round (delay / 100);
	var timer = 0;

	if (opacitystart > opacityend) 
	{
        	for (i = opacitystart; i >= opacityend; i--) 
        	{		        	    	
   					SNDK.animation.opacityFadeHelper (element, i, timer * speed)
        	    	timer++;
        	}
	} 
	else if (opacitystart < opacityend) 
	{
		for (i = opacitystart; i <= opacityend; i++)
		{
			SNDK.animation.opacityFadeHelper (element, i, timer * speed)			
			timer++;
		}
	}
},		

// ------------------------------------
// opacityFadeHelper
// ------------------------------------	
opacityFadeHelper : function (element, opacity, timeout)
{
      	    setTimeout(	function () { SNDK.tools.opacityChange (element, opacity);} ,timeout);		
}