const _ = require('lodash');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Photo);
    }

    toJSON() {
      const json = _.pick(this.get(), ['id', 'name', 'link', 'desc', 'isVisible', 'position']);
      return json;
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      link: DataTypes.CITEXT,
      desc: DataTypes.TEXT,
      isVisible: DataTypes.BOOLEAN,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Project',
    }
  );
  return Project;
};
