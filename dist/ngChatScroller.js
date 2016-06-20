/*!
 * Copyright 2016 Thinking Bytes Ltd.
 *
 * ngChatScroller, v0.1.3
 * Smooth Chat based scrolling for Angular.
 * http://angularjs.org/
 *
 * By @arolave <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * First created for Sportwize
 * Smooth chat scroll for both scroll to bottom & maintaining scroll
 */

var ChatScroller = function () {
    function ChatScroller($elem, $log) {
        _classCallCheck(this, ChatScroller);

        this.scrollView = $elem;
        this.$log = $log;
    }

    _createClass(ChatScroller, [{
        key: 'startScrollBottom',
        value: function startScrollBottom() {
            // this.$log.info(`@ChatScroller.startScrollBottom`);
        }
    }, {
        key: 'doScrollBottom',
        value: function doScrollBottom() {
            // this.$log.log(`@ChatScroller.doScrollBottom ${this.scrollView.scrollHeight}, ${Date.now()}`);
            this.scrollView.scrollTop = this.scrollView.scrollHeight;
        }
    }, {
        key: 'startMaintainScroll',
        value: function startMaintainScroll() {
            this.startScrollTopMax = this.scrollView.scrollTop;
            // this.$log.info(`@ChatScroller.startMaintainScroll: ${this.startScrollTopMax}, ${Date.now()}`);
            return this.startScrollTopMax;
        }
    }, {
        key: 'doMaintainScroll',
        value: function doMaintainScroll() {
            var topDelta = this.scrollView.scrollHeight - this.startScrollHeight;
            // this.$log.info(`@ChatScroller.doMaintainScroll: ${topDelta}, ${Date.now()}`);
            return this.scrollView.scrollTop = this.startScrollTopMax + topDelta; // would be nice to offer animatation
        }
    }, {
        key: 'startScroll',
        value: function startScroll(scrollType, shouldAnimate) {
            var _this = this;

            var isFastScroll = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];


            var doCheckSize = function doCheckSize(sizeChange, repeats) {
                // this.$log.info(`@ChatScroller.doCheckSize(${this.startScrollTime}, ${repeats}), ${Date.now()-this.startScrollTime}ms`);
                var newSizeChange = Math.abs(_this.scrollView.scrollHeight - _this.startScrollHeight);
                // this.$log.log(`${this.scrollView.scrollHeight} v ${this.startScrollHeight}`);
                if (newSizeChange !== sizeChange) {
                    _this['do' + scrollType]();
                    return checkSize(newSizeChange, 0);
                } else if (repeats <= 4 || !_this.endCurrentScroll) {
                    return checkSize(sizeChange, repeats + 1);
                } else {
                    // this.$log.log("EndCurrentScroll && Resize Detection repeats greater than 4");
                    return _this['do' + scrollType]();
                }
            };

            var checkSize = function checkSize(sizeChange, repeats) {
                return setTimeout(function () {
                    return doCheckSize(sizeChange, repeats);
                });
            };

            this.scrollType = scrollType;
            this.endCurrentScroll = isFastScroll;
            this.shouldAnimate = shouldAnimate;
            this.startScrollHeight = this.scrollView.scrollHeight;
            this.startScrollTime = Date.now();

            // this.$log.info(`@ChatScroller.startScroll(${scrollType}, ${shouldAnimate}), ${this.startScrollTime}`);
            this['start' + scrollType]();
            this['do' + scrollType]();
            // this.$log.info(`@ChatScroller.startCheckSize ${this.startScrollTime}, ${Date.now()-this.startScrollTime}ms`);
            return doCheckSize(0, 0);
        }
    }, {
        key: 'stopCurrentScroll',
        value: function stopCurrentScroll() {
            // this.$log.info(`@ChatScroller.stopCurrentScroll ${this.startScrollTime}, ${Date.now()-this.startScrollTime}ms`);
            // this.scrollView.resize();
            this['do' + this.scrollType]();
            return this.endCurrentScroll = true;
        }
    }]);

    return ChatScroller;
}();

utils = {
    size: function size(arr) {
        if (!arr) return 0;

        return arr.length;
    },
    last: function last(arr) {
        if (!arr) return undefined;

        return arr[arr.length - 1];
    }
};

angular.module('ngChatScroller', []).directive('chatScrollView', ['$log', function ($log) {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            undefined.init = function () {
                undefined.chatScroller = new ChatScroller($element[0], $log);
                undefined.messages = null;
                $scope.ngcsNumRendered = $scope.ngcsLimit = 0;
            };

            $scope.$watchCollection($attrs.chatScrollView, function (newVal) {
                // $log.info(`@ChatMessages.updateMessages(${utils.size(newVal)}), current=${$scope.ngcsLimit}, numRendered=${$scope.ngcsNumRendered})}`)

                if (newVal === null || utils.size(newVal) === $scope.ngcsLimit) return;

                if (utils.last(undefined.messages) === utils.last(newVal)) {
                    // $log.info('MaintainScroll');
                    undefined.chatScroller.startScroll('MaintainScroll', false);
                } else {
                    // $log.info(`ScrollBottom(${$scope.ngcsNumRendered > 0})`);
                    undefined.chatScroller.startScroll('ScrollBottom', $scope.ngcsNumRendered > 0);
                }

                undefined.messages = newVal;
                $scope.ngcsLimit = utils.size(newVal);
            });

            undefined.init();
        }],
        link: function link($scope, $element, $attrs) {
            var chatMessageSelector = $attrs.ngcsMessageSelector ? $attrs.ngcsMessageSelector : '.chat-message';
            return $scope.$watch(function () {
                return $element[0].querySelectorAll(chatMessageSelector).length;
            }, function (newVal, oldVal) {
                // $log.info(`@ChatMessages.watch('numChats'): newVal=${newVal}, oldVal=${oldVal}`);
                if (newVal > 0) {
                    $scope.$evalAsync(function () {
                        if ($scope.ngcsLimit === newVal) {
                            $scope.ngcsNumRendered = newVal;
                            undefined.chatScroller.stopCurrentScroll();
                        }
                    });
                }
            });
        }
    };
}]);
})();