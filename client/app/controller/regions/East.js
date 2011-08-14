// @file 	East.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of east region

Ext.define ('TEWC.controller.regions.East' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.East'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'eastregion' : {
				// TODO: start connection to retrieve the users list
			}
		});
	}
});
