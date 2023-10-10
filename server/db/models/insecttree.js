'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsectTree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InsectTree.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    insectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Insects',
        key: 'id'
      }
    },
    treeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Trees',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'InsectTree',
  });
  return InsectTree;
};
