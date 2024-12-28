# R2-verify-access-key

### Create .env file
Copy the `.env.example` file to `.env` and fill in your credentials:
```sh
cp .env.example .env
```
Install dependencies
Run the following command to install the required dependencies:
```sh
npm install
```
Run the script
Execute the script using Node.js:

```sh
node index.js
```

Environment Variables
Make sure your .env file contains the following variables:
```env
ACCESS_KEY=<your_access_key>
SECRET_KEY=<your_secret_key>
BUCKET_NAME=<your_bucket_name>
ACCOUNT_ID=<your_account_id>
```
Example Output
If the credentials are valid, you should see the contents of the bucket and a message indicating that the bucket has been cleaned up successfully.

Credentials are valid. Bucket contents: [...]
Bucket cleaned up successfully.

If there are any errors, they will be displayed in the console.

Error validating credentials: ...
