## Description
This project provides a set of scripts to interact with Cloudflare R2 storage. It allows you to verify your R2 credentials, list the contents of an R2 bucket, and clean up (delete all objects from) an R2 bucket. The scripts use the AWS SDK to interact with the R2 storage.

### Create .env file
Copy the `.env.example` file to `.env` and fill in your credentials:
```sh
cp .env.example .env
```

### Install dependencies
Run the following command to install the required dependencies:
```sh
npm install
```

### Run the script
Execute the script using Node.js with one of the following actions:
- `verify`: Validate the R2 credentials.
- `list`: List the contents of the R2 bucket.
- `clean`: Clean up the R2 bucket.

```sh
node index.js <action>
```

For example, to verify the credentials:
```sh
node index.js verify
```

To list the contents of the bucket:
```sh
node index.js list
```

To clean up the bucket:
```sh
node index.js clean
```

### Environment Variables

Make sure your 

.env

 file contains the following variables:
```
ACCESS_KEY=<your_access_key>
SECRET_KEY=<your_secret_key>
BUCKET_NAME=<your_bucket_name>
ACCOUNT_ID=<your_account_id>
```

### Example Output
If the credentials are valid, you should see the contents of the bucket and a message indicating that the bucket has been cleaned up successfully.
```
Credentials are valid. Bucket contents: [...]
Bucket cleaned up successfully.
```
If there are any errors, they will be displayed in the console.
```
Error validating credentials: ...
```
