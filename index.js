const { S3Client, HeadBucketCommand, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

function getS3Client(accessKey, secretKey, accountId) {
  return new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true, // Necessary for R2
  });
}

async function validateR2Credentials(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    // Test by checking if the bucket exists
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    return { valid: true, message: "Credentials are valid." };
  } catch (error) {
    console.error("Error validating credentials:", error);
    if (error.name === "AccessDenied") {
      return { valid: false, message: "Access Denied. Invalid permissions or credentials." };
    } else if (error.name === "InvalidAccessKeyId") {
      return { valid: false, message: "Invalid Access Key." };
    } else if (error.name === "SignatureDoesNotMatch") {
      return { valid: false, message: "Invalid Secret Access Key." };
    } else if (error.name === "NotFound") {
      return { valid: false, message: "Bucket not found." };
    } else {
      return { valid: false, message: `Unknown error: ${error.message}` };
    }
  }
}

async function listR2BucketContents(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    const response = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
    console.log("Bucket contents:", response.Contents);
  } catch (error) {
    console.error("Error listing bucket contents:", error);
  }
}

async function cleanUpR2Bucket(accessKey, secretKey, bucketName, accountId) {
  const s3 = getS3Client(accessKey, secretKey, accountId);

  try {
    const listResponse = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));

    if (objectsToDelete.length > 0) {
      await s3.send(new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete }
      }));
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