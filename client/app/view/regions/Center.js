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
		anchor: '100% 100%' ,
		layout: 'anchor' ,
		bodyPadding: '5px' ,
		items: [{
			// Chat area
			xtype: 'textarea' ,
			id: 'taChat' ,
			anchor: '100% 95%' ,
			readOnly: true
		} , {
			// Send message box
			xtype: 'textfield' ,
			id: 'tfSendMsg' ,
			anchor: '100%' ,
			// Disabled to default
			disabled: true ,
			enableKeyEvents: true ,
			allowBlank: false
		}]
	}]
});
