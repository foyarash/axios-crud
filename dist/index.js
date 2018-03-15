'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCrudModel = exports.CrudModel = exports.config = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var globalConfig = {
  adapter: _axios2.default,
  singularize: true,
  modelNameAsAttribute: true
};

var config = function config(newConf) {
  globalConfig = _extends({}, globalConfig, newConf);
};

var CrudModel = function () {
  function CrudModel(modelName) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CrudModel);

    this.modelName = modelName;
    this.config = _extends({}, globalConfig, config);
  }

  _createClass(CrudModel, [{
    key: 'getKeyForRequestParams',
    value: function getKeyForRequestParams() {
      return this.modelName.substr(0, this.modelName.length - (this.config.singularize ? 1 : 0));
    }
  }, {
    key: 'getRoute',
    value: function getRoute() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      var routeName = '/' + this.modelName;
      if (id) routeName += '/' + id;
      return routeName;
    }
  }, {
    key: 'getRequestParams',
    value: function getRequestParams(modelData, additionalData) {
      var params = {};
      if (this.config.modelNameAsAttribute) {
        params[this.getKeyForRequestParams()] = modelData;
      } else {
        params = _extends({}, modelData);
      }
      return _extends({}, params, additionalData && additionalData || {});
    }
  }, {
    key: 'getAndVerifyAdapter',
    value: function getAndVerifyAdapter(method) {
      if (!this.config.adapter) {
        throw new Error('CrudModel : adapter cannot be null or undefined');
      }
      if (!this.config.adapter[method]) {
        throw new Error('CrudModel : adapter does not have ' + method + ' method');
      }
      if (!(0, _isFunction2.default)(this.config.adapter[method])) {
        throw new Error('CrudModel : adapter\'s ' + method + ' property must be a function');
      }
      return this.config.adapter[method];
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.getAndVerifyAdapter('get').apply(undefined, [this.getRoute()].concat(args));
    }
  }, {
    key: 'get',
    value: function get(id) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this.getAndVerifyAdapter('get').apply(undefined, [this.getRoute(id)].concat(args));
    }
  }, {
    key: 'edit',
    value: function edit(id, modelData, additionalData) {
      for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        args[_key3 - 3] = arguments[_key3];
      }

      return this.getAndVerifyAdapter('put').apply(undefined, [this.getRoute(id), this.getRequestParams(modelData, additionalData)].concat(args));
    }
  }, {
    key: 'create',
    value: function create(modelData, additionalData) {
      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      return this.getAndVerifyAdapter('post').apply(undefined, [this.getRoute(), this.getRequestParams(modelData, additionalData)].concat(args));
    }
  }, {
    key: 'delete',
    value: function _delete(id) {
      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      return this.getAndVerifyAdapter('delete').apply(undefined, [this.getRoute(id)].concat(args));
    }
  }]);

  return CrudModel;
}();

var createCrudModel = function createCrudModel(name, config) {
  return new CrudModel(name, config);
};

exports.config = config;
exports.CrudModel = CrudModel;
exports.createCrudModel = createCrudModel;
