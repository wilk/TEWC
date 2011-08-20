// @file 	North.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of north region

Ext.define ('TEWC.controller.regions.North' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.North'] ,
	models: ['regions.East'] ,
	stores: ['regions.East'] ,
	
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
		
		var divChat = Ext.get ('chatBox');
		var usersStore = this.getRegionsEastStore ();
		
		// Login
		if (tfUser.isVisible ()) {
			// Login only if the username isn't blank, without spaces too
			if ((tfUser.getValue().length > 0) && (tfUser.getValue().length < 20) && (tfUser.getValue().split(/\s/g).length < 2)) {
				
				var panelChat = Ext.getCmp ('chatPanel');
				
				// Connect
				try {
					// Build a new socket
					socket = new WebSocket (host);
				
					// Error handler
					socket.onerror = function (msg) {
						divChat.insertHtml ('beforeEnd' , msg.data + '<br />');
						divChat.scroll ('b', divChat.getHeight (true));
					}
			
					// Open handler
					socket.onopen = function (msg) {
						// Set username
						userName = tfUser.getValue ();
						
						divChat.insertHtml ('beforeEnd' , '<h1 style="font-size: 2em">Welcome to The Easiest Web Chat dude!</h1><br />');
						divChat.scroll ('b', divChat.getHeight (true));
						
						// Notice the chatroom you are arrived
						socket.send ('login ' + userName);
						
						// Hide username textfield
						tfUser.setVisible (false);
			
						// Change login button
						button.setText ('Logout');
			
						// Enable send message textfield
						tfSendMsg.setDisabled (false);
						
						panelChat.setTitle ('Chat :: ' + userName);
						
						// Set focus to the username textfield
						Ext.getCmp('tfSendMsg').focus ();
					}
			
					// News from server handler
					socket.onmessage = function (msg) {
						var userList = msg.data.split (' ');
						// If is arrived userlist, handle it
						if (userList[0] == 'userlist') {
							// Update the username store
							usersStore.removeAll ();
							
							// Add every user to the right grid
							for (var index in userList) {
								// To avoid 'userlist'
								if (index != 0) {
									// TODO: to avoid strange ExtJS error
									try {
										usersStore.add ({
											user : userList[index]
										});
									}
									catch (err) {
										continue;
									}
								}
							}
							
							// And sort the store
							usersStore.sort ('user' , 'ASC');
						}
						else {
							divChat.insertHtml ('beforeEnd' , msg.data + '<br />');
							divChat.scroll ('b', divChat.getHeight (true));
						}
					}
			
					// Close handler
					socket.onclose = function (msg) {
						// If user is trying to login when the websocket is closed
						if (userName == '') {
							Ext.Msg.show ({
								title: 'Error' ,
								msg: 'WebSocket is closed. Your actions are useless.' ,
								buttons: Ext.Msg.OK ,
								icon: Ext.Msg.ERROR
							});
							
							// Set focus to the username textfield
							tfUser.focus ();
						}
						else {
							// If it's a normal logout
							if ((button.getText () == 'Login') && (userName != '')) {
								divChat.insertHtml ('beforeEnd' , '<br /><h1 style="font-size: 2em">Goodbye dude!</h1><br />');
							}
							// If websocket is closed by server
							else {
								divChat.insertHtml ('beforeEnd' , '<br /><span style="color:red">*** Something goes wrong! WebSocket closed by server. ***</span><br />');
							}
							
							divChat.scroll ('b', divChat.getHeight (true));
							
							// Reset title of the chatroom
							panelChat.setTitle ('Chat');
						
							// Update userlist
							usersStore.removeAll ();
						
							// Reset and show username textfield
							tfUser.reset ();
							tfUser.setVisible (true);
			
							// Reset and disable send message textfield
							tfSendMsg.reset ();
							tfSendMsg.setDisabled (true);
			
							// Reset username
							userName = '';
			
							// Set focus to the username textfield
							tfUser.focus ();
						}
					}
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
					msg: 	'An error occurred during login. As follows the rules for the username:<br />' +
						'- blank username is not allowed<br />' +
						'- username must be without spaces<br />' +
						'- username must have a maximum length of 20 chars<br />' +
						'So, if you broke one of these rules, please try again<br />and pay more attention next time, dude!' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
		// Logout
		else {
			// Change login button
			button.setText ('Login');
			
			closeWebSocket ();
		}
	}
});
