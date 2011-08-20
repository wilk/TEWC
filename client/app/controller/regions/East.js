// @file 	East.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Controller of east region

Ext.define ('TEWC.controller.regions.East' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.East'] ,
	models: ['regions.East'] ,
	stores: ['regions.East'] ,
	
	init: function () {
		this.control ({
			'eastregion' : {
				itemdblclick : this.createRoom
			}
		});
	} ,
	
	// When a user is dbclicked, creates a new room with his name
	createRoom: function (grid, record, item, index, event, options) {
		var tpChat = Ext.getCmp ('chatPanel');
		var username = record.get ('user');
		var tfSendMsg = Ext.getCmp ('tfSendMsg');
		
		// Message to yourself is not allowed
		if (username != userName) {
			var tabToCreate = Ext.getCmp ('tab_' + username);
			// If tab already exists, simply activates
			if (tabToCreate == null) {
				// Add a new tab with a unique index
				var tab = tpChat.add ({
					title: username ,
					id: 'tab_' + username ,
					closable: true ,
					html: '<div id="room_' + username +'" style="overflow-x:auto; overflow-y:auto"></div>'
				})
		
				// Focus on the new tab
				tpChat.setActiveTab (tab);
				
				// Resize the tab
				tpChat.fireEvent ('resize');
		
				// Then give the focus to the textfield
				tfSendMsg.focus ();
			}
			else {
				// Activates
				tpChat.setActiveTab (tabToCreate);
			}
		}
	}
});
