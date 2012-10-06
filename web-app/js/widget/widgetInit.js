if (!Ozone.disableWidgetInit) {


    owfdojo.addOnLoad(function() {

        //calc pageload time
        Ozone.util.pageLoad.afterLoad = (new Date()).getTime();
        Ozone.util.pageLoad.calcLoadTime();

        if(Ozone.util.isInContainer()) {
            OWF._init(window, document);
        }

    });
}