"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOddsFormat = void 0;
/** 赔率格式 */
var EOddsFormat;
(function (EOddsFormat) {
    EOddsFormat[EOddsFormat["HongKong"] = 1] = "HongKong";
    EOddsFormat[EOddsFormat["Indonesian"] = 2] = "Indonesian";
    EOddsFormat[EOddsFormat["American"] = 3] = "American";
    EOddsFormat[EOddsFormat["Decimal"] = 4] = "Decimal";
    EOddsFormat[EOddsFormat["Malay"] = 5] = "Malay";
    EOddsFormat[EOddsFormat["Fraction"] = 6] = "Fraction";
})(EOddsFormat || (exports.EOddsFormat = EOddsFormat = {}));
