describe("ProfileWindow", function() {

//    beforeEach(function () {
//    });

//    afterEach(function () {
//    });

	it('displays user', function() {
      var viewport = Ext.create('Ext.container.Viewport', {
          id: 'viewport',
          cls: 'viewport',
          layout: {
              type: 'fit'
          },
          items: [{

          }]
      });
      var profileWindow = Ext.create('Ozone.components.window.ProfileWindow', {
        ownerCt: viewport,
        user: {"displayName":"testAdmin1","userRealName":"Test Admin 1","prevLogin":"2012-04-02T19:43:46Z","prettyPrevLogin":"23 hours ago","id":1,"groups":[
          {"totalUsers":0,"id":4,"totalWidgets":0,"name":"TestGroup1","status":"active","description":"TestGroup1","email":"testgroup1@group1.com","automatic":false},
          {"totalUsers":0,"id":5,"totalWidgets":0,"name":"TestGroup2","status":"active","description":"TestGroup2","email":"testgroup2@group2.com","automatic":false},
          {"totalUsers":0,"id":6,"totalWidgets":0,"name":"All Users","status":"active","description":"All Users","email":null,"automatic":false},
          {"totalUsers":0,"id":7,"totalWidgets":0,"name":"OWF Admins","status":"active","description":"OWF Administrators","email":null,"automatic":false},
          {"totalUsers":0,"id":13,"totalWidgets":0,"name":"group1","status":"active","description":"I am a sample Group 1 from users.properties","email":"test@email.com","automatic":true},
          {"totalUsers":0,"id":14,"totalWidgets":0,"name":"group2","status":"active","description":"I am a sample Group 2 from users.properties","email":"test2@email.com","automatic":true},
          {"totalUsers":0,"id":15,"totalWidgets":0,"name":"group3","status":"inactive","description":"I am a sample Group 3 from users.properties","email":"test3@email.com","automatic":true}
        ],"email":"testAdmin1@ozone3.test","isAdmin":true}
      });
      profileWindow.show();

      //log stuff
      //jstestdriver.console.log('foo','foo');

      //assert
      expect(profileWindow).toNotBe(null);
      expect(profileWindow.rendered).toBe(true);

      var displayNameNode = profileWindow.el.down('.displayName');
      expect(displayNameNode).toNotBe(null);
      expect(displayNameNode.dom.innerHTML).toBe("testAdmin1");

      //destroy
      profileWindow.destroy();
      viewport.destroy();

	});
});
