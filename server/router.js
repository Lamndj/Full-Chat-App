var express = require('express');
var router = express.Router();

router.get("/", (req,res,next) => {
    res.send("server is running")
})

module.exports = router;