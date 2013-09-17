;(function($) {

    $('.doc-name').siblings('p').first().addClass('lead');

    // syntax highlight and pretify code 
    $('.response-body, .request-body').each(function(i, body) {
        var $body = $(body),
            code = $body.html();

        try {
            code = JSON.parse(code);
            $body.html(JSON.stringify(code, null, 4))
        }
        catch (e) {
            console.warn("Error converting to JSON: ", code)
        }

        hljs.highlightBlock(body);
    });

    $('.resource-endpoint').click(function () {
        var $this = $(this);

        $this.children('.resource-endpoint-details').toggle();
    });
})(jQuery);
