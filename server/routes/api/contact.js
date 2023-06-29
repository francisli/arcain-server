const express = require('express');
const { StatusCodes } = require('http-status-codes');
const _ = require('lodash');

const mailer = require('../../emails/mailer');
const models = require('../../models');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const fields = ['firstName', 'lastName', 'email', 'desc', 'address', 'budget', 'timeframe'];
    const locals = _.pick(req.body, fields);
    fields.forEach((field) => {
      if (!locals[field] || locals[field].trim() === '') {
        throw new Error();
      }
    });
    await mailer.send({
      template: 'contact',
      message: {
        to: process.env.CONTACT_EMAIL,
        replyTo: locals.email,
      },
      locals,
    });
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    console.log(error);
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
