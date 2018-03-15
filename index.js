import axios from 'axios';
import isFunction from 'lodash/isFunction';

let globalConfig = {
  adapter: axios,
  singularize: true
};

export const config = newConf => {
  globalConfig = {
    ...globalConfig,
    ...newConf
  };
};

export class CrudModel {
  constructor(modelName, config = {}) {
    this.modelName = modelName;
    this.config = {
      ...globalConfig,
      ...config
    };
  }

  getKeyForRequestParams() {
    return this.modelName.substr(
      0,
      this.modelName.length - (this.config.singularize ? 1 : 0)
    );
  }

  getRoute(id = undefined) {
    let routeName = `/${this.modelName}`;
    if (id) routeName += `/${id}`;
    return routeName;
  }

  getRequestParams(modelData, additionalData) {
    return {
      [this.getKeyForRequestParams()]: modelData,
      ...((additionalData && additionalData) || {})
    };
  }

  getAndVerifyAdapter(method) {
    if (!this.config.adapter) {
      throw new Error('CrudModel : adapter cannot be null or undefined');
    }
    if (!this.config.adapter[method]) {
      throw new Error(`CrudModel : adapter does not have ${method} method`);
    }
    if (!isFunction(this.config.adapter[method])) {
      throw new Error(
        `CrudModel : adapter's ${method} property must be a function`
      );
    }
    return this.config.adapter[method];
  }

  getAll(...args) {
    return this.getAndVerifyAdapter('get').call(this.getRoute(), ...args);
  }

  get(id) {
    return this.getAndVerifyAdapter('get').call(this.getRoute(id), ...args);
  }

  edit(id, modelData, additionalData, ...args) {
    return this.getAndVerifyAdapter('put').call(
      this.getRoute(id),
      this.getRequestParams(modelData, additionalData),
      ...args
    );
  }

  create(modelData, additionalData, ...args) {
    return this.getAndVerifyAdapter('post').call(
      this.getRoute(),
      this.getRequestParams(modelData, additionalData),
      ...args
    );
  }

  delete(id, ...args) {
    return this.getAndVerifyAdapter('delete').call(this.getRoute(id), ...args);
  }
}

export default (createCrudModel = (name, config) =>
  new CrudModel(name, config));
