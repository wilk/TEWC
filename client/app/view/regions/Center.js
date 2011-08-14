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
		xtype: 'textarea' ,
		anchor: '100% 90%'
	} , {
		xtype: 'textfield' ,
		anchor: '100%' ,
		// Disabled to default
		disabled: true
	}]
});
