define(['moment'], function (moment) {
    var fromNow = moment.fn.fromNow;

    moment.fn.fromNow = function () {
        var val = fromNow.apply(this, arguments);
        return val === 'a few seconds ago' ? 'just now' : val;
    }

    return moment;
});