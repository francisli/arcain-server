const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/projects', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'projects']);
    testSession = session(app);
  });

  context('unauthenticated', () => {
    describe('GET /', () => {
      it('returns visible Projects ordered by position', async () => {
        /// request user list
        const response = await testSession.get('/api/projects').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 2);

        const records = response.body;
        assert.deepStrictEqual(records[0].name, 'Project 3');
        assert.deepStrictEqual(records[1].name, 'Project 1');
      });
    });

    describe('GET /:id', () => {
      it('returns a visible Project by id', async () => {
        const response = await testSession
          .get('/api/projects/b7cf0682-8286-4144-9dd8-4b49849ee4e0')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body?.name, 'Project 1');
        assert.deepStrictEqual(response.body?.link, 'project-1');
        assert.deepStrictEqual(response.body?.desc, 'This is Project 1.');
        assert.deepStrictEqual(response.body?.isVisible, true);
      });

      it('returns a visible Project by its link', async () => {
        const response = await testSession.get('/api/projects/project-1').set('Accept', 'application/json').expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body?.name, 'Project 1');
        assert.deepStrictEqual(response.body?.link, 'project-1');
        assert.deepStrictEqual(response.body?.desc, 'This is Project 1.');
        assert.deepStrictEqual(response.body?.isVisible, true);
      });

      it('returns unauthorized for a non-visible Project', async () => {
        /// request user list
        await testSession
          .get('/api/projects/7103974b-84d1-440c-b2e4-ee70b68c0b40')
          .set('Accept', 'application/json')
          .expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('POST /', () => {
      it('returns unauthorized', async () => {
        await testSession
          .post('/api/projects')
          .set('Accept', 'application/json')
          .send({
            name: 'Project 4',
            link: 'project-4',
            desc: 'This is Project 4',
            isVisible: false,
          })
          .expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('PATCH /:id', () => {
      it('returns unauthorized', async () => {
        /// request user list
        await testSession
          .patch('/api/projects/7103974b-84d1-440c-b2e4-ee70b68c0b40')
          .set('Accept', 'application/json')
          .send({
            name: 'Edited Project 2',
            link: 'edited-project-2',
            desc: 'This is edited Project 2.',
            isVisible: true,
          })
          .expect(StatusCodes.UNAUTHORIZED);
      });
    });
  });

  context('admin authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    describe('GET /?showAll=true', () => {
      it('returns all Projects', async () => {
        /// request user list
        const response = await testSession.get('/api/projects?showAll=true').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 3);

        const records = response.body;
        assert.deepStrictEqual(records[0].name, 'Project 3');
        assert.deepStrictEqual(records[1].name, 'Project 2');
        assert.deepStrictEqual(records[2].name, 'Project 1');
      });
    });

    describe('POST /', () => {
      it('creates a new Project', async () => {
        /// request user list
        const response = await testSession
          .post('/api/projects')
          .set('Accept', 'application/json')
          .send({
            name: 'Project 4',
            link: 'project-4',
            desc: 'This is Project 4',
            isVisible: false,
          })
          .expect(StatusCodes.CREATED);

        assert.deepStrictEqual(response.body?.name, 'Project 4');
        assert.deepStrictEqual(response.body?.link, 'project-4');
        assert.deepStrictEqual(response.body?.desc, 'This is Project 4');
        assert.deepStrictEqual(response.body?.isVisible, false);

        const record = await models.Project.findByPk(response.body?.id);
        assert.deepStrictEqual(record?.name, 'Project 4');
        assert.deepStrictEqual(record?.link, 'project-4');
        assert.deepStrictEqual(record?.desc, 'This is Project 4');
        assert.deepStrictEqual(record?.isVisible, false);
      });
    });

    describe('GET /:id', () => {
      it('returns a Project by id', async () => {
        /// request user list
        const response = await testSession
          .get('/api/projects/7103974b-84d1-440c-b2e4-ee70b68c0b40')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body?.name, 'Project 2');
        assert.deepStrictEqual(response.body?.link, 'project-2');
        assert.deepStrictEqual(response.body?.desc, 'This is Project 2.');
        assert.deepStrictEqual(response.body?.isVisible, false);
      });
    });

    describe('PATCH /:id', () => {
      it('updates a Project by id', async () => {
        /// request user list
        const response = await testSession
          .patch('/api/projects/7103974b-84d1-440c-b2e4-ee70b68c0b40')
          .set('Accept', 'application/json')
          .send({
            name: 'Edited Project 2',
            link: 'edited-project-2',
            desc: 'This is edited Project 2.',
            isVisible: true,
          })
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body?.name, 'Edited Project 2');
        assert.deepStrictEqual(response.body?.link, 'edited-project-2');
        assert.deepStrictEqual(response.body?.desc, 'This is edited Project 2.');
        assert.deepStrictEqual(response.body?.isVisible, true);

        const record = await models.Project.findByPk('7103974b-84d1-440c-b2e4-ee70b68c0b40');
        assert.deepStrictEqual(record?.name, 'Edited Project 2');
        assert.deepStrictEqual(record?.link, 'edited-project-2');
        assert.deepStrictEqual(record?.desc, 'This is edited Project 2.');
        assert.deepStrictEqual(record?.isVisible, true);
      });
    });
  });
});
