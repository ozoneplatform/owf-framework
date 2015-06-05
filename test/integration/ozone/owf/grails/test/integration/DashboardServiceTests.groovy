package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.test.integration.WidgetDefinitionPostParams as WDPP

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.AutoLoginAccountService


@TestMixin(IntegrationTestMixin)
class DashboardServiceTests {

	def dashboardService
	def person
	def personWidgetDefinitionService
	def widgetDefinitionService
	def accountService
    def stack
    def stackForUpdate
	def pwdCounter

	void setUp() {
		def acctService = new AutoLoginAccountService()
        person = Person.build(username:'testUserDashboardServiceTesting', userRealName: 'foo', enabled:true)
        person.save()
        stack = Stack.build(name:'Test Stack', description: 'This is a test stack', stackContext:'testStack',
            imageUrl:'testStack.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stackForUpdate = Stack.build(name:'Test Stack 2', description: 'This is another test stack', stackContext:'testStack2',
            imageUrl:'testStack.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack.save()
		acctService.autoAccountName = 'testUserDashboardServiceTesting'
		acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
		accountService = acctService
		dashboardService.accountService = acctService
		personWidgetDefinitionService.accountService = acctService
		widgetDefinitionService.accountService = acctService
		pwdCounter = 0
    }

	void tearDown(){
        person.delete()
        stack.delete()
        stackForUpdate.delete()
	}

    private generatePostParamsTestDBWithStack() {
        [
            "alteredByAdmin": false,
            "createdDate": "11/02/2012 02:59 PM EDT",
            "isGroupDashboard": false,
            "isdefault": true,
            "guid"      : "12345678-1234-1234-1234-123456789001",
            "locked": false,
            "name": "Test Dashboard",
            "layoutConfig": """{
                "xtype": "desktoppane",
                "flex": 1,
                "height": "100%",
                "items": [
                ],
                "paneType": "desktoppane",
                "widgets": [
                    {
                        "widgetGuid": "12345678-1234-1234-1234-1234567890a0",
                        "uniqueId": "9a420f76-b50f-a763-8228-538b785c793f",
                        "dashboardGuid": "e897377c-e68a-efc5-df6a-ef6a3066d7be",
                        "paneGuid": "e85aed81-5daf-9f76-8a4f-0394b781ac30",
                        "name": "Channel Shouter",
                        "active": false,
                        "x": 2,
                        "y": 3,
                        "minimized": false,
                        "maximized": false,
                        "pinned": false,
                        "collapsed": false,
                        "columnPos": 0,
                        "buttonId": null,
                        "buttonOpened": false,
                        "region": "none",
                        "statePosition": 1,
                        "intentConfig": null,
                        "singleton": false,
                        "floatingWidget": false,
                        "background": false,
                        "mobileReady": false,
                        "zIndex": 19090,
                        "height": 250,
                        "width": 295
                    },
                    {
                        "widgetGuid": "12345678-1234-1234-1234-1234567890e2",
                        "uniqueId": "ae14e03b-1173-3156-7e9b-b1a65c9c2f23",
                        "dashboardGuid": "e897377c-e68a-efc5-df6a-ef6a3066d7be",
                        "paneGuid": "e85aed81-5daf-9f76-8a4f-0394b781ac30",
                        "name": "Channel Listener",
                        "active": false,
                        "x": 5,
                        "y": 259,
                        "minimized": false,
                        "maximized": false,
                        "pinned": false,
                        "collapsed": false,
                        "columnPos": 0,
                        "buttonId": null,
                        "buttonOpened": false,
                        "region": "none",
                        "statePosition": 2,
                        "intentConfig": null,
                        "singleton": false,
                        "floatingWidget": false,
                        "background": false,
                        "mobileReady": false,
                        "zIndex": 19100,
                        "height": 440,
                        "width": 540
                    },
                    {
                        "widgetGuid": "12345678-1234-1234-1234-1234567890e4",
                        "uniqueId": "a7391c44-d86a-3121-cb4f-3fa2fbb2b4f8",
                        "dashboardGuid": "e897377c-e68a-efc5-df6a-ef6a3066d7be",
                        "paneGuid": "e85aed81-5daf-9f76-8a4f-0394b781ac30",
                        "name": "Nearly Empty",
                        "active": true,
                        "x": 547,
                        "y": 258,
                        "minimized": false,
                        "maximized": false,
                        "pinned": false,
                        "collapsed": false,
                        "columnPos": 0,
                        "buttonId": null,
                        "buttonOpened": false,
                        "region": "none",
                        "statePosition": 3,
                        "intentConfig": null,
                        "singleton": false,
                        "floatingWidget": false,
                        "background": false,
                        "mobileReady": false,
                        "zIndex": 19110,
                        "height": 440,
                        "width": 540
                    }
                ],
                "defaultSettings": {
                    "widgetStates": {
                        "12345678-1234-1234-1234-1234567890a0": {
                            "x": 2,
                            "y": 3,
                            "height": 250,
                            "width": 295,
                            "timestamp": 1351882823349
                        },
                        "12345678-1234-1234-1234-1234567890e2": {
                            "x": 5,
                            "y": 259,
                            "height": 440,
                            "width": 540,
                            "timestamp": 1351882826127
                        },
                        "12345678-1234-1234-1234-1234567890e4": {
                            "x": 547,
                            "y": 258,
                            "height": 440,
                            "width": 540,
                            "timestamp": 1351882833532
                        }
                    }
                }
            }""",
            "stack": [
              "id": stack.id,
              "totalGroups": 0,
              "imageUrl": "${stack.imageUrl}",
              "description": "${stack.description}",
              "name": "${stack.name}",
              "totalDashboards": 0,
              "stackContext": "${stack.stackContext}",
              "class": "ozone.owf.grails.services.model.StackServiceModel",
              "totalUsers": 0,
              "totalWidgets": 0,
              "descriptorUrl": "${stack.descriptorUrl}"
            ]
        ]
    }

    private generatePostParamsA()
    {
        //A dashboard with 3 state items
        [
            "columnCount" : 0,
            "layout" 	: "accordion",
            "guid" 		: "12345678-1234-1234-1234-1234567890a0",
            "name"		: "Accordion Window Manager (USER 3)",
            "isdefault"	: "false",
            "showLaunchMenu"	: false,
            "state" 	: """[
                  {
                    "uniqueId": 	"12345678-1234-1234-1234-1234567890a1",
                    "widgetGuid": 	"12345678-1234-1234-1234-1234567890a2",
                    "active": false,
                    "width": 123,
                    "region": "accordion",
                    "zIndex": 123,
                    "pinned": false,
                    "minimized": false,
                    "buttonId": "",
                    "buttonOpened": false,
                    "height": 123,
                    "columnPos": 0,
                    "collapsed": true,
                    "y": 0,
                    "name": "Widget One",
                    "x": 0,
                    "maximized": false
                  },
                  {
                      "uniqueId": 	"12345678-1234-1234-1234-1234567890b1",
                    "widgetGuid": 	"12345678-1234-1234-1234-1234567890b2",
                      "active": false,
                      "width": 123,
                      "region": "accordion",
                      "zIndex": 123,
                      "pinned": false,
                      "minimized": false,
                      "buttonId": "",
                      "buttonOpened": false,
                      "height": 123,
                      "columnPos": 0,
                      "collapsed": true,
                      "y": 0,
                      "name": "Widget One",
                      "x": 0,
                      "maximized": false
                   },
                   {
                      "uniqueId": 		"12345678-1234-1234-1234-1234567890c1",
                      "widgetGuid": 	"12345678-1234-1234-1234-1234567890c2",
                      "active": false,
                      "width": 123,
                      "region": "accordion",
                      "zIndex": 123,
                      "pinned": false,
                      "minimized": false,
                      "buttonId": "",
                      "buttonOpened": false,
                      "height": 123,
                      "columnPos": 0,
                      "collapsed": true,
                      "y": 0,
                      "name": "Widget One",
                      "x": 0,
                      "maximized": false
                    }
                    ]"""
        ]
    }


    private generatePostParamsB()
    {
        //The same dashboard as "A" but with 2 state items and a different layout.
        [
                "columnCount" : 1,
                "layout" 	: "tabbed",
                "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                "name"		: "Tabbed Window Manager (USER 3)",
                "isdefault"	: "false",
                "showLaunchMenu"	: false,
                "state" 	: """[
                  {
                      "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                      "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                      "active": false,
                      "width": 123,
                      "region": "accordion",
                      "zIndex": 123,
                      "pinned": false,
                      "minimized": false,
                      "buttonId": "",
                      "buttonOpened": false,
                      "height": 123,
                      "columnPos": 0,
                      "collapsed": true,
                      "y": 0,
                      "name": "Widget One",
                      "x": 0,
                      "maximized": false
                   },
                   {
                      "uniqueId": 		"12345678-1234-1234-1234-1234567890e1",
                      "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                      "active": false,
                      "width": 123,
                      "region": "accordion",
                      "zIndex": 123,
                      "pinned": false,
                      "minimized": false,
                      "buttonId": "",
                      "buttonOpened": false,
                      "height": 123,
                      "columnPos": 0,
                      "collapsed": true,
                      "y": 0,
                      "name": "Widget One",
                      "x": 0,
                      "maximized": false
                    }
                    ]"""
                ]
    }


    private generatePostParamsC()
    {
        //The same dashboard as "B" but with isdefault set to true.
        [
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "true",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsD()
    {
        //A unique dashboard (aka a different guid) wherein default is true.
        //Similar to C, but with a different guid.
        [
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a1",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "true",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f4",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e4",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsE()
    {
        //A unique dashboard (aka a different guid)
        [
            "columnCount" : 1,
            "layout" 	: "portal",
            "guid" 		: "12345678-1234-1234-1234-1234567890a2",
            "name"		: "Portal Window Manager (USER 3)",
            "isdefault"	: "true",
            "showLaunchMenu"	: false,
            "state" 	: """[
              {
                  "uniqueId": 	"12345678-1234-1234-1234-1234567890f5",
                  "widgetGuid": 	"12345678-1234-1234-1234-1234567890f6",
                  "active": false,
                  "width": 123,
                  "region": "accordion",
                  "zIndex": 123,
                  "pinned": false,
                  "minimized": false,
                  "buttonId": "",
                  "buttonOpened": false,
                  "height": 123,
                  "columnPos": 0,
                  "collapsed": true,
                  "y": 0,
                  "name": "Widget One",
                  "x": 0,
                  "maximized": false
               },
               {
                  "uniqueId": 		"12345678-1234-1234-1234-1234567890e5",
                  "widgetGuid": 	"12345678-1234-1234-1234-1234567890e6",
                  "active": false,
                  "width": 123,
                  "region": "accordion",
                  "zIndex": 123,
                  "pinned": false,
                  "minimized": false,
                  "buttonId": "",
                  "buttonOpened": false,
                  "height": 123,
                  "columnPos": 0,
                  "collapsed": true,
                  "y": 0,
                  "name": "Widget One",
                  "x": 0,
                  "maximized": false
                }
                ]"""
        ]
    }

    private generatePostParamsF()
    {
        //Same dashboard as "E", but the parameters contain an explicit value to set for dashboardPosition.
        [
                    "dashboardPosition" : 0,
                    "columnCount" : 1,
                    "layout" 	: "portal",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a2",
                    "name"		: "Portal Window Manager (USER 3)",
                    "isdefault"	: "true",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f5",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f6",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e5",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e6",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsG()
    {
        //Same dashboard as "D", but the parameters contain an explicit value to set for dashboardPosition.
        [
                    "dashboardPosition" : 1,
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a1",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "true",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f4",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e4",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsH()
    {
        //Dashboard B with an explicit dashboardPosition
        [
                    "dashboardPosition" : 2,
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsI()
    {
        //The same dashboard as "B" but with lots of state items for doing layout conversions.
        [
                    "columnCount" : 0,
                    "layout" 	: "desktop",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789101",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789102",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789111",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789112",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789121",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789122",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789131",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789132",
                          "active": false,
                          "width": 500,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789141",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789142",
                          "active": false,
                          "width": 400,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }

                        ]"""
                    ]
    }


    private def buildI()
    {
        //Create 7!!! Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI2())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI3())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI4())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI5())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI6())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsI7())

        def resultOfCreate = dashboardService.create(generatePostParamsI())
        assert resultOfCreate.success

        def dashboard = resultOfCreate.dashboard
    }

    private generatePostParamsJ()
    {
        //A unique dashboard, sharing guids with I, with eventing connections to test cloning.
        [
                    "columnCount" : 0,
                    "layout" 	: "desktop",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        },
                        {
                          "uniqueId": 		"12345678-1234-1234-1234-123456789101",
                          "widgetGuid": 	"12345678-1234-1234-1234-123456789102",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }

                        ]"""
                    ]
    }

    private generatePostParamsK()
    {
        //A dashboard with 3 intentConfig items
        [
                    "columnCount" : 0,
                    "layout" 	: "accordion",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Accordion Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "intentConfig"		: """[
                    {
                        "action":"Plot","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
                        "dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"
                    },
                    {
                        "action":"Chart","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
                        "dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"
                    },
                    {
                        "action":"Locate","src":"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
                        "dest":"22ea2970-7f28-92f0-d702-cdee0c83b07c"
                    }
                    ]""",
                    "state" 	: """[
                      {
                        "uniqueId": 	"22ea2970-7f28-92f0-d702-cdee0c83b07c",
                        "widgetGuid": 	"12345678-1234-1234-1234-1234567890a2",
                        "active": false,
                        "width": 123,
                        "region": "accordion",
                        "zIndex": 123,
                        "pinned": false,
                        "minimized": false,
                        "buttonId": "",
                        "buttonOpened": false,
                        "height": 123,
                        "columnPos": 0,
                        "eventingConnections": [],
                        "collapsed": true,
                        "y": 0,
                        "name": "Widget One",
                        "x": 0,
                        "maximized": false
                      },
                      {
                          "uniqueId": 	"9465b5e6-5397-cf10-84a3-2f344b8d7146",
                        "widgetGuid": 	"12345678-1234-1234-1234-1234567890b2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "eventingConnections": [],
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890c2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "eventingConnections": [],
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }


    private def buildJ(createDashboard)
    {
        //Create 3 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsJ1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsJ2())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsJ3())

        def dashboard = null

        if (createDashboard)
        {
            def resultOfCreate = dashboardService.create(generatePostParamsJ())
            assert resultOfCreate.success
            dashboard = resultOfCreate.dashboard
        }
        return dashboard
    }

    private generatePostParams_BULK_A()
    {
        [
                    "columnCount" : 0,
                    "layout" 	: "accordion",
                    "guid" 		: "12345678-1234-1234-1234-1234567890a0",
                    "name"		: "Accordion Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                        "uniqueId": 	"12345678-1234-1234-1234-1234567890a1",
                        "widgetGuid": 	"12345678-1234-1234-1234-1234567890a2",
                        "active": false,
                        "width": 123,
                        "region": "accordion",
                        "zIndex": 123,
                        "pinned": false,
                        "minimized": false,
                        "buttonId": "",
                        "buttonOpened": false,
                        "height": 123,
                        "columnPos": 0,
                        "collapsed": true,
                        "y": 0,
                        "name": "Widget One",
                        "x": 0,
                        "maximized": false
                      },
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890b1",
                        "widgetGuid": 	"12345678-1234-1234-1234-1234567890b2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890c1",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890c2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParams_BULK_B()
    {
        [
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567891a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e3",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParams_BULK_C()
    {
        [
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567892a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f4",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e4",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParams_BULK_D()
    {
        [
                    "columnCount" : 1,
                    "layout" 	: "tabbed",
                    "guid" 		: "12345678-1234-1234-1234-1234567893a0",
                    "name"		: "Tabbed Window Manager (USER 3)",
                    "isdefault"	: "false",
                    "showLaunchMenu"	: false,
                    "state" 	: """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f5",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890f2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                       },
                       {
                          "uniqueId": 		"12345678-1234-1234-1234-1234567890e5",
                          "widgetGuid": 	"12345678-1234-1234-1234-1234567890e2",
                          "active": false,
                          "width": 123,
                          "region": "accordion",
                          "zIndex": 123,
                          "pinned": false,
                          "minimized": false,
                          "buttonId": "",
                          "buttonOpened": false,
                          "height": 123,
                          "columnPos": 0,
                          "collapsed": true,
                          "y": 0,
                          "name": "Widget One",
                          "x": 0,
                          "maximized": false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsBulkUpdate(){
        //A, E, F, G Bulk Update...
        [ "viewsToUpdate" : """[
                        {
                            "guid" : "12345678-1234-1234-1234-1234567890a0",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "12345678-1234-1234-1234-1234567891a0",
                            "name"	: "NEW NAME Tabbed Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "12345678-1234-1234-1234-1234567892a0",
                            "name"	: "NEW Tabbed Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "12345678-1234-1234-1234-1234567893a0",
                            "name"	: "UPDATED Tabbed Window Manager (USER 3)",
                            "isdefault" : true
                        }
                        ]"""
                    ]
    }

    private generatePostParamsBulkUpdateBadGuid(){
        //Guid shouldn't exist!
        [ "viewsToUpdate" : """[
                        {
                            "guid" : "92345678-1234-1234-1234-1234567890a9",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsBulkDelete(){
        //A, E, F, G Bulk Delete...
        [ "viewGuidsToDelete" : """[
                            "12345678-1234-1234-1234-1234567890a0",
                            "12345678-1234-1234-1234-1234567891a0",
                            "12345678-1234-1234-1234-1234567892a0",
                            "12345678-1234-1234-1234-1234567893a0"
                        ]"""
                    ]
    }

    private generatePostParamsBulkDeleteBadGuid(){
        //Guid shouldn't exist!
        [ "viewGuidsToDelete" : """[
                            "92345678-1234-1234-1234-1234567890a9"
                        ]"""
                    ]
    }

    private generatePostParamsBulkDeleteAndUpdateBadGuid(){
        //Guid shouldn't exist!
        [ "viewGuidsToDelete" : """[
                            "92345678-1234-1234-1234-1234567890a9"
                        ]""",
                        "viewsToUpdate" : """[
                        {
                            "guid" : "92345678-1234-1234-1234-1234567891a9",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        }
                        ]"""
                    ]
    }

    private generatePostParamsBulkDeleteAndUpdate(){
        //A, E, F, G Bulk Delete & Update...
        ["viewGuidsToDelete" : """[
                            "12345678-1234-1234-1234-1234567891a0",
                            "12345678-1234-1234-1234-1234567892a0"
                        ]""",
                      "viewsToUpdate" : """[
                        {
                            "guid" : "12345678-1234-1234-1234-1234567890a0",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        },
                        {
                            "guid" : "12345678-1234-1234-1234-1234567893a0",
                            "name"	: "UPDATED Tabbed Window Manager (USER 3)",
                            "isdefault" : true
                        }
                        ]"""
                    ]

    }

    private makePersonWidgetDefinition(postParams)
    {
        widgetDefinitionService.create(postParams)
        def widgetDefinition = WidgetDefinition.findByWidgetGuid(postParams.widgetGuid)
        def personWidgetDefinition = new PersonWidgetDefinition()
        personWidgetDefinition.widgetDefinition = widgetDefinition
        personWidgetDefinition.person = accountService.getLoggedInUser()
        personWidgetDefinition.visible = true
        personWidgetDefinition.pwdPosition = pwdCounter
        pwdCounter ++
        personWidgetDefinition.save()
        return PersonWidgetDefinition.findByWidgetDefinition(widgetDefinition)
    }

    void testCreate() {
        //Create 3 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA2())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA3())
        assert 3 ==PersonWidgetDefinition.list().size()
        def result = dashboardService.create(generatePostParamsA())
        assert result.success
        assert null != result.dashboard
    }

    void testCreateWithStack() {
        //Create 3 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD1())
        assert 3 ==PersonWidgetDefinition.list().size()

        def result = dashboardService.create(generatePostParamsTestDBWithStack())
        assert result.success
        assert null != result.dashboard
    }

    void testCloneNonexisting() {
        buildJ(false)
        def resultOfClone = dashboardService.deepClone(generatePostParamsJ())
        assert resultOfClone.success
        assert null != resultOfClone.dashboard
    }

    // TODO: Rewrite; intent config data is now inside of layoutConfig within the widgets array.

    void createDashboardsForBulkTests(){
        //Create all dashboards first...

        //Create 3 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA2())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsA3())

        def resultOfCreateA = dashboardService.create(generatePostParams_BULK_A())
        assert resultOfCreateA.success
        def dashboardA = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        assert "Accordion Window Manager (USER 3)" == dashboardA.name
        assert dashboardA.isdefault == false

        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB2())

        def resultOfCreateB = dashboardService.create(generatePostParams_BULK_B())
        assert resultOfCreateB.success
        def dashboardB = Dashboard.findByGuid("12345678-1234-1234-1234-1234567891a0")
        assert "Tabbed Window Manager (USER 3)" == dashboardB.name
        assert false == dashboardB.isdefault

        //It appears that C uses the same PersonWidgetDefinitions as B.
        def resultOfCreateC = dashboardService.create(generatePostParams_BULK_C())
        assert resultOfCreateC.success
        def dashboardC = Dashboard.findByGuid("12345678-1234-1234-1234-1234567892a0")
        assert "Tabbed Window Manager (USER 3)" == dashboardC.name
        assert false == dashboardC.isdefault

        //It appears that D uses the same PersonWidgetDefinitions as B.
        def resultOfCreateD = dashboardService.create(generatePostParams_BULK_D())
        assert resultOfCreateD.success
        def dashboardD = Dashboard.findByGuid("12345678-1234-1234-1234-1234567893a0")
        assert "Tabbed Window Manager (USER 3)" == dashboardD.name
        assert false == dashboardD.isdefault
    }

    void testBulkUpdate(){
        log.info "Testing bulkUpdate..."
        createDashboardsForBulkTests()

        //Now let's bulk update...
        def bulkUpdatePostParams = generatePostParamsBulkUpdate()
        log.info "${bulkUpdatePostParams}"
        def resultOfBulkUpdate = dashboardService.bulkUpdate(bulkUpdatePostParams)
        assert resultOfBulkUpdate.success

        //Did it update?
        def dashboardA = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        assert "NEW NAME Accordion Window Manager (USER 3)" == dashboardA.name
        assert false == dashboardA.isdefault

        def dashboardB = Dashboard.findByGuid("12345678-1234-1234-1234-1234567891a0")
        assert "NEW NAME Tabbed Window Manager (USER 3)" == dashboardB.name
        assert false == dashboardB.isdefault

        def dashboardC = Dashboard.findByGuid("12345678-1234-1234-1234-1234567892a0")
        assert "NEW Tabbed Window Manager (USER 3)" == dashboardC.name
        assert false == dashboardC.isdefault

        def dashboardD = Dashboard.findByGuid("12345678-1234-1234-1234-1234567893a0")
        assert "UPDATED Tabbed Window Manager (USER 3)" == dashboardD.name
        assert dashboardD.isdefault

        shouldFail(OwfException,{
            dashboardService.bulkUpdate(new HashMap()) //No viewsToUpdate....
        })
        shouldFail(OwfException,{
            dashboardService.bulkUpdate(generatePostParamsBulkUpdateBadGuid())
        })
    }

    void testBulkDelete(){
        log.info "Testing bulkDelete..."
        createDashboardsForBulkTests()

        //Now let's bulk update...
        def bulkDeletePostParams = generatePostParamsBulkDelete()
        log.info "${bulkDeletePostParams}"
        def resultOfBulkDelete = dashboardService.bulkDelete(bulkDeletePostParams)
        assert resultOfBulkDelete.success

        //Did it delete?
        def dashboardA = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        assert null ==  dashboardA

        def dashboardB = Dashboard.findByGuid("12345678-1234-1234-1234-1234567891a0")
        assert null ==  dashboardB

        def dashboardC = Dashboard.findByGuid("12345678-1234-1234-1234-1234567892a0")
        assert null ==  dashboardC

        def dashboardD = Dashboard.findByGuid("12345678-1234-1234-1234-1234567893a0")
        assert null ==  dashboardD

        //Great, now let's test error results...
        shouldFail(OwfException,{
                dashboardService.bulkDelete(new HashMap()) //No viewGuidsToDelete....
        })

        shouldFail(OwfException,{
            dashboardService.bulkDelete(generatePostParamsBulkDeleteBadGuid())
        })

    }

    void testBulkDeleteAndUpdate(){
        log.info "Testing bulkDeleteAndUpdate..."
        createDashboardsForBulkTests()

        //Now let's bulk delete & update...
        def bulkDeleteAndUpdatePostParams = generatePostParamsBulkDeleteAndUpdate()
        log.info "${bulkDeleteAndUpdatePostParams}"
        def resultOfBulkDeleteAndUpdate = dashboardService.bulkDeleteAndUpdate(bulkDeleteAndUpdatePostParams)
        assert resultOfBulkDeleteAndUpdate.success

        //Did it delete?
        def dashboardB = Dashboard.findByGuid("12345678-1234-1234-1234-1234567891a0")
        assert null ==  dashboardB

        def dashboardC = Dashboard.findByGuid("12345678-1234-1234-1234-1234567892a0")
        assert null ==  dashboardC

        //Did it update?
        def dashboardA = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        assert "NEW NAME Accordion Window Manager (USER 3)" == dashboardA.name
        assert false == dashboardA.isdefault

        def dashboardD = Dashboard.findByGuid("12345678-1234-1234-1234-1234567893a0")
        assert "UPDATED Tabbed Window Manager (USER 3)" == dashboardD.name
        assert dashboardD.isdefault

        //Great, now let's test error results... (bulkDelete should be done first, error results from it...)
        shouldFail(OwfException,{
            dashboardService.bulkDeleteAndUpdate(new HashMap()) //No viewGuidsToDelete....
        })

        shouldFail(OwfException,{
             dashboardService.bulkDeleteAndUpdate(generatePostParamsBulkDeleteAndUpdateBadGuid())
        })
    }

    void testCreateNewDefault()
    {
            //A default dashboard exists. A new dashboard is created that is "set as default"

            //Create 2 Person Widget Definitions so the state objects match up.
            assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsC1())
            assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsC2())

            def resultOfInitialCreateDefault = dashboardService.create(generatePostParamsC())
            assert resultOfInitialCreateDefault.success

            def originalDefaultDashboard = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
            assert null != originalDefaultDashboard
            assert originalDefaultDashboard.isdefault


            //This dashboard is also default. It should be default, and the original one should not be.

            //Create 2 Person Widget Definitions so the state objects match up.
            assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD1())
            assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD2())

            def resultOfSecondCreateDefault = dashboardService.create(generatePostParamsD())
            assert resultOfSecondCreateDefault.success

            def secondDefaultDashboard = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a1")
            originalDefaultDashboard =   Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")

            assert null != secondDefaultDashboard
            assert null != originalDefaultDashboard

            assert false == originalDefaultDashboard.isdefault
            assert    secondDefaultDashboard.isdefault
    }

    void testUpdateNewDefault()
    {
       //A default dashboard exists. A different dashboard is updated to be "set as default"

        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD2())

        def resultOfInitialCreateDefault = dashboardService.create(generatePostParamsD())
        assert resultOfInitialCreateDefault.success

       def originalDefaultDashboard = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a1")
       assert null != originalDefaultDashboard
       assert originalDefaultDashboard.isdefault

        //In order to test the update portion, first we have to create a dashboard that is NOT default
        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB2())

        def resultOfSecondCreateNotDefault = dashboardService.create(generatePostParamsB())
        assert resultOfSecondCreateNotDefault.success

        def secondCreatedDashboardNotDefault = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        assert null != secondCreatedDashboardNotDefault
        assert false == secondCreatedDashboardNotDefault.isdefault

        //Now we set it to default. The second dashboard should now be default, and the first one should not.
        //B's PWDs work for C.
        def resultOfUpdateDashboard = dashboardService.update(generatePostParamsC())
        assert resultOfUpdateDashboard.success

        def secondDefaultDashboard = Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a0")
        originalDefaultDashboard =   Dashboard.findByGuid("12345678-1234-1234-1234-1234567890a1")

        assert null != secondDefaultDashboard
        assert null != originalDefaultDashboard

        assert false == originalDefaultDashboard.isdefault
        assert    secondDefaultDashboard.isdefault

    }

    void testOrderCorrectOnCreate()
    {
        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsB2())

        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD2())


        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsEF1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsEF2())

        //Create 3 dashboards not ordered by GUID.
        dashboardService.create(generatePostParamsE())
        dashboardService.create(generatePostParamsC())
        dashboardService.create(generatePostParamsD())

        def resultOfBasicList = dashboardService.list(new HashMap())

        assert resultOfBasicList.success
        def dashboards = resultOfBasicList.dashboardList
        assert 3 == dashboards.size()

        assert "12345678-1234-1234-1234-1234567890a2" == dashboards[0].guid
        assert "12345678-1234-1234-1234-1234567890a0" == dashboards[1].guid
        assert "12345678-1234-1234-1234-1234567890a1" == dashboards[2].guid

    }

    void testUpdateDashboardPosition()
    {
        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsD2())


        //Create 2 Person Widget Definitions so the state objects match up.
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsEF1())
        assert null != makePersonWidgetDefinition(WDPP.generateDSTPostParamsEF2())

        def resultOfCreate = dashboardService.create(generatePostParamsD())
        assert resultOfCreate.success

        resultOfCreate = dashboardService.create(generatePostParamsE())
        assert resultOfCreate.success

        //Verify that the dashboards are in the correct, initial create order.
        def resultOfList = dashboardService.list(new HashMap())
        def dashboards = resultOfList.dashboardList
        assert "12345678-1234-1234-1234-1234567890a1" == dashboards[0].guid //Dashboard D-G
        assert "12345678-1234-1234-1234-1234567890a2" == dashboards[1].guid //Dashboard E-F

        //Reverse the positions

        //Let's now set Dashboard E's position to 0
        def resultOfUpdate = dashboardService.update(generatePostParamsF())
        assert resultOfUpdate.success

        //Let's now set Dashbaord D's position to 1
        resultOfUpdate = dashboardService.update(generatePostParamsG())
        assert resultOfUpdate.success

        //Verify that the dashboards have been reversed and are positioned correctly.
        resultOfList = dashboardService.list(new HashMap())
        dashboards = resultOfList.dashboardList
        assert "12345678-1234-1234-1234-1234567890a2" == dashboards[0].guid //Dashboard E-F
        assert "12345678-1234-1234-1234-1234567890a1" == dashboards[1].guid //Dashboard D-G
    }

}
