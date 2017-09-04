(function() {
    function timecode() {
        /**
        * refactored to use Buzz function
        */
        return function(seconds) {
            var seconds = Number.parseFloat(seconds);

            var timer = buzz.toTimer(seconds, true);

            return timer;
        };
    }

    angular
        .module('blocJams')
        .filter('timecode', timecode);
})();
