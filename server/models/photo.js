const fs = require('fs/promises');
const _ = require('lodash');
const { Model } = require('sequelize');
const sharp = require('sharp');

const s3 = require('../lib/s3');

module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      Photo.belongsTo(models.Project);
    }

    static async resize(srcPath, destPath, width, height) {
      const destDirPath = destPath.substring(0, destPath.lastIndexOf('/'));
      await fs.mkdir(destDirPath, { recursive: true });
      await sharp(srcPath).resize(width, height, { fit: 'cover' }).jpeg({ mozjpeg: true }).toFile(destPath);
    }

    static async generateThumbnails(id, prevPath, newPath) {
      if (prevPath) {
        // remove old thumbnails
        await s3.deleteObject(prevPath.replace('/file/', '/thumb/'));
      }
      if (newPath) {
        // create thumbnails
        const filePath = await s3.getObject(newPath);
        await Photo.resize(filePath, filePath.replace('/file/', '/thumb/'), 1080, 608);
        await s3.putObject(newPath.replace('/file/', '/thumb/'), filePath.replace('/file/', '/thumb/'));
      }
    }

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'ProjectId',
        'position',
        'file',
        'fileName',
        'fileURL',
        'thumbURL',
        'desc',
        'isVisible',
        'isVisibleOnHome',
      ]);
      return json;
    }
  }

  Photo.init(
    {
      position: DataTypes.INTEGER,
      file: DataTypes.STRING,
      fileURL: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['file']),
        get() {
          return this.assetUrl('file');
        },
      },
      thumbURL: {
        type: DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          return this.fileURL?.replace('/file/', '/thumb/');
        },
      },
      fileName: DataTypes.STRING,
      desc: DataTypes.STRING,
      isVisible: DataTypes.BOOLEAN,
      isVisibleOnHome: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Photo',
    }
  );

  Photo.afterSave(async (record, options) => {
    record.handleAssetFile('file', options, Photo.generateThumbnails);
  });

  Photo.afterDestroy(async (record, options) => {
    record.file = null;
    record.handleAssetFile('file', options);
  });

  return Photo;
};
