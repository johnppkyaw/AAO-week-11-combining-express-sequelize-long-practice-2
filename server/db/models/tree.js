'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tree.belongsToMany(
        models.Insect,
        {through: models.InsectTree, onDelete: 'CASCADE', hooks: true}
      )
    }
  };
  Tree.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tree: DataTypes.STRING,
    location: DataTypes.STRING,
    heightFt: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
      }
    },
    groundCircumferenceFt: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
      }
    }
  }, {
    sequelize,
    modelName: 'Tree',
  });
  return Tree;
};
