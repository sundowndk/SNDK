// ------------------------------------
// 
// ------------------------------------	
inquad: function (x, t, b, c, d) 
{
	return c*(t/=d)*t + b;
},

// ------------------------------------
// 
// ------------------------------------	
outquad: function (x, t, b, c, d) 
{
	return -c *(t/=d)*(t-2) + b;	
},
				
// ------------------------------------
// 
// ------------------------------------	
inoutquad: function (x, t, b, c, d) 
{
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
incubic: function (x, t, b, c, d) 
{
	return c*(t/=d)*t*t + b;
},

// ------------------------------------
// 
// ------------------------------------	
outcubic: function (x, t, b, c, d) 
{
	return c*((t=t/d-1)*t*t + 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutcubic: function (x, t, b, c, d) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inquart: function (x, t, b, c, d) 
{
	return c*(t/=d)*t*t*t + b;
},	

// ------------------------------------
// 
// ------------------------------------	
outquart: function (x, t, b, c, d) 
{
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutquart: function (x, t, b, c, d) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inquint: function (x, t, b, c, d) 
{
	return c*(t/=d)*t*t*t*t + b;
},

// ------------------------------------
// 
// ------------------------------------	
outquint: function (x, t, b, c, d) 
{
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
},
				
// ------------------------------------
// 
// ------------------------------------	
inoutquint: function (x, t, b, c, d) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
},

// ------------------------------------
// 
// ------------------------------------	
insine: function (x, t, b, c, d) 
{
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
},

// ------------------------------------
// 
// ------------------------------------	
outsine: function (x, t, b, c, d) 
{
	return c * Math.sin(t/d * (Math.PI/2)) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutsine: function (x, t, b, c, d) 
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inexpo: function (x, t, b, c, d) 
{
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
},

// ------------------------------------
// 
// ------------------------------------	
outexpo: function (x, t, b, c, d) 
{
	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutexpo: function (x, t, b, c, d) 
{
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
},

// ------------------------------------
// 
// ------------------------------------	
incirc: function (x, t, b, c, d) 
{
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
outcirc: function (x, t, b, c, d) 
{
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutcirc: function (x, t, b, c, d) 
{
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inelastic: function (x, t, b, c, d) 
{
	var s=1.70158;var p=0;var a=c;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
},

// ------------------------------------
// 
// ------------------------------------	
outelastic: function (x, t, b, c, d) 
{
	var s=1.70158;var p=0;var a=c;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutelastic: function (x, t, b, c, d) 
{
	var s=1.70158;var p=0;var a=c;
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
},

// ------------------------------------
// 
// ------------------------------------	
inback: function (x, t, b, c, d, s) 
{
	if (s == undefined) s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
},

// ------------------------------------
// 
// ------------------------------------	
outback: function (x, t, b, c, d, s) 
{
	if (s == undefined) s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inoutback: function (x, t, b, c, d, s) 
{
	if (s == undefined) s = 1.70158;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
},

// ------------------------------------
// 
// ------------------------------------	
inbounce: function (x, t, b, c, d) 
{
	return c - SNDK.animation.ease.inbounce (x, d-t, 0, c, d) + b;
},

// ------------------------------------
// 
// ------------------------------------	
outbounce: function (x, t, b, c, d) 
{
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}					
},

// ------------------------------------
// 
// ------------------------------------	
inoutbounce: function (x, t, b, c, d) 
{
	if (t < d/2) return SNDK.animation.ease.inBounce (x, t*2, 0, c, d) * .5 + b;
	return SNDK.animation.ease.outbounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
}			