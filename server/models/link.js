const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'name', 'date', 'desc', 'url', 'isVisible']);
      return json;
    }
  }
  Link.init(
    {
      name: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      desc: DataTypes.TEXT,
      url: DataTypes.TEXT,
      isVisible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Link',
    }
  );
  return Link;
};
