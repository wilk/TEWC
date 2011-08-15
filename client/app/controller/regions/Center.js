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
				afterrender : this.setupConnection
			} ,
			// Send message textfield
			'#tfSendMsg' : {
				// Enter key
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.sendMsg (field);
				}
			}
		});
	} ,
	
	// Setup Socket Connection
	setupConnection: function (reg) {
		var taChat = Ext.getCmp ('taChat');
		// Setup socket if the browser supports it
		if ('WebSocket' in window) {
			try {
				var host = 'ws://localhost:12345/test-TEWC/server.php';
				// Build a new socket
				socket = new WebSocket (host);
				
				// Error handler
				socket.onerror = function (msg) {
					taChat.setValue (taChat.getValue () + msg.data + '\n');
				}
			
				// Open handler
				socket.onopen = function (msg) {
					taChat.setValue (taChat.getValue () + 'Welcome to The Easiest Web Chat dude!\n');
				}
			
				// News from server handler
				socket.onmessage = function (msg) {
					taChat.setValue (taChat.getValue () + msg.data + '\n');
				}
			
				// Close handler
				socket.onclose = function (msg) {
					taChat.setValue (taChat.getValue () + 'WebSocket is down!\n');
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
				msg: 'Your browser doesn\'t supports websocket.' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	} ,
	
	// Send message
	sendMsg: function (textfield) {
		// Empty messages aren't accepted
		if (textfield.getValue () != '') {
			try {
				// Send message
				// TODO: userName strong. <b> tag doesn't works with textarea
				socket.send (userName + ': ' + textfield.getValue ());
				textfield.reset ();
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
	}
});
