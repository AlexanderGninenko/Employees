var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const { addEmployee, getAllEmployees } = require("../controllers/employees");

router.get("/", auth, getAllEmployees);
router.get("/:id", auth);
router.post("/add", auth, addEmployee);
router.post("/remove/:id", auth);
router.put("/edit/:id", auth);

module.exports = router;
