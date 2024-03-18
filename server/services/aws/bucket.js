import multer from "multer";
import S3 from "aws-sdk/clients/s3.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
// console.log(process.env);
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    console.log('Test file: ', file)
    cb(null, "");
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerUpload = multer({ storage: storage, fileFilter: filefilter }).fields([
  { name: 'images', maxCount: 5 },
  { name: 'variantImages', maxCount: 10 } // Adjust the maxCount as needed
]);

const s3 = new S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
});

export { multerUpload };

export function uploadImage(storeId, image, onUploadComplete, isVariantImage = false) {
  console.log("Starting upload...", image.originalname);
  
  // Determine the directory based on whether the image is a variant image
  const directory = isVariantImage ? 'variantImages' : 'images';
  const filePath = `${storeId}/${directory}/${image.originalname}`;
  const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: filePath, // Use the directory variable here
      Body: image.buffer,
      ContentType: "image/jpeg",
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      return onUploadComplete(err, null);
    }
    console.log("Upload success:", data.Location);
    onUploadComplete(null, data);
  });
}


export function deleteImage(imageUrl) {
  // Extract the key from the URL
  const urlParts = imageUrl.split('.com/');
  const key = urlParts[1];
  console.log('key', key);

  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
    Key: key,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully", data);
    }
  });
}



