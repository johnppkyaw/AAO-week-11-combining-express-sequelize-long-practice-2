// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// Import models
const { Insect, Tree } = require('../db/models');

// Import Op
const { Op } = require("sequelize");

/**
 * INTERMEDIATE BONUS PHASE 2 (OPTIONAL) - Code routes for the insects
 *   by mirroring the functionality of the trees
 */

//get insect by id
router.get('/:id', async (req, res, next) => {

  try{
    const id = Number(req.params.id);
    const targetInsect = await Insect.findOne({
      where: {
        id: id
      }});
    if (!targetInsect) {
      return res.status(404).json({
        message:`Invalid Search`,
        details:`Insect does not exist with id ${id}.`
      })
    }
    res.json(targetInsect);

  } catch(err) {
    next(err);
  }
})

//delete an insect
router.delete('/:id', async(req, res, next) => {
  try {
    const id = req.params.id;
    const targetInsect = await Insect.findOne({
      where: {
        id: id
      }
    });
    if(!targetInsect) {
      return res.status(404).json({
        message:`Invalid id`,
        details: `Insect not found with id ${id}`
      });
    }
    await targetInsect.destroy();
    res.json({
      "message": `Successfuly deleted insect with id ${id}`
    })

  } catch (err) {
    next(err);
  }
})

//update an insect
const updateInsect = async(req, res, next) => {
  try {
    const id = req.params.id;
    const newInfo = {};
    const targetInsect = await Insect.findOne({
      where: {id}
    });
    if(!targetInsect) {
      return res.status(404).json({
        message:`Invalid id`,
        details: `Insect not found with id ${id}`
      });
    };
    targetInsect.set(req.body);
    try{
      await targetInsect.validate();
    } catch(validationError) {
      const errorMessages = validationError.errors.map(error => error.message);
      return res.status(422).json({
        message: "Invalid request data",
        details: "Validation failed",
        errors: errorMessages
      });
    }
    await targetInsect.save();
    res.json(targetInsect);
  } catch(err) {
    next(err);
  }
}
router.put('/:id', updateInsect);
router.patch('/:id', updateInsect);

//create an insect
router.post('/', async(req, res, next) => {
  try {
    const {name, description, fact, territory, millimeters} = req.body;

    //Check if all the required fields are missing
    if (!name || !description || !fact || !territory || !millimeters) {
      return res.status(422).json({
        message: "Invalid request data",
        details: "Missing field(s) or Invalid input data type."
      })
    }
    const newInsect = await Insect.create({
      name,
      description,
      fact,
      territory,
      millimeters
    });

    res.status(201).json(newInsect);
  } catch(err) {
    next(err);
  }
});

//search for an insect by name
router.get('/search/:name', async (req, res, next) => {
  const keyword = req.params.name;
  const targetinsects = await Insect.findAll({
    where: {
      name: {
        [Op.like]: `%${keyword}%`
      }
    }
  })
  if (targetinsects.length === 0) {
    return res.status(404).json({
      "message": "Invalid search",
      "details": `No insects found with the keywords ${keyword}`
    })
  }
  res.json(targetinsects)
})

//get all insects
router.get('/', async (req, res, next) => {
  const insects = await Insect.findAll({
    attributes: ['id', 'name', 'millimeters'],
    order: [['millimeters', 'ASC']]
  })
  res.json(insects);
})

// Export class - DO NOT MODIFY
module.exports = router;
