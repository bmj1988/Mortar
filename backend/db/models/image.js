'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        as: 'ReviewImages',
        onDelete: 'CASCADE',
        constraints: false
      });
      Image.belongsTo(models.Spot, {
        foreignKey: 'imageableId',
        as: 'SpotImages',
        onDelete: 'CASCADE',
        constraints: false
      });
      Image.addHook('afterFind', async (results, options) => {
        if (!Array.isArray(results)) {
          results = [results]
        }

        if (Array.isArray(results)) {
          for (let result of results) {
          if (result.imageableType === 'Review') {
            result.imageable = await models.Review.findByPk(result.imageableId)
          }
          else if (result.imageableType === 'Spot') {
            result.imageable = await models.Spot.findByPk(result.imageableId)
          }
          else {
            result.imageable = null
          }
          }
        }
        })
    }
  }
  Image.init({
    imageableId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageableType: {
      type: DataTypes.ENUM('Review', 'Spot'),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true,
        endsWithFile(value) {
          if (!value.endsWith('.png'), !value.endsWith('.jpg'), !value.endsWith('.jpeg'))
          throw new Error("Image URL must end in .png, .jpg, or .jpeg")
        }
      }},
    preview: {
      type: DataTypes.BOOLEAN,
      validate: {
         notNullIfSpot(value) {
          if (this.imageableType === 'Spot' && typeof value !== 'boolean') {
            throw new Error('Preview value cannot be null if image is for a Spot!')
          }
         }
      }}
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
