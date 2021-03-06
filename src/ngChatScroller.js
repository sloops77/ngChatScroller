import ngcsUtils from './ngcsUtils';
/**
 * First created for Sportwize
 * Smooth chat scroll for both scroll to bottom & maintaining scroll
 */
class ChatScroller {
    constructor($elem, $log) {
        this.scrollView = $elem;
        this.$log = $log;
    }

    startScrollBottom() {
        // this.$log.info(`@ChatScroller.startScrollBottom`);
    }

    doScrollBottom() {
        // this.$log.log(`@ChatScroller.doScrollBottom ${this.scrollView.scrollHeight}, ${Date.now()}`);
        this.scrollView.scrollTop = this.scrollView.scrollHeight;
    }

    startMaintainScroll() {
        this.startScrollTopMax = this.scrollView.scrollTop;
        // this.$log.info(`@ChatScroller.startMaintainScroll: ${this.startScrollTopMax}, ${Date.now()}`);
        return this.startScrollTopMax;
    }

    doMaintainScroll() {
        const topDelta = this.scrollView.scrollHeight - this.startScrollHeight;
        // this.$log.info(`@ChatScroller.doMaintainScroll: ${topDelta}, ${Date.now()}`);
        return this.scrollView.scrollTop = this.startScrollTopMax + topDelta // would be nice to offer animatation
    }

    startScroll(scrollType, shouldAnimate, isFastScroll = false) {

        const doCheckSize = (sizeChange, repeats) => {
            // this.$log.info(`@ChatScroller.doCheckSize(${this.startScrollTime}, ${repeats}), ${Date.now()-this.startScrollTime}ms`);
            const newSizeChange = Math.abs(this.scrollView.scrollHeight - this.startScrollHeight);
            // this.$log.log(`${this.scrollView.scrollHeight} v ${this.startScrollHeight}`);
            if (newSizeChange !== sizeChange) {
                this[`do${scrollType}`]();
                return checkSize(newSizeChange, 0);
            } else if (repeats <= 4 || !this.endCurrentScroll) {
                return checkSize(sizeChange, repeats + 1);
            } else {
                // this.$log.log("EndCurrentScroll && Resize Detection repeats greater than 4");
                return this[`do${scrollType}`]();
            }
        };

        const checkSize = (sizeChange, repeats) => {
            return setTimeout(
                () => doCheckSize(sizeChange, repeats)
            );
        };

        this.scrollType = scrollType;
        this.endCurrentScroll = isFastScroll;
        this.shouldAnimate = shouldAnimate;
        this.startScrollHeight = this.scrollView.scrollHeight;
        this.startScrollTime = Date.now();

        // this.$log.info(`@ChatScroller.startScroll(${scrollType}, ${shouldAnimate}), ${this.startScrollTime}`);
        this[`start${scrollType}`]();
        this[`do${scrollType}`]();
        // this.$log.info(`@ChatScroller.startCheckSize ${this.startScrollTime}, ${Date.now()-this.startScrollTime}ms`);
        return doCheckSize(0, 0);
    }

    stopCurrentScroll() {
        // this.$log.info(`@ChatScroller.stopCurrentScroll ${this.startScrollTime}, ${Date.now()-this.startScrollTime}ms`);
        // this.scrollView.resize();
        this[`do${this.scrollType}`]();
        return this.endCurrentScroll = true;
    }
}

class NgChatScrollerController {
    constructor($scope, $element, $attrs, $log) {
        this.$log = $log;
        this.$attrs = $attrs;
        this.chatScroller = new ChatScroller($element[0], $log);
        this.messages = null;
        $scope.ngcsNumRendered = $scope.ngcsLimit = 0;

        this.watches($scope, $attrs.chatScrollView)
    }

    getTrackByVal(val) {
        return ngcsUtils.isEmpty(val) || ngcsUtils.isEmpty(this.$attrs.ngcsTrackBy) ? val : val[this.$attrs.ngcsTrackBy]
    }

    watches($scope, scrollViewAttr) {
        $scope.$watchCollection(scrollViewAttr, (newVal) => {
            // this.$log.info(`@ChatMessages.updateMessages(${ngcsUtils.size(newVal)}), current=${$scope.ngcsLimit}, numRendered=${$scope.ngcsNumRendered})}`)

            if (newVal === null || ngcsUtils.size(newVal) === $scope.ngcsLimit) {
                return;
            }

            if (this.getTrackByVal(ngcsUtils.last(this.messages)) === this.getTrackByVal(ngcsUtils.last(newVal))) {
                // this.$log.info('MaintainScroll');
                this.chatScroller.startScroll('MaintainScroll', false);
            } else {
                // this.$log.info(`ScrollBottom(${$scope.ngcsNumRendered > 0})`);
                this.chatScroller.startScroll('ScrollBottom', $scope.ngcsNumRendered > 0);
            }

            this.messages = newVal;
            $scope.ngcsLimit = ngcsUtils.size(newVal);
        });
    }
}


NgChatScrollerController.$inject = ['$scope', '$element', '$attrs', '$log'];

angular.module('ngChatScroller', []).directive('chatScrollView', ['$log', ($log) => { // eslint-disable-line no-unused-vars
    return {
        restrict: 'A',
        controller: NgChatScrollerController,
        link: ($scope, $element, $attrs, $ctrl) => {
            const chatMessageSelector = $attrs.ngcsMessageSelector ? $attrs.ngcsMessageSelector : '.chat-message';
            return $scope.$watch(
                () => $element[0].querySelectorAll(chatMessageSelector).length,
                (newVal) => {
                    // $log.info(`@ChatMessages.watch('numChats'): newVal=${newVal}, oldVal=${oldVal}`);
                    if (newVal > 0) {
                        $scope.$evalAsync(() => {
                            if ($scope.ngcsLimit === newVal) {
                                $scope.ngcsNumRendered = newVal;
                                $ctrl.chatScroller.stopCurrentScroll();
                            }
                        });
                    }
                }
            );
        }
    };
}]);


