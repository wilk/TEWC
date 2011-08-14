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
			} ,
			// Send message textfield
			'centerregion > textfield' : {
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.sendMsg ();
				}
			}
		});
	} ,
	
	// Send message
	sendMsg: function (textfield) {
		// TODO: send message to the server
	}
});
