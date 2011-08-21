// @file 	loader.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Load ExtJS and setup global vars

var userName = '';
var socket;
var host = 'ws://localhost:12345/TEWC/server/server.php';

// Set loading configuration
Ext.Loader.setConfig ({
	enabled : true
});

// Import any class of ExtJS 4
Ext.require ([
	'Ext.window.Window' ,
	'Ext.window.MessageBox' ,
	'Ext.grid.Panel' ,
	'Ext.form.field.Text' ,
	'Ext.form.field.TextArea' ,
	'Ext.button.Button' ,
	'Ext.tab.Panel'
]);

// When the browser is closed, close the socket too
function closeWebSocket () {
	try {
		if (socket.readyState == 1)
			socket.close ();
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
