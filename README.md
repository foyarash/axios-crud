axios-crud provides a simple set of functions to do some CRUD requests to an API using axios.

# Install

`yarn add axios-crud` or `npm i -S axios-crud`

# Get started

1.  Supposing you have

```
class UserAPI {
  doARequestToTheAPI() {
    // do some stuff
  }
}
```

and you need to have some CRUD functions for a model called "users" on the backend side, this is how the code would look like:

```
class UserAPI extends CrudModel {
  constructor() {
    super('users');
    // Now you can access the CRUD methods in your class
  }

  doARequestToTheAPI() {
    // do some stuff
  }
}
```

The CrudModel constructor takes the model name as first paramater, and a config object as second parameter.

2.  Calling the `createCrudModel` which simply returns the set of CRUD functions. Takes the name of the model as first parameter and a config object as second parameter.

# Config

You may want to set a global config to use in all of your CrudModel's.

This can be done using the `config` method, which takes an object as parameter and merges the default config with the one passed as parameter.

You can set the following properties in the config object:

* adapter : defaults to `axios`. It is usefull if you want to use an abstraction of your networking library. This adapter must contain the same methods than axios has.
* modelNameAsAttribute : add an attribute which name is the model name as a param for create and edit requests.
* singularize : used if `modelNameAsAttribute` is true. Taking back our UserAPI example, our model is called "users". You may want to remove the last "s" in case of creation and edition (that's how it works with RoR). Setting this to true will then remove the last character from the model name when passing it as a key of the params object for the create / edit requests. Defaults to true.

# API

* getAll(...args)
* get(id, ...args)
* edit(id, modelData, additionalData, ...args)
* create(modelData, additionalData, ...args)
* delete(id, ...args)

For edit and create, modelData will be associated with the key [modelName] key, and additionalData will simply be merged with the params object

`args` are optional.

# Simple example

```
import { createCrudModel, config } from 'axios-crud';

const Model = createCrudModel('users');

// Get all users
Model.getAll().then((result) => console.log(result));
// Get a user data with id 10
Model.get(10).then((result) => console.log(result));
```

Run the example folder:

`yarn` or `npm i` then `yarn start` or `npm start`
