(function ($) {

    // this is a binary search that operates via a function
    // func should return < 0 if it should search smaller values
    // func should return > 0 if it should search larger values
    // func should return = 0 if the exact value is found
    // Note: this function handles multiple matches and will return the last match
    // this returns -1 if no match is found
    function binarySearch(length, func) {
        var low = 0;
        var high = length - 1;
        var best = -1;
        var mid;

        while (low <= high) {
            mid = ~ ~((low + high) / 2); //~~ is a fast way to convert something to an int
            var result = func(mid);
            if (result < 0) {
                high = mid - 1;
            } else if (result > 0) {
                low = mid + 1;
            } else {
                best = mid;
                low = mid + 1;
            }
        }

        return best;
    }

    // create the ellipsis function
    // when addTooltip = true, add a title attribute with the original text
    $.fn.ellipsis = function (addTooltip) {

        return this.each(function () {
            var el = $(this);
            if (el.css("overflow") === "hidden") {
                var content = el.html();
                var multiline = el.hasClass('multiline');
                var tempElement = $(this.cloneNode(true))
                    .hide()
                    .css('position', 'absolute')
                    .css('overflow', 'visible')
                    .width(multiline ? el.width() : 'auto')
                    .height(multiline ? 'auto' : el.height())
                ;

                el.after(tempElement);

                //console.log(el.width() + ' - '+tempElement.width());

                var tooTallFunc = function () {
                    return tempElement.height() > el.height();
                };

                var tooWideFunc = function () {
                    return tempElement.width() > el.width();
                };

                var tooLongFunc = multiline ? tooTallFunc : tooWideFunc;

                // if the element is too long...
                if (tooLongFunc()) {

                    var tooltipText = null;
                    // if a tooltip was requested...
                    if (addTooltip) {
                        // trim leading/trailing whitespace
                        // and consolidate internal whitespace to a single space
                        tooltipText = $.trim(el.text()).replace(/\s\s+/g, ' ');
                    }

                    var originalContent = content;

                    var createContentFunc = function (i) {
                        content = originalContent.substr(0, i);
                        tempElement.html(content + "...");
                    };

                    var searchFunc = function (i) {
                        createContentFunc(i);
                        if (tooLongFunc()) {
                            return -1;
                        }
                        return 0;
                    };

                    var len = binarySearch(content.length - 1, searchFunc);

                    createContentFunc(len);

                    el.html(tempElement.html());

                    // add the tooltip if appropriate
                    if (tooltipText !== null) {
                        el.attr('title', tooltipText);
                    }
                }

                tempElement.remove();
            }
        });
    };

} (jQuery));