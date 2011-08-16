// @file 	East.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	East region where is displayed the users list

Ext.define ('TEWC.view.regions.East' , {
	extend: 'Ext.grid.Panel' ,
	alias: 'widget.eastregion' ,
	
	// Configuration
	title: 'Users List' ,
	store: 'regions.East',
	columns: [
		{header: 'User',  dataIndex: 'user'},
	],
	region: 'east' ,
	width: 102 ,
	resizable: false ,
	collapsible: true ,
	layout: 'anchor' ,
	margin: '3 4 5 3'
	
});
