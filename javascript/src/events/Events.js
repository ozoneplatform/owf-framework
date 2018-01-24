var OWF = OWF || {};

OWF.Events = {
	Widget: {
		BEFORE_LAUNCH: 'beforeWidgetLaunch',
		AFTER_LAUNCH: 'afterWidgetLaunch'
	},
	Dashboard: {
		COMPLETE_RENDER: 'dashboardCompleteRender',
		CHANGED: 'dashboardChanged',
        SELECTED: 'dashboardSelected',
        SHOWN: 'dashboardShown',
        HIDDEN: 'dashboardHidden'
	},
    Marketplace: {
        OPENED: 'marketplaceOpened',
        CLOSED: 'marketplaceClosed'
    }
};