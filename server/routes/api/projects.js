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
      ['name', 'ASC'],
    ],
  };
  if (req.user?.isAdmin && req.query?.showAll === 'true') {
    delete options.where.isVisible;
  }
  const { records, pages, total } = await models.Project.paginate(options);
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Project.create(_.pick(req.body, ['name', 'link', 'desc', 'isVisible']));
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

router.patch('/reorder', interceptors.requireAdmin, async (req, res) => {
  try {
    await models.sequelize.transaction((transaction) =>
      Promise.all(
        req.body.map((obj) =>
          models.Project.findByPk(obj.id, { transaction }).then((p) => p.update({ position: obj.position }, { transaction }))
        )
      )
    );
    res.status(StatusCodes.NO_CONTENT).end();
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
    const { id } = req.params;
    let record;
    if (id.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)) {
      record = await models.Project.findByPk(req.params.id);
    } else {
      record = await models.Project.findOne({ where: { link: id } });
    }
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
      record = await models.Project.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['name', 'link', 'desc', 'isVisible']), { transaction });
        if (!record.thumbURL) {
          const photo = await models.Photo.findOne({
            where: { ProjectId: record.id, isVisible: true },
            order: [
              ['position', 'ASC'],
              ['fileName', 'ASC'],
            ],
            transaction,
          });
          if (photo) {
            await record.update({ thumbURL: photo.thumbURL }, { transaction });
          }
        }
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
