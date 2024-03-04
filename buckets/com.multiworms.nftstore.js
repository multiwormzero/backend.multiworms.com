import { S3Client, CreateBucketCommand, PutPublicAccessBlockCommand, PutBucketAclCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"; // ES Modules import

// Set bucket name
const bucketName = 'com.multiworms.nftstore';

// Set the AWS Region.
const client = new S3Client({ region: "us-east-2"});

// Create a bucket.
const input = { // CreateBucketRequest
  Bucket: bucketName, // required
  ObjectOwnership: "BucketOwnerPreferred",
};
const command = new CreateBucketCommand(input);
const response = await client.send(command);
console.log(response);


// Set bucket to public access
const pa_input = {
  Bucket: bucketName,
  PublicAccessBlockConfiguration: {
    BlockPublicAcls: false,
    IgnorePublicAcls: false,
    BlockPublicPolicy: false,
    RestrictPublicBuckets: false,
  },
  
}
const pa_command = new PutPublicAccessBlockCommand(pa_input)
const pa_response = await client.send(pa_command)
console.log(pa_response);

//Set bucket ACL
const acl_input = {
  Bucket: bucketName,
  ACL: "public-read",
}
const acl_command = new PutBucketAclCommand(acl_input)
const acl_response = await client.send(acl_command)
console.log(acl_response);

// Set bucket policy
const policy_input = {
  Bucket: bucketName,
  Policy: `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${bucketName}/*"
        }
    ]
}`
}

const policy_command = new PutBucketPolicyCommand(policy_input)
const policy_response = await client.send(policy_command)
console.log(policy_response);