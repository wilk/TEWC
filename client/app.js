// @file 	app.js
//
// @author 	Vincenzo Ferrari <wilk3ert@gmail.com>
//
// @note	Main application definition

Ext.application ({
	// namespace TEWC
	name: 'TEWC' ,
	
	// Controllers list
	controllers: [
		'regions.North' ,
		'regions.East' ,
		'regions.Center'
	] ,
	
	launch: function () {
		Ext.create ('Ext.container.Viewport' , {
			// Region and other views
			requires: [
				'TEWC.view.regions.North' ,
				'TEWC.view.regions.East' ,
				'TEWC.view.regions.Center'
			] ,
	
			// Configuration
			id: 'mainViewport' ,
			layout: 'border' ,
	
			// Body
			items: [{
				xtype: 'northregion'
			} , {
				xtype: 'eastregion'
			} , {
				xtype: 'centerregion'
			}]
		});
	}
});
