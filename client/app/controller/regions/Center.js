// @file 	Center.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of center region

Ext.define ('TEWC.controller.regions.Center' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.Center'] ,
	models: ['regions.East'] ,
	stores: ['regions.East'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Center region
			'centerregion > tabpanel' : {
				// Resize the div chat when the panel chat is resized
				resize : this.updateResize ,
				tabchange : this.updateScroll
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
	
	// Scroll on bottom when a tab get the focus
	updateScroll: function (panel, newTab, oldTab, opts) {
		var divChat;
		
		// Mainroom
		if (newTab.title == 'Central Square') {
			divChat = Ext.get ('mainRoom');
		}
		// Private rooms
		else {
			divChat = Ext.get ('room_' + newTab.title);
		}
		
		divChat.scroll ('b', divChat.getHeight (true));
		
		Ext.getCmp('tfSendMsg').focus ();
	} ,
	
	// Update the resize of the div
	updateResize: function (panel, width, height, opts) {
		// Useful when resize event is fired
		if (width == null) width = Ext.getCmp('chatPanel').getWidth ();
		if (height == null) height = Ext.getCmp('chatPanel').getHeight ();
	
		// Always Main Room resize
		var divChat = document.getElementById ('mainRoom');
		
		divChat.style.height = (height - 35) + 'px';
		divChat.style.width = (width - 10) + 'px';
		
		// Check for other tabs
		var userStore = this.getRegionsEastStore ();
		
		// Don't count userself
		if (userStore.getCount () > 1) {
			for (var i = 0; i < userStore.getCount (); i++) {
				var user = userStore.getAt(i).get ('user');
					if (user != userName) {
						divChat = document.getElementById ('room_' + user);
						
						// Resize only existing private chats
						if (divChat != null) {
							divChat.style.height = (height - 35) + 'px';
							divChat.style.width = (width - 10) + 'px';
						}
					}
			}
		}
	} ,
	
	// Send message
	sendMsg: function (textfield) {
		// Empty messages aren't accepted
		if (textfield.getValue () != '') {
			try {
				var tpChat = textfield.up('centerregion').down ('tabpanel');
				var toSend = new Array ();
				
				// Send message to the central square
				if (tpChat.getActiveTab().title == 'Central Square') {
					toSend.push (['global' , this.html2text (textfield.getValue ())]);
					socket.send (toSend);
				}
				// Or in a private chatroom
				else {
					// private -> msg -> receiver
					var receiverUsername = tpChat.getActiveTab().title;
					var userStore = this.getRegionsEastStore ();
					
					if (userStore.findRecord ('user', receiverUsername) != null) {
						var msgText = this.html2text (textfield.getValue ());
						toSend.push (['private' , receiverUsername, msgText]);
						socket.send (toSend);
					}
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: '<b>' + receiverUsername + '</b> isn\'t with us anymore. R.I.P.!' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				}
				
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
	} ,
	
	// Convert < in &lt; and > in &gt;
	html2text: function (msg) {
		msg = msg.replace (/</g , '&lt;');
		msg = msg.replace (/>/g , '&gt;');
		return msg;
	}
});
