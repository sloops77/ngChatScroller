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

utils = {
    size(arr) {
        if (!arr)
          return 0;

        return arr.length;
    },
    last(arr) {
        if (!arr)
          return undefined;

        return arr[arr.length - 1];
    }
}

angular.module('ngChatScroller', []).directive('chatScrollView', ['$log', ($log) => {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', ($scope, $element, $attrs) => {
            this.init = () => {
                this.chatScroller = new ChatScroller($element[0], $log);
                this.messages = null;
                $scope.ngcsNumRendered = $scope.ngcsLimit = 0;
            };

            $scope.$watchCollection($attrs.chatScrollView, (newVal) => {
                // $log.info(`@ChatMessages.updateMessages(${utils.size(newVal)}), current=${$scope.ngcsLimit}, numRendered=${$scope.ngcsNumRendered})}`)

                if (newVal === null || utils.size(newVal) === $scope.ngcsLimit)
                    return;

                if (utils.last(this.messages) === utils.last(newVal)) {
                    // $log.info('MaintainScroll');
                    this.chatScroller.startScroll('MaintainScroll', false);
                } else {
                    // $log.info(`ScrollBottom(${$scope.ngcsNumRendered > 0})`);
                    this.chatScroller.startScroll('ScrollBottom', $scope.ngcsNumRendered > 0);
                }

                this.messages = newVal;
                $scope.ngcsLimit = utils.size(newVal);
            });

            this.init();
        }],
        link: ($scope, $element, $attrs) => {
            const chatMessageSelector = $attrs.ngcsMessageSelector ? $attrs.ngcsMessageSelector : '.chat-message';
            return $scope.$watch(
              () => $element[0].querySelectorAll(chatMessageSelector).length,
              (newVal, oldVal) => {
                  // $log.info(`@ChatMessages.watch('numChats'): newVal=${newVal}, oldVal=${oldVal}`);
                  if (newVal > 0) {
                      $scope.$evalAsync(() => {
                          if ($scope.ngcsLimit === newVal) {
                              $scope.ngcsNumRendered = newVal;
                              this.chatScroller.stopCurrentScroll();
                          }
                      });
                  }
              }
            );
        }
    };
}]);


