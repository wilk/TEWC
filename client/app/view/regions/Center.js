// @file 	Center.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Center region where chat is displayed

Ext.define ('TEWC.view.regions.Center' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.centerregion' ,
	
	// Configuration
	region: 'center' ,
	layout: 'anchor' ,
	items: [{
		xtype: 'panel' ,
		title: 'Chat' ,
		id: 'chatPanel' ,
		anchor: '100% 95%' ,
		layout: 'anchor' ,
		bodyPadding: '5px' ,
		margin: '5 0 10 5' ,
		html: '<div id="chatBox" style="overflow-x:auto; overflow-y:auto;"></div>'
	} , {
		// Send message box
		xtype: 'textfield' ,
		id: 'tfSendMsg' ,
		anchor: '100%' ,
		// Disabled to default
		disabled: true ,
		enableKeyEvents: true ,
		allowBlank: false ,
		margin: '0 0 0 5'
	}]
});
