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
		
		var divChat = Ext.get ('mainRoom');
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
						
						var toSend = new Array (['login' , userName]);
						
						socket.send (toSend);
						
						// Hide username textfield
						tfUser.setVisible (false);
			
						// Change login button
						button.setText ('Logout');
			
						// Enable send message textfield
						tfSendMsg.setDisabled (false);
						
						// Set focus to the username textfield
						Ext.getCmp('tfSendMsg').focus ();
					}
			
					// News from server handler
					socket.onmessage = function (msg) {
						var msgExploded = msg.data.split (':');
						if (msgExploded[0] == 'global') {
							// If is arrived userlist, handle it
							if (msgExploded[1] == 'userlist') {
								// Update the username store
								usersStore.removeAll ();
							
								// Add every user to the right grid
								for (var index in msgExploded) {
									// To avoid 'global' and 'userlist'
									if (index > 1) {
										// TODO: to avoid strange ExtJS error
										try {
											usersStore.add ({
												user : msgExploded[index]
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
							// Send message into the Main Room
							else {
								// To avoid 'global:'
								divChat.insertHtml ('beforeEnd' , msg.data.slice (msgExploded[0].length + 1) + '<br />');
								divChat.scroll ('b', divChat.getHeight (true));
							}
						}
						// Private rooms
						else if (msgExploded[0] == 'private') {
							// TODO: temporaly solution
							var currentTab = panelChat.getActiveTab ();
							panelChat.setActiveTab (Ext.getCmp ('tab_' + msgExploded[1]));
							panelChat.setActiveTab (currentTab);
							
							// TODO: more than one room are created when a message is came
							var divRoom = Ext.get ('room_' + msgExploded[1]);
							
							// Message without parameters
							var msgToShow = msg.data.slice (msgExploded[0].length + msgExploded[1].length + 2);
							
							// Someone wants to start a private communication
							if (divRoom == null) {
							// TODO: problem with divRoom
//							if (Ext.getCmp ('tab_' + msgExploded[1]) == null) {
								// Add a new tab with a unique index
								var tab = panelChat.add ({
									title: msgExploded[1] ,
									id: 'tab_' + msgExploded[1] ,
									closable: true ,
									html: '<div id="room_' + msgExploded[1] +'" style="overflow-x:auto; overflow-y:auto">' + msgToShow + '<br /></div>'
								})
								
								// Resize the tab
								panelChat.fireEvent ('resize');
		
								// Then give the focus to the textfield
								tfSendMsg.focus ();
							}
							else {
								divRoom.insertHtml ('beforeEnd' , msgToShow + '<br />');
								divRoom.scroll ('b', divRoom.getHeight (true));
							}
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
