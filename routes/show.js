const router = require("express").Router();
const File = require("../models/file");
router.get("/:uuid", async (req, res) => {
  try {
    let downloadLink;
    if (process.env.APP_BASE_URL.endsWith("/")) {
      downloadLink = `${process.env.APP_BASE_URL}files/download/${file.uuid}`;
    } else {
      downloadLink = `${process.env.APP_BASE_URL}/files/download/${file.uuid}`;
    }
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has been expired" });
    }

    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink,
    });
  } catch (err) {
    return res.render("download", { error: "Something went wrong" });
  }
});

module.exports = router;
