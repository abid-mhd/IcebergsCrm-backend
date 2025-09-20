const router = require("express").Router();
const {
  getParties,
  createParty,
  updateParty,
  deleteParty,
} = require("../controllers/partiesController");

router.get("/", getParties);      // GET all parties
router.post("/", createParty);    // POST create new
router.put("/:id", updateParty);  // PUT update by id
router.delete("/:id", deleteParty); // DELETE by id

module.exports = router;
