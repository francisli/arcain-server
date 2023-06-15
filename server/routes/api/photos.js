const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const options = {
    page,
    where: {
      isVisible: true,
    },
    order: [
      ['position', 'ASC'],
      ['fileName', 'ASC'],
    ],
  };
  if (req.user?.isAdmin && req.query?.showAll === 'true') {
    delete options.where.isVisible;
  }
  if (req.query?.ProjectId) {
    const { ProjectId } = req.query;
    let project;
    if (ProjectId.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)) {
      project = await models.Project.findByPk(ProjectId);
    } else {
      project = await models.Project.findOne({ where: { link: ProjectId } });
    }
    if (!project) {
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
    options.where.ProjectId = project.id;
    const { records, pages, total } = await models.Photo.paginate(options);
    helpers.setPaginationHeaders(req, res, page, pages, total);
    res.json(records.map((r) => r.toJSON()));
  } else {
    options.where.isVisibleOnHome = true;
    options.order = models.Sequelize.literal('RANDOM()');
    options.limit = 1;
    const records = await models.Photo.findAll(options);
    res.json(records.map((r) => r.toJSON()));
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Photo.create(_.pick(req.body, ['ProjectId', 'file', 'fileName', 'desc', 'isVisible', 'isVisibleOnHome']));
    res.status(StatusCodes.CREATED).json(record.toJSON());
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Photo.findByPk(req.params.id);
    if (record) {
      if (!record.isVisible && !req.user?.isAdmin) {
        res.status(StatusCodes.UNAUTHORIZED).end();
      } else {
        res.json(record.toJSON());
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    let record;
    await models.sequelize.transaction(async (transaction) => {
      record = await models.Photo.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['desc', 'isVisible', 'isVisibleOnHome']), { transaction });
      }
    });
    if (!record) {
      res.status(StatusCodes.NOT_FOUND).end();
    } else {
      res.json(record.toJSON());
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

module.exports = router;