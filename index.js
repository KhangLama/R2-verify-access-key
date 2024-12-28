const AWS = require("aws-sdk");
require('dotenv').config();

function getS3Client(accessKey, secretKey, accountId) {
  return new AWS.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    s3ForcePathStyle: true, // Necessary for R2
  });
}

async function validateR2Credentials(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    // Test by listing objects in the bucket
    const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    console.log("Credentials are valid. Bucket contents:", response.Contents);
    return { valid: true, message: "Credentials are valid." };
  } catch (error) {
    console.error("Error validating credentials:", error);
    if (error.code === "AccessDenied") {
      return { valid: false, message: "Access Denied. Invalid permissions or credentials." };
    } else if (error.code === "InvalidAccessKeyId") {
      return { valid: false, message: "Invalid Access Key." };
    } else if (error.code === "SignatureDoesNotMatch") {
      return { valid: false, message: "Invalid Secret Access Key." };
    } else {
      return { valid: false, message: `Unknown error: ${error.message}` };
    }
  }
}

async function listR2BucketContents(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    console.log("Bucket contents:", response.Contents);
  } catch (error) {
    console.error("Error listing bucket contents:", error);
  }
}

async function cleanUpR2Bucket(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    const listResponse = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));

    if (objectsToDelete.length > 0) {
      await s3.deleteObjects({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete }
      }).promise();
      console.log("Bucket cleaned up successfully.");
    } else {
      console.log("Bucket is already empty.");
    }
  } catch (error) {
    console.error("Error cleaning up bucket:", error);
  }
}

// Example usage
(async () => {
  const accessKey = process.env.ACCESS_KEY;
  const secretKey = process.env.SECRET_KEY;
  const bucketName = process.env.BUCKET_NAME;
  const accountId = process.env.ACCOUNT_ID;

  if (!accessKey || !secretKey || !bucketName || !accountId) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  const action = process.argv[2];

  switch (action) {
    case 'verify':
      try {
        const result = await validateR2Credentials(accessKey, secretKey, bucketName, accountId);
        console.log(result.message);
      } catch (error) {
        console.error("Error validating credentials:", error.message);
      }
      break;
    case 'list':
      await listR2BucketContents(accessKey, secretKey, bucketName, accountId);
      break;
    case 'clean':
      await cleanUpR2Bucket(accessKey, secretKey, bucketName, accountId);
      break;
    default:
      console.log("Invalid action. Use 'verify', 'list', or 'clean'.");
  }
})();