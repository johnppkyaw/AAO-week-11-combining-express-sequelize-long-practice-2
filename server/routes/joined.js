// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// Import models - DO NOT MODIFY
const { Insect, Tree } = require('../db/models');
const { Op } = require("sequelize");

/**
 * PHASE 7 - Step A: List of all trees with insects that are near them
 *
 * Approach: Eager Loading
 *
 * Path: /trees-insects
 * Protocol: GET
 * Response: JSON array of objects
 *   - Tree properties: id, tree, location, heightFt, insects (array)
 *   - Trees ordered by the tree heightFt from tallest to shortest
 *   - Insect properties: id, name
 *   - Insects for each tree ordered alphabetically by name
 */
router.get('/trees-insects', async (req, res, next) => {
    let trees = [];

    trees = await Tree.findAll({
        attributes: ['id', 'tree', 'location', 'heightFt'],
        include: {
            model: Insect,
            required: true,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            order: [['name', 'ASC']]
        }
    });

    trees = trees.map((tree) => {
        tree.Insects.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        return tree;
    });

    res.json(trees);
});

/**
 * PHASE 7 - Step B: List of all insects with the trees they are near
 *
 * Approach: Lazy Loading
 *
 * Path: /insects-trees
 * Protocol: GET
 * Response: JSON array of objects
 *   - Insect properties: id, name, trees (array)
 *   - Insects for each tree ordered alphabetically by name
 *   - Tree properties: id, tree
 *   - Trees ordered alphabetically by tree
 */
router.get('/insects-trees', async (req, res, next) => {
    // old attempt
    // let payload = [];

    // const insects = await Insect.findAll({
    //     attributes: ['id', 'name', 'description'],
    //     order: [ ['name'] ],
    // });
    // for (let i = 0; i < insects.length; i++) {
    //     const insect = insects[i];
    //     const trees = await insect.getTrees({
    //         attributes:["id", "tree"],
    //         joinTableAttributes: []
    //     });
    //     if(trees.length > 0) {
    //         trees.sort((a, b) => a.tree.localeCompare(b.tree));
    //         payload.push({
    //             id: insect.id,
    //             name: insect.name,
    //             description: insect.description,
    //             trees: trees
    //         });
    //     }
    // }
    // res.json(payload);
    const insects = await Insect.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['name']],
        include: [
          {
            model: Tree,
            attributes: ['id', 'tree'],
            through: { attributes: [] },
            // Add a subquery to order the associated trees alphabetically
            order: [[{ model: Tree }, 'tree', 'ASC']]
          }
        ],
        // Add a condition to include only insects with tree associations
        where: {
          '$Trees.id$': {
            [Op.not]: null,
          },
        }
      });

      // Sort the trees for each insect alphabetically
    insects.forEach((insect) => {
        insect.Trees.sort((a, b) => a.tree.localeCompare(b.tree));
      });

      // Send the array of insects directly in the response
      res.json(insects);
});

/**
 * ADVANCED PHASE 3 - Record information on an insect found near a tree
 *
 * Path: /associate-tree-insect
 * Protocol: POST
 * Parameters: None
 * Request Body: JSON Object
 *   - Property: tree Object
 *     with id, name, location, height, size
 *   - Property: insect Object
 *     with id, name, description, fact, territory, millimeters
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully recorded information
 *   - Property: data
 *     - Value: object (the new tree)
 * Expected Behaviors:
 *   - If tree.id is provided, then look for it, otherwise create a new tree
 *   - If insect.id is provided, then look for it, otherwise create a new insect
 *   - Relate the tree to the insect
 * Error Handling: Friendly messages for known errors
 *   - Association already exists between {tree.tree} and {insect.name}
 *   - Could not create association (use details for specific reason)
 *   - (Any others you think of)
 */
// Your code here

// Export class - DO NOT MODIFY
module.exports = router;
