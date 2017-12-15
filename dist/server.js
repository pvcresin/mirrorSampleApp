/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _multer = __webpack_require__(3);

var _multer2 = _interopRequireDefault(_multer);

var _moment = __webpack_require__(4);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_moment2.default.locale('ja');

const getDate = filename => {
	const array = filename.replace('.webm', '').split('-');
	return {
		year: array[0],
		month: array[1],
		day: array[2],
		hour: array[3],
		minute: array[4],
		second: array[5]
	};
};

const app = (0, _express2.default)();
const storagePath = 'public/videos';
const storage = _multer2.default.diskStorage({
	destination: (req, file, cb) => {
		cb(null, storagePath);
	},
	filename: (req, file, cb) => {
		const time = (0, _moment2.default)().format('YYYY-MM-DD-HH-mm-ss');
		cb(null, time + '.webm');
	}
});
const upload = (0, _multer2.default)({ storage: storage });

app.use(_express2.default.static('public')).get('/', (req, res, next) => {
	res.send('Hello');
}).get('/delete', (req, res, next) => {
	_fs2.default.readdir(storagePath, (err, files) => {
		if (err) throw err;
		files.forEach(file => {
			_fs2.default.unlinkSync(`${storagePath}/${file}`);
		});
		return res.send('ok');
	});
}).post('/upload', upload.single('video'), (req, res, next) => {
	res.send('Success');
}).get('/list', (req, res, next) => {
	_fs2.default.readdir(storagePath, (err, files) => {
		if (err) throw err;
		res.json(files.map(filename => {
			return {
				filename: filename,
				date: getDate(filename)
			};
		}));
	});
}).listen(3000, () => {
	console.log("URL -> http://localhost:3000");
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ })
/******/ ]);