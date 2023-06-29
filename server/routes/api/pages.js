const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const models = require('../../models');
const interceptors = require('../interceptors');
const helpers = require('../helpers');

const router = express.Router();

router.get('/', interceptors.requireAdmin, async (req, res) => {
  const page = req.query.page || 1;
  const options = {
    page,
    order: [['title', 'ASC']],
  };
  const { records, pages, total } = await models.Page.paginate(options);
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Page.create(_.pick(req.body, ['link', 'isVisible', 'title', 'body']));
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
    const { id } = req.params;
    let record;
    if (id.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)) {
      record = await models.Page.findByPk(req.params.id);
    } else {
      record = await models.Page.findOne({ where: { link: id } });
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
      record = await models.Page.findByPk(req.params.id, { transaction });
      if (record) {
        await record.update(_.pick(req.body, ['link', 'isVisible', 'title', 'body']), { transaction });
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
