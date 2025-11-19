const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/links', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users', 'links']);
    testSession = session(app);
  });

  context('unauthenticated', () => {
    describe('GET /', () => {
      it('should return only visible links for unauthenticated user', async () => {
        const res = await testSession.get('/api/links').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.ok(Array.isArray(res.body));
        assert.deepStrictEqual(res.body.length, 2);
        res.body.forEach((link) => {
          assert.ok(link.isVisible);
        });
      });

      it('should not show hidden links to unauthenticated users even with showAll=true', async () => {
        const res = await testSession.get('/api/links?showAll=true').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.ok(Array.isArray(res.body));
        assert.deepStrictEqual(res.body.length, 2);
        res.body.forEach((link) => {
          assert.ok(link.isVisible);
        });
      });
    });

    describe('GET /:id', () => {
      it('should return Unauthorized for unauthenticated user', async () => {
        await testSession
          .get(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`)
          .set('Accept', 'application/json')
          .expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('POST /', () => {
      it('should return Unauthorized for unauthenticated user', async () => {
        await testSession.post('/api/links').set('Accept', 'application/json').send({}).expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('PUT /:id', () => {
      it('should return Unauthorized for unauthenticated user', async () => {
        await testSession.put(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`).send({}).expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('DELETE /:id', () => {
      it('should return Unauthorized for unauthenticated user', async () => {
        await testSession.delete(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`).expect(StatusCodes.UNAUTHORIZED);
      });
    });
  });

  context('authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    describe('GET /', () => {
      it('should return all links for admin when showAll=true', async () => {
        const res = await testSession.get('/api/links?showAll=true').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.ok(Array.isArray(res.body));
        assert.deepStrictEqual(res.body.length, 3);
        const hasVisible = res.body.some((link) => link.isVisible === true);
        const hasHidden = res.body.some((link) => link.isVisible === false);
        assert.ok(hasVisible);
        assert.ok(hasHidden);
      });
    });

    describe('GET /:id', () => {
      it('should return a link by id for admin', async () => {
        const res = await testSession
          .get(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`)
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);
        assert.deepStrictEqual(res.body?.id, '6f83c9ae-af02-4edf-8ea9-b130bf7eec66');
        assert.deepStrictEqual(res.body?.name, 'Link 1');
        assert.deepStrictEqual(res.body?.date, '2025-10-01');
        assert.deepStrictEqual(res.body?.desc, 'This is Link 1.');
        assert.deepStrictEqual(res.body?.url, 'http://link-1');
      });

      it('should return 404 for non-existent link', async () => {
        await testSession
          .get('/api/links/e9a14b44-c612-4efb-904d-896be001df5e')
          .set('Accept', 'application/json')
          .expect(StatusCodes.NOT_FOUND);
      });
    });

    describe('POST /', () => {
      const newLink = {
        name: 'New Link',
        date: '2023-02-01',
        desc: 'New Description',
        url: 'https://new.example.com',
        isVisible: true,
      };

      it('should create a new link as admin', async () => {
        const res = await testSession.post('/api/links').set('Accept', 'application/json').send(newLink).expect(StatusCodes.CREATED);

        assert.ok(res.body?.id);
        assert.deepStrictEqual(res.body?.name, newLink.name);
        assert.deepStrictEqual(res.body?.date, newLink.date);
        assert.deepStrictEqual(res.body?.desc, newLink.desc);
        assert.deepStrictEqual(res.body?.url, newLink.url);
        assert.deepStrictEqual(res.body?.isVisible, newLink.isVisible);

        const record = await models.Link.findByPk(res.body?.id);
        assert.deepStrictEqual(record?.name, newLink.name);
        assert.deepStrictEqual(record?.date, newLink.date);
        assert.deepStrictEqual(record?.desc, newLink.desc);
        assert.deepStrictEqual(record?.url, newLink.url);
        assert.deepStrictEqual(record?.isVisible, newLink.isVisible);
      });
    });

    describe('PUT /:id', () => {
      const updatedData = {
        name: 'Updated Link',
        date: '2025-09-01',
        desc: 'Updated Description',
        url: 'https://updated-link',
        isVisible: false,
      };

      it('should update a link as admin', async () => {
        const res = await testSession
          .put(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`)
          .set('Accept', 'application/json')
          .send(updatedData)
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(res.body?.name, updatedData.name);
        assert.deepStrictEqual(res.body?.date, updatedData.date);
        assert.deepStrictEqual(res.body?.desc, updatedData.desc);
        assert.deepStrictEqual(res.body?.url, updatedData.url);
        assert.deepStrictEqual(res.body?.isVisible, updatedData.isVisible);

        const record = await models.Link.findByPk('6f83c9ae-af02-4edf-8ea9-b130bf7eec66');
        assert.deepStrictEqual(record?.name, updatedData.name);
        assert.deepStrictEqual(record?.date, updatedData.date);
        assert.deepStrictEqual(record?.desc, updatedData.desc);
        assert.deepStrictEqual(record?.url, updatedData.url);
        assert.deepStrictEqual(record?.isVisible, updatedData.isVisible);
      });

      it('should return 404 for non-existent link', async () => {
        await testSession
          .put('/api/links/eaa50a62-e179-458c-9fbf-61a77011de1b')
          .set('Accept', 'application/json')
          .send(updatedData)
          .expect(StatusCodes.NOT_FOUND);
      });
    });

    describe('DELETE /:id', () => {
      it('should delete a link as admin', async () => {
        await testSession.delete(`/api/links/6f83c9ae-af02-4edf-8ea9-b130bf7eec66`).expect(StatusCodes.NO_CONTENT);
        // Verify the link was deleted
        const link = await models.Link.findByPk('6f83c9ae-af02-4edf-8ea9-b130bf7eec66');
        assert.ok(link === null);
      });

      it('should return 404 for non-existent link', async () => {
        await testSession.delete('/api/links/2bfbd33e-f9f3-4245-9a25-5dabb3a22da9').expect(StatusCodes.NOT_FOUND);
      });
    });
  });
});
