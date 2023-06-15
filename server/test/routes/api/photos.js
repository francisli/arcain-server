const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const session = require('supertest-session');

const helper = require('../../helper');
const app = require('../../../app');
const models = require('../../../models');

describe('/api/photos', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadUploads([
      ['512x512.png', 'b45136f4-54e4-45cd-8851-efc9d733a573.png'],
      ['512x512.png', 'cdd8007d-dcaf-4163-b497-92d378679668.png'],
      ['512x512.png', 'fd2e73ba-0142-4cdc-a804-3b399bfc3e02.png'],
    ]);
    await helper.loadFixtures(['users', 'projects', 'photos']);
    testSession = session(app);
  });

  afterEach(async () => {
    await helper.cleanAssets();
  });

  context('unauthenticated', () => {
    describe('GET /', () => {
      it('returns a random visible Photo for the homepage', async () => {
        const response = await testSession.get('/api/photos').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 1);

        const records = response.body;
        assert.deepStrictEqual(records[0].file, 'cdd8007d-dcaf-4163-b497-92d378679668.png');
      });

      it('returns visible Photos for a Project', async () => {
        /// request user list
        const response = await testSession
          .get('/api/photos?ProjectId=b7cf0682-8286-4144-9dd8-4b49849ee4e0')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 1);

        const records = response.body;
        assert.deepStrictEqual(records[0].file, 'cdd8007d-dcaf-4163-b497-92d378679668.png');
      });
    });

    describe('POST /', () => {
      it('returns unauthorized', async () => {
        await testSession.post('/api/photos').set('Accept', 'application/json').send({}).expect(StatusCodes.UNAUTHORIZED);
      });
    });

    describe('PATCH /:id', () => {
      it('returns unauthorized', async () => {
        /// request user list
        await testSession
          .patch('/api/projects/7103974b-84d1-440c-b2e4-ee70b68c0b40')
          .set('Accept', 'application/json')
          .send({})
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
      it('returns all Photos', async () => {
        /// request user list
        const response = await testSession
          .get('/api/photos?ProjectId=b7cf0682-8286-4144-9dd8-4b49849ee4e0&showAll=true')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 2);

        const records = response.body;
        assert.deepStrictEqual(records[0].file, 'b45136f4-54e4-45cd-8851-efc9d733a573.png');
        assert.deepStrictEqual(records[1].file, 'cdd8007d-dcaf-4163-b497-92d378679668.png');
      });
    });

    describe('POST /', () => {
      it('creates a new Photo', async () => {
        /// request user list
        const response = await testSession
          .post('/api/photos')
          .set('Accept', 'application/json')
          .send({
            ProjectId: 'b7cf0682-8286-4144-9dd8-4b49849ee4e0',
            file: 'fd2e73ba-0142-4cdc-a804-3b399bfc3e02.png',
            fileName: '512x512.png',
          })
          .expect(StatusCodes.CREATED);

        assert.deepStrictEqual(response.body?.ProjectId, 'b7cf0682-8286-4144-9dd8-4b49849ee4e0');
        assert.deepStrictEqual(response.body?.file, 'fd2e73ba-0142-4cdc-a804-3b399bfc3e02.png');
        assert.deepStrictEqual(response.body?.fileName, '512x512.png');
        assert.deepStrictEqual(response.body?.isVisible, true);
        assert.deepStrictEqual(response.body?.isVisibleOnHome, true);

        const record = await models.Photo.findByPk(response.body?.id);
        assert.deepStrictEqual(record?.ProjectId, 'b7cf0682-8286-4144-9dd8-4b49849ee4e0');
        assert.deepStrictEqual(record?.file, 'fd2e73ba-0142-4cdc-a804-3b399bfc3e02.png');
        assert.deepStrictEqual(record?.fileName, '512x512.png');
        assert.deepStrictEqual(record?.isVisible, true);
        assert.deepStrictEqual(record?.isVisibleOnHome, true);
      });
    });

    describe('PATCH /reorder', () => {
      it('reorders the Photos in the request body', async () => {
        await testSession
          .patch('/api/photos/reorder')
          .send([
            { id: 'ed2f158a-e44e-432d-971e-e5da1a2e33b4', position: 1 },
            { id: '84b62056-05a4-4751-953f-7854ac46bc0f', position: 2 },
          ])
          .set('Accept', 'application/json')
          .expect(StatusCodes.NO_CONTENT);

        let record;
        record = await models.Photo.findByPk('ed2f158a-e44e-432d-971e-e5da1a2e33b4');
        assert.deepStrictEqual(record?.position, 1);
        record = await models.Photo.findByPk('84b62056-05a4-4751-953f-7854ac46bc0f');
        assert.deepStrictEqual(record?.position, 2);
      });
    });

    describe('GET /:id', () => {
      it('returns a Project by id', async () => {
        /// request user list
        const response = await testSession
          .get('/api/photos/ed2f158a-e44e-432d-971e-e5da1a2e33b4')
          .set('Accept', 'application/json')
          .expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.ProjectId, 'b7cf0682-8286-4144-9dd8-4b49849ee4e0');
        assert.deepStrictEqual(response.body?.file, 'b45136f4-54e4-45cd-8851-efc9d733a573.png');
        assert.deepStrictEqual(response.body?.fileName, null);
        assert.deepStrictEqual(response.body?.desc, null);
        assert.deepStrictEqual(response.body?.isVisible, false);
        assert.deepStrictEqual(response.body?.isVisibleOnHome, true);
      });
    });

    describe('PATCH /:id', () => {
      it('updates a Photo by id', async () => {
        /// request user list
        const response = await testSession
          .patch('/api/photos/ed2f158a-e44e-432d-971e-e5da1a2e33b4')
          .set('Accept', 'application/json')
          .send({
            desc: 'This is a description',
            isVisible: true,
            isVisibleOnHome: true,
          })
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body?.ProjectId, 'b7cf0682-8286-4144-9dd8-4b49849ee4e0');
        assert.deepStrictEqual(response.body?.file, 'b45136f4-54e4-45cd-8851-efc9d733a573.png');
        assert.deepStrictEqual(response.body?.fileName, null);
        assert.deepStrictEqual(response.body?.desc, 'This is a description');
        assert.deepStrictEqual(response.body?.isVisible, true);
        assert.deepStrictEqual(response.body?.isVisibleOnHome, true);

        const record = await models.Photo.findByPk('ed2f158a-e44e-432d-971e-e5da1a2e33b4');
        assert.deepStrictEqual(record?.ProjectId, 'b7cf0682-8286-4144-9dd8-4b49849ee4e0');
        assert.deepStrictEqual(record?.file, 'b45136f4-54e4-45cd-8851-efc9d733a573.png');
        assert.deepStrictEqual(record?.fileName, null);
        assert.deepStrictEqual(record?.desc, 'This is a description');
        assert.deepStrictEqual(record?.isVisible, true);
        assert.deepStrictEqual(record?.isVisibleOnHome, true);
      });
    });
  });
});
