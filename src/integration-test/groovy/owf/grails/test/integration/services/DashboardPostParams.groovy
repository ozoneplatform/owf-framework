package owf.grails.test.integration.services

import grails.converters.JSON

import ozone.owf.grails.domain.Stack

import static owf.grails.test.integration.JsonUtil.restringify
import static owf.grails.test.integration.services.WidgetDefinitionPostParams.*


class DashboardPostParams {

    static def generatePostParamsTestDBWithStack(Stack stack) {
        [
                "alteredByAdmin"  : false,
                "createdDate"     : "11/02/2012 02:59 PM EDT",
                "isGroupDashboard": false,
                "isdefault"       : true,
                "guid"            : "12345678-1234-1234-1234-123456789001",
                "locked"          : false,
                "name"            : "Test Dashboard",
                "layoutConfig"    : restringify("""{
                "xtype": "desktoppane",
                "flex": 1,
                "height": "100%",
                "items": [
                ],
                "paneType": "desktoppane",
                "widgets": [
                    {
                        "widgetGuid": "${WIDGET_1_GUID}",
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
                        "widgetGuid": "${WIDGET_6_GUID}",
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
                        "widgetGuid": "${WIDGET_8_GUID}",
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
                        "${WIDGET_1_GUID}": {
                            "x": 2,
                            "y": 3,
                            "height": 250,
                            "width": 295,
                            "timestamp": 1351882823349
                        },
                        "${WIDGET_6_GUID}": {
                            "x": 5,
                            "y": 259,
                            "height": 440,
                            "width": 540,
                            "timestamp": 1351882826127
                        },
                        "${WIDGET_8_GUID}": {
                            "x": 547,
                            "y": 258,
                            "height": 440,
                            "width": 540,
                            "timestamp": 1351882833532
                        }
                    }
                }
            }"""),
                "stack"           : [
                        "id"             : stack.id,
                        "totalGroups"    : 0,
                        "imageUrl"       : "${stack.imageUrl}",
                        "description"    : "${stack.description}",
                        "name"           : "${stack.name}",
                        "totalDashboards": 0,
                        "stackContext"   : "${stack.stackContext}",
                        "class"          : "ozone.owf.grails.services.model.StackServiceModel",
                        "totalUsers"     : 0,
                        "totalWidgets"   : 0,
                        "descriptorUrl"  : "${stack.descriptorUrl}"
                ]
        ]
    }

    /** A dashboard with 3 state items */
    static def generatePostParamsA() {

        [
                "columnCount"   : 0,
                "layout"        : "accordion",
                "guid"          : "12345678-1234-1234-1234-1234567890a0",
                "name"          : "Accordion Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
                  {
                    "uniqueId": 	"12345678-1234-1234-1234-1234567890a1",
                    "widgetGuid": 	"${WIDGET_3_GUID}",
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
                      "widgetGuid": "2345678-1234-1234-1234-1234567890b2",
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

    /** The same dashboard as "A" but with 2 state items and a different layout. */
    static def generatePostParamsB() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : "12345678-1234-1234-1234-1234567890a0",
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
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

    /** The same dashboard as "B" but with isdefault set to true. */
    static def generatePostParamsC() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : "12345678-1234-1234-1234-1234567890a0",
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "true",
                "showLaunchMenu": false,
                "state"         : """[
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

    /**
     *  A unique dashboard (aka a different guid) wherein default is true.
     *  Similar to C, but with a different guid.
     */
    static def generatePostParamsD() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : "12345678-1234-1234-1234-1234567890a1",
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "true",
                "showLaunchMenu": false,
                "state"         : """[
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

    /** A unique dashboard (aka a different guid) */
    static def generatePostParamsE() {
        [
                "columnCount"   : 1,
                "layout"        : "portal",
                "guid"          : "12345678-1234-1234-1234-1234567890a2",
                "name"          : "Portal Window Manager (USER 3)",
                "isdefault"     : "true",
                "showLaunchMenu": false,
                "state"         : """[
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

    /** Same dashboard as "E", but the parameters contain an explicit value to set for dashboardPosition. */
    static def generatePostParamsF() {
        [
                "dashboardPosition": 0,
                "columnCount"      : 1,
                "layout"           : "portal",
                "guid"             : "12345678-1234-1234-1234-1234567890a2",
                "name"             : "Portal Window Manager (USER 3)",
                "isdefault"        : "true",
                "showLaunchMenu"   : false,
                "state"            : """[
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

    /** Same dashboard as "D", but the parameters contain an explicit value to set for dashboardPosition. */
    static def generatePostParamsG() {
        [
                "dashboardPosition": 1,
                "columnCount"      : 1,
                "layout"           : "tabbed",
                "guid"             : "12345678-1234-1234-1234-1234567890a1",
                "name"             : "Tabbed Window Manager (USER 3)",
                "isdefault"        : "true",
                "showLaunchMenu"   : false,
                "state"            : """[
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

    /** A unique dashboard, sharing guids with I, with eventing connections to test cloning. */
    static def generatePostParamsJ() {
        [
                "columnCount"   : 0,
                "layout"        : "desktop",
                "guid"          : "12345678-1234-1234-1234-1234567890a0",
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
                      {
                          "uniqueId": 	"12345678-1234-1234-1234-1234567890f1",
                          "widgetGuid": 	"${WIDGET_7_GUID}",
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

    static def generatePostParams_BULK_A() {
        [
                "columnCount"   : 0,
                "layout"        : "accordion",
                "guid"          : BULK_DASHBOARD_GUID_1,
                "name"          : "Accordion Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
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

    static def generatePostParams_BULK_B() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : BULK_DASHBOARD_GUID_2,
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
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

    static def generatePostParams_BULK_C() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : BULK_DASHBOARD_GUID_3,
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
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

    static def generatePostParams_BULK_D() {
        [
                "columnCount"   : 1,
                "layout"        : "tabbed",
                "guid"          : BULK_DASHBOARD_GUID_4,
                "name"          : "Tabbed Window Manager (USER 3)",
                "isdefault"     : "false",
                "showLaunchMenu": false,
                "state"         : """[
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

    /** A, E, F, G Bulk Update... */
    static def generatePostParamsBulkUpdate() {
        ["viewsToUpdate": """[
                        {
                            "guid" : "${BULK_DASHBOARD_GUID_1}",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "${BULK_DASHBOARD_GUID_2}",
                            "name"	: "NEW NAME Tabbed Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "${BULK_DASHBOARD_GUID_3}",
                            "name"	: "NEW Tabbed Window Manager (USER 3)",
                            "isdefault" : false
                        },{
                            "guid" : "${BULK_DASHBOARD_GUID_4}",
                            "name"	: "UPDATED Tabbed Window Manager (USER 3)",
                            "isdefault" : true
                        }
                        ]"""
        ]
    }

    /** Guid shouldn't exist! */
    static def generatePostParamsBulkUpdateBadGuid() {

        ["viewsToUpdate": """[
                        {
                            "guid" : "92345678-1234-1234-1234-1234567890a9",
                            "name"	: "NEW NAME Accordion Window Manager (USER 3)",
                            "isdefault" : false
                        }
                        ]"""
        ]
    }

    public static final String BULK_DASHBOARD_GUID_1 = "12345678-1234-1234-1234-1234567890a0"
    public static final String BULK_DASHBOARD_GUID_2 = "12345678-1234-1234-1234-1234567891a0"
    public static final String BULK_DASHBOARD_GUID_3 = "12345678-1234-1234-1234-1234567892a0"
    public static final String BULK_DASHBOARD_GUID_4 = "12345678-1234-1234-1234-1234567893a0"

    /** A, E, F, G Bulk Delete... */
    static def generatePostParamsBulkDelete() {
        [
                viewGuidsToDelete: asJsonString(
                        [BULK_DASHBOARD_GUID_1, BULK_DASHBOARD_GUID_2, BULK_DASHBOARD_GUID_3, BULK_DASHBOARD_GUID_4]
                )
        ]
    }

    /** Guid shouldn't exist! */
    static def generatePostParamsBulkDeleteBadGuid() {
        [
                viewGuidsToDelete: asJsonString(["92345678-1234-1234-1234-1234567890a9"])
        ]
    }

    /** Guid shouldn't exist! */
    static def generatePostParamsBulkDeleteAndUpdateBadGuid() {
        ["viewGuidsToDelete": asJsonString(["92345678-1234-1234-1234-1234567890a9"]),
         "viewsToUpdate"    : asJsonString([
                 [
                         "guid"     : "92345678-1234-1234-1234-1234567891a9",
                         "name"     : "NEW NAME Accordion Window Manager (USER 3)",
                         "isdefault": false
                 ]])
        ]
    }

    /** A, E, F, G Bulk Delete & Update... */
    static def generatePostParamsBulkDeleteAndUpdate() {
        ["viewGuidsToDelete": """[
                            "12345678-1234-1234-1234-1234567891a0",
                            "12345678-1234-1234-1234-1234567892a0"
                        ]""",
         "viewsToUpdate"    : """[
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

    private static String asJsonString(Object value) {
        (value as JSON).toString()
    }

}
