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
			// Login only if the username isn't blank
			if (tfUser.getValue().length != 0) {
			
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
					socket.send ('<span style="color:green"><b>' + userName + '</b>' + ' is just arrived!</span>');
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
			else {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: 'You have to fill the field with your username, dude!' ,
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
				socket.send ('<span style="color:red"><b>' + userName + '</b>' + ' is left!</span>');
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
