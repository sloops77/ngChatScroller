(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ngChatScroller", [], factory);
	else if(typeof exports === 'object')
		exports["ngChatScroller"] = factory();
	else
		root["ngChatScroller"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ngcsUtils = __webpack_require__(1);
	
	var _ngcsUtils2 = _interopRequireDefault(_ngcsUtils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	
	            var isFastScroll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	
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
	
	var NgChatScrollerController = function () {
	    function NgChatScrollerController($scope, $element, $attrs, $log) {
	        _classCallCheck(this, NgChatScrollerController);
	
	        this.$log = $log;
	        this.$attrs = $attrs;
	        this.chatScroller = new ChatScroller($element[0], $log);
	        this.messages = null;
	        $scope.ngcsNumRendered = $scope.ngcsLimit = 0;
	
	        this.watches($scope, $attrs.chatScrollView);
	    }
	
	    _createClass(NgChatScrollerController, [{
	        key: 'getTrackByVal',
	        value: function getTrackByVal(val) {
	            return _ngcsUtils2.default.isEmpty(val) || _ngcsUtils2.default.isEmpty(this.$attrs.ngcsTrackBy) ? val : val[this.$attrs.ngcsTrackBy];
	        }
	    }, {
	        key: 'watches',
	        value: function watches($scope, scrollViewAttr) {
	            var _this2 = this;
	
	            $scope.$watchCollection(scrollViewAttr, function (newVal) {
	                // this.$log.info(`@ChatMessages.updateMessages(${ngcsUtils.size(newVal)}), current=${$scope.ngcsLimit}, numRendered=${$scope.ngcsNumRendered})}`)
	
	                if (newVal === null || _ngcsUtils2.default.size(newVal) === $scope.ngcsLimit) {
	                    return;
	                }
	
	                if (_this2.getTrackByVal(_ngcsUtils2.default.last(_this2.messages)) === _this2.getTrackByVal(_ngcsUtils2.default.last(newVal))) {
	                    // this.$log.info('MaintainScroll');
	                    _this2.chatScroller.startScroll('MaintainScroll', false);
	                } else {
	                    // this.$log.info(`ScrollBottom(${$scope.ngcsNumRendered > 0})`);
	                    _this2.chatScroller.startScroll('ScrollBottom', $scope.ngcsNumRendered > 0);
	                }
	
	                _this2.messages = newVal;
	                $scope.ngcsLimit = _ngcsUtils2.default.size(newVal);
	            });
	        }
	    }]);
	
	    return NgChatScrollerController;
	}();
	
	NgChatScrollerController.$inject = ['$scope', '$element', '$attrs', '$log'];
	
	angular.module('ngChatScroller', []).directive('chatScrollView', ['$log', function ($log) {
	    // eslint-disable-line no-unused-vars
	    return {
	        restrict: 'A',
	        controller: NgChatScrollerController,
	        link: function link($scope, $element, $attrs, $ctrl) {
	            var chatMessageSelector = $attrs.ngcsMessageSelector ? $attrs.ngcsMessageSelector : '.chat-message';
	            return $scope.$watch(function () {
	                return $element[0].querySelectorAll(chatMessageSelector).length;
	            }, function (newVal) {
	                // $log.info(`@ChatMessages.watch('numChats'): newVal=${newVal}, oldVal=${oldVal}`);
	                if (newVal > 0) {
	                    $scope.$evalAsync(function () {
	                        if ($scope.ngcsLimit === newVal) {
	                            $scope.ngcsNumRendered = newVal;
	                            $ctrl.chatScroller.stopCurrentScroll();
	                        }
	                    });
	                }
	            });
	        }
	    };
	}]);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Created by arolave on 15/11/2016.
	 */
	var ngcsUtils = {
	    size: function size(arr) {
	        if (!arr) return 0;
	
	        return arr.length;
	    },
	    last: function last(arr) {
	        if (!arr) return undefined;
	
	        return arr[arr.length - 1];
	    },
	
	    isEmpty: function isEmpty(val) {
	        if (val == null) return true;
	
	        if (Array.isArray(val) || typeof val === 'string') {
	            return val.length === 0;
	        }
	
	        if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
	            return Object.keys(val).length === 0;
	        }
	
	        return false;
	    }
	};
	
	module.exports = ngcsUtils;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ngChatScroller.js.map