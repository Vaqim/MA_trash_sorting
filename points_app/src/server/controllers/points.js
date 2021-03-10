const calc = require('../../service/calculation')
const db = require('../../db/models/points')

async function calculatePoints(req, res) {
  try {
    let {body: trashItems} = req
    if(!Object.entries(trashItems).length) throw new Error('No items to calculate points!')

    let total = calc.calculatePoints(trashItems)

    res.json({points: total})
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
} 

async function addPoints(req, res) {
  try {
    const {clientId, pointsAmounts} = req.body
    if(!clientId || !pointsAmounts) throw new Error('Bad request')
    
    await db.addPoints(req.body)

    res.status(202).send()
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function spendPoints(req, res) {
  try {
    const {clientId, serviceId} = req.body
    if(!clientId || !serviceId) throw new Error('Bad request')
    
    await db.spendPoints(req.body)

    res.status(202).send()
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

module.exports = { calculatePoints, addPoints, spendPoints }