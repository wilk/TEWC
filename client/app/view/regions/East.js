// @file 	East.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	East region where is displayed the users list

Ext.define ('TEWC.view.regions.East' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.eastregion' ,
	
	// Configuration
	title: 'Users List' ,
	region: 'east' ,
	minWidth: 158 ,
	maxWidth: 300 ,
	collapsible: true ,
	split: true ,
	layout: 'anchor' ,
	margin: '3 3 5 0' ,
	
	// Body
	items: [{
		// TODO: Users list grid here
	}]
});
