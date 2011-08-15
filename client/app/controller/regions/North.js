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
				click : this.login
			} ,
			// Login textfield
			'northregion > textfield' : {
				// Enter key
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.login (field.up('northregion').down ('button'));
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
			
			// Notice the chatroom that user is arrived
			try {
				// Send message
				// TODO: userName strong. <b> tag doesn't works with textarea
				socket.send (userName + ' is just arrived!');
			}
			catch (err) {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: err ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
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
			
			// // Notice the chatroom that user is left
			try {
				// Send message
				// TODO: userName strong. <b> tag doesn't works with textarea
				socket.send (userName + ' is left!');
			}
			catch (err) {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: err ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
			
			// Reset username
			userName = '';
		}
	}
});
