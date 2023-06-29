const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'link', 'title', 'body', 'isVisible']);
      return json;
    }
  }
  Page.init(
    {
      link: DataTypes.CITEXT,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      isVisible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Page',
    }
  );
  return Page;
};
