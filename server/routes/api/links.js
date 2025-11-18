const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

router.get('/', async (req, res) => {
  const { page = '1', showAll = 'false' } = req.query;
  const options = {
    page,
    where: {
      isVisible: true,
    },
    order: [['date', 'DESC']],
  };
  if (req.user?.isAdmin && showAll === 'true') {
    delete options.where.isVisible;
  }
  const { records, pages, total } = await models.Link.paginate(options);
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', interceptors.requireAdmin, async (req, res) => {
  const record = await models.Link.findByPk(req.params.id);
  if (record) {
    res.json(record.toJSON());
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const link = await models.Link.create(_.pick(req.body, ['name', 'date', 'desc', 'url', 'isVisible']));
    res.status(StatusCodes.CREATED).json(link.toJSON());
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors || [],
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.put('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const link = await models.Link.findByPk(req.params.id);
    if (!link) {
      res.status(StatusCodes.NOT_FOUND).end();
    } else {
      await link.update(_.pick(req.body, ['name', 'date', 'desc', 'url', 'isVisible']));
      res.status(StatusCodes.OK).json(link.toJSON());
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: StatusCodes.UNPROCESSABLE_ENTITY,
        errors: error.errors || [],
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const link = await models.Link.findByPk(req.params.id);
    if (!link) {
      res.status(StatusCodes.NOT_FOUND).end();
    } else {
      await link.destroy();
      res.status(StatusCodes.NO_CONTENT).end();
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
