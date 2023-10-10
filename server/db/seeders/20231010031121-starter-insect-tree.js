'use strict';

const { Tree, Insect, InsectTree} = require('../models');

const insectTree = [
  {
    insect: { name: "Western Pygmy Blue Butterfly" },
    trees: [
      { tree: "General Sherman" },
      { tree: "General Grant" },
      { tree: "Lincoln" },
      { tree: "Stagg" }
    ]
  },
  {
    insect: { name: "Patu Digua Spider" },
    trees: [
      { tree: "Stagg" }
    ]
  }
];

module.exports = {
  up: async function(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   for (let i = 0; i < insectTree.length; i++) {
    const {insect, trees} = insectTree[i];
    const targetInsect = await Insect.findOne({
      where: insect
    });
    for (const treeData of trees) {
      const targetTree = await Tree.findOne({
        where: treeData
      });

      await InsectTree.create({
        insectId: targetInsect.id,
        treeId: targetTree.id
      })
    }
   }
  },

  down: async function(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (let i = 0; i < insectTree.length; i++) {
      const {insect, trees} = insectTree[i];
      const targetInsect = await Insect.findOne({
        where: insect
      });
      const targetTrees = await Tree.findAll({
        where: trees
      });

      for (const treeData of trees) {
        // Find the tree by name
        const targetTree = await Tree.findOne({
          where: treeData,
        });

        // Delete the InsectTree association
        await InsectTree.destroy({
          where: {
            insectId: targetInsect.id,
            treeId: targetTree.id,
          },
        });
      }
     }
  }
};
