/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:23:45
*/
(function (HG) {
    HG._warn;
    HG._error;
    HG._log;

    function HG() {
        HG._warn = console.warn;
        HG._error = console.error;
        HG._log = console.log;

        console.log = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._log.apply(console, msg);
            }
        };

        console.warn = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._warn.apply(console, msg);
            }
        };

        console.error = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._error.apply(console, msg);
            }
        };
    }
    HG.HG = HG;
})(exports.HG || (exports.HG = {}));
var HG = exports.HG;

//# sourceMappingURL=HG.js.map
