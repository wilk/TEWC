// @file 	Center.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of center region

Ext.define ('TEWC.controller.regions.Center' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.Center'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'centerregion' : {
				// TODO: setup connection
			}
		});
	}
});
