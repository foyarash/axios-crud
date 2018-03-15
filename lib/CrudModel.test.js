import { expect, assert } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { createCrudModel, CrudModel } from './CrudModel';

let users = [];

const mock = new MockAdapter(axios);
const USERS_ROUTE = '/users';
const USERS_ROUTE_WITH_ID = /\/users\/(\d+)/;

const getIdFromUrl = url => {
  const [, id] = url.match(USERS_ROUTE_WITH_ID);
  return id;
};

mock.onPost(USERS_ROUTE).reply(config => {
  const data = JSON.parse(config.data);
  if (!data.user) {
    return [422];
  }
  const { id, name } = data.user;
  users.push({ id, name });
  return [200, { users }];
});

mock.onGet(USERS_ROUTE).reply(200, { users });
mock.onGet(USERS_ROUTE_WITH_ID).reply(config => {
  const { url, data } = config;
  const id = getIdFromUrl(url);
  return [200, { user: users.find(user => user.id === parseInt(id)) }];
});
mock.onPut(USERS_ROUTE_WITH_ID).reply(config => {
  const { url, data } = config;
  const id = getIdFromUrl(url);

  const user = users.find(user => user.id === parseInt(id));
  if (!user) return [404];
  else {
    const finalData = JSON.parse(data);
    if (!finalData.user) return [422];
    user.name = finalData.user.name;
    return [200, { user }];
  }
});
mock.onDelete(USERS_ROUTE_WITH_ID).reply(config => {
  const { url } = config;
  const id = getIdFromUrl(url);

  const userIdx = users.findIndex(user => user.id === parseInt(id));
  if (userIdx < 0) return [404];
  else {
    users.splice(userIdx, 1);
    return [200];
  }
});

describe('CrudModel', () => {
  const Model = createCrudModel('users');

  it('should create a user successfully', done => {
    const userToCreate = { id: 1, name: 'John Doe' };
    Model.create(userToCreate)
      .then(result => {
        const { data, status } = result;
        expect(status).to.be.equal(200);
        expect(data.users[0]).to.deep.include(userToCreate);
        done();
      })
      .catch(() => {
        assert.fail(0, 1);
        done();
      });
  });

  it('should fail to create a user', done => {
    Model.create().catch(err => {
      expect(err.response.status).to.be.equal(422);
      expect(users.length).to.be.equal(1);
      done();
    });
  });

  it('should retrieve the users list', done => {
    Model.getAll()
      .then(result => {
        const { data, status } = result;
        expect(status).to.be.equal(200);
        expect(data.users.length).to.be.equal(1);
        done();
      })
      .catch(() => {
        assert.fail(0, 1);
        done();
      });
  });

  it('should get user data with id 1', done => {
    Model.get(1).then(result => {
      const { data, status } = result;
      expect(status).to.be.equal(200);
      expect(data.user).to.deep.include(users.find(user => user.id === 1));
      done();
    });
  });

  it('should edit user with id 1', done => {
    const newName = 'John Damn';
    Model.edit(1, { name: newName }).then(result => {
      const { data, status } = result;
      expect(status).to.be.equal(200);
      expect(data.user.name).to.be.equal(newName);
      done();
    });
  });

  it('should have an error when not passing edit data', done => {
    Model.edit(1).catch(err => {
      expect(err.response.status).to.be.equal(422);
      done();
    });
  });

  it('should have an error when edit non existing user', done => {
    Model.edit(42).catch(err => {
      expect(err.response.status).to.be.equal(404);
      done();
    });
  });

  it('should not be able to delete a non existing user', done => {
    Model.delete(42).catch(err => {
      expect(err.response.status).to.be.equal(404);
      expect(users.length).to.be.equal(1);
      done();
    });
  });

  it('should be able to delete an user', done => {
    Model.delete(1).then(result => {
      const { status } = result;
      expect(status).to.be.equal(200);
      expect(users.length).to.be.equal(0);
      done();
    });
  });
});
