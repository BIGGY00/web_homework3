const uploadFile = require("../middleware/upload");
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file === undefined) {
      return res.status(400).send({
        message: "Please Upload a file!.",
      });
    }
    res.status(200).send({
      message: "Upload the file successfully: " + req.file.filename,
      uploadFileName: req.file.filename,
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not upload the file: " + err,
    });
  }
};

const download = (req, res) => {
  const filename = req.params.name;
  const directoryPath = __basedir + "assets/uploads/";
  res.download(directoryPath + filename, filename, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file." + err,
      });
    }
  });
}

module.exports = { upload, download };