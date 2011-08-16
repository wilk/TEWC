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
		var divChat = document.getElementById ('chatBox');
		var panelChat = reg.down('panel');
		
		// Setup socket if the browser supports it
		if ('WebSocket' in window) {
			try {
				var host = 'ws://localhost:12345/test-TEWC/server.php';
				// Build a new socket
				socket = new WebSocket (host);
				
				// Error handler
				socket.onerror = function (msg) {
					divChat.innerHTML += msg.data + '<br />';
					divChat.scrollTop = divChat.scrollHeight;
				}
			
				// Open handler
				socket.onopen = function (msg) {
					divChat.innerHTML += '<h1 style="font-size: 2em">Welcome to The Easiest Web Chat dude!</h1><br />';
					// Get the panel size to resize divChat
					panelChatSize = panelChat.getSize ();
					// The most recent message is always visible
					divChat.style.height = (panelChatSize.height - 33) + 'px';
				}
			
				// News from server handler
				socket.onmessage = function (msg) {
					divChat.innerHTML += msg.data + '<br />';
					divChat.scrollTop = divChat.scrollHeight;
				}
			
				// Close handler
				socket.onclose = function (msg) {
					divChat.innerHTML += '<span style="color:red"><b>*** WebSocket is down! ***</b></span><br />';
					divChat.scrollTop = divChat.scrollHeight;
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
				socket.send ('<b>' + userName + ':</b> ' + textfield.getValue ());
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
