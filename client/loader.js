// @file 	loader.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Load ExtJS and setup global vars

var userName = '';
var socket;
var host = 'ws://localhost:12345/test-TEWC/server.php';

// Set loading configuration
Ext.Loader.setConfig ({
	enabled : true
});
// Import any class of ExtJS 4
Ext.require (['*']);

// When the browser is closed, close the socket too
function closeWebSocket () {
	// TODO: use socket.close ()
	try {
		if (socket.readyState == 1)
			socket.send ('logout');
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
