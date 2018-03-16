const axios = require('axios');
const { createCrudModel, config } = require('axios-crud');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
config({ adapter: axios, modelNameAsAttribute: false });

const Model = createCrudModel('posts');

Model.get(42).then(({ data }) => console.log('get post with id 42', data));
Model.getAll().then(({ data }) => console.log('get all posts', data));
Model.create({ title: 'foo', body: 'bar' }).then(({ data }) =>
  console.log('created a new post', data)
);
Model.edit(42, { title: 'Blabla' }).then(({ data }) =>
  console.log('edited post 42', data)
);
Model.delete(42).then(({ data }) =>
  console.log('removed post with id 42', data)
);
