const { Router } = require("express");

const auth = require("./authRoute");

const router = Router();
router.use("/auth", auth);

module.exports = router;
