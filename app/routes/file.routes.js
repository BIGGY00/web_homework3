module.exports = app => {
  const file_controller = require("../controllers/file.controller.js");
  var router = require("express").Router();
  router.post("/upload", file_controller.upload);
  router.get("/:name", file_controller.download);
  app.use("/api/file",router);
}
