import fileUpload from "express-fileupload";

export default fileUpload({
  useTempFiles: true,
  tempFileDir: "./uploads",
});
