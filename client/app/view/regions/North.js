// @file 	North.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	North region where users can login

Ext.define ('TEWC.view.regions.North' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.northregion' ,
	
	// Configuration
	height: 30 ,
	region: 'north' ,
	html: '<h1 style="font-size: 16px; color: #fff; font-weight: normal; padding: 5px 10px;">TEWC :: The Easiest Web Chat</h1>' ,
	style: {
		background: '#7F99BE url(ext-4.0.2a/resources/images/layout-browser-hd-bg.gif) repeat-x center'
	} ,
	bodyPadding: '5 5 5 0' ,
	
	// Body
	items: [{
		// Login textfield
		xtype: 'textfield' ,
		id: 'tfUserLogin' ,
		style: {
			position: 'absolute' ,
			right: '60px' ,
			top: '5px' ,
			bottom: '5px'
		} ,
		emptyText: 'username' ,
		allowBlank: false ,
		enableKeyEvents: true
	} , {
		// Login button
		xtype: 'button' ,
		text: 'Login' ,
		id: 'bUserLogin' ,
		// Button position (right)
		style: {
			position: 'absolute' ,
			right: '10px' ,
			top: '5px' ,
			bottom: '5px'
		}
	}]
});
