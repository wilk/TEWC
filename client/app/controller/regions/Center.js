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
			// Center region
			'centerregion > panel' : {
				// Resize the div chat when the panel chat is resized
				resize : function (reg, width, height, opts) {
					var divChat = document.getElementById ('chatBox');
					divChat.style.height = (height - 33) + 'px';
					divChat.style.width = (width - 10) + 'px';
				}
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
	
	// Send message
	sendMsg: function (textfield) {
		// Empty messages aren't accepted
		if (textfield.getValue () != '') {
			try {
				// Send message
				socket.send ('<b>' + userName + ':</b> ' + this.html2text (textfield.getValue ()));
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
