// @file 	North.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of north region

Ext.define ('TEWC.controller.regions.North' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.North'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Login button
			'northregion > button' : {
				click : this.login ,
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.login ();
				}
			}
		});
	} ,
	
	// User login
	login: function (button) {
		var tfUser = button.up('northregion').down ('textfield');
		var tfSendMsg = Ext.getCmp ('tfSendMsg');
		
		// Login
		if (tfUser.isVisible ()) {
			// Hide username textfield
			tfUser.setVisible (false);
			
			// Change login button
			button.setText ('Logout');
			
			// Enable send message textfield
			tfSendMsg.setDisabled (false);
			
			// Set username
			userName = tfUser.getValue ();
		}
		// Logout
		else {
			// Reset and show username textfield
			tfUser.reset ();
			tfUser.setVisible (true);
			
			// Change login button
			button.setText ('Login');
			
			// Reset and disable send message textfield
			tfSendMsg.reset ();
			tfSendMsg.setDisabled (true);
			
			// Reset username
			userName = '';
		}
	}
});
