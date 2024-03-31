/*--------------------------------- Description ------------------------------------
    This script is used to download images from IPFS and upload them to an S3 bucket.
    It is a part of the process of setting up the Multiworms project.

    This script will likely need to be run multiple times to ensure all images are downloaded.
    IPFS is a decentralized network and the images may not be available at the time of the request.

    Warning: This script will incure costs on the AWS account. 
------------------------------------------------------------------------------------*/
import { S3Client, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import request from 'request-promise';
import Web3 from 'web3';
import pLimit from 'p-limit';


const web3 = new Web3('https://rpc.mtv.ac');
const s3Client = new S3Client({ region: 'us-east-2' });

const tokenURIABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const tokenContract = "0xd162D3fB9F9F6F59592C62676E1771b96dF5A01e";
const mintSize = 5000;
const firstTokenNumber = 1;
const bucketName = 'com.multiworms.nftstore';
const namespace = 'images';
const requestArray = [];

for (let i = firstTokenNumber; i < mintSize+firstTokenNumber; i++){
    requestArray.push({
        contractId: tokenContract,
        contractABI: tokenURIABI,
        tokenId: i,
        s3Bucket: bucketName,
        s3Namespace: namespace
    });
}

async function getexistingImages() {
    // Declare truncated as a flag that the while loop is based on.
    let truncated = true;
    // Declare a variable to which the key of the last element is assigned to in the response.
    let pageMarker;
    // while loop that runs until 'response.truncated' is false.
    let counter = 0;
    const keyArray = [];
    const bucketParams = { Bucket: bucketName, Prefix: namespace+'/'+tokenContract+'/' };

    while (truncated) {
      try {
        const response = await s3Client.send(new ListObjectsCommand(bucketParams));
        // return response; //For unit tests
        if (Array.isArray(response.Contents) && response.Contents.length > 0) {
            response.Contents.forEach((item) => {
            keyArray[counter] = item.Key;
            counter++;
            });
        }
        // Log the key of every item in the response to standard output.
        truncated = response.IsTruncated;
        // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
        if (truncated) {
          pageMarker = response.Contents.slice(-1)[0].Key;
          // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
          bucketParams.Marker = pageMarker;
        }
        // At end of the list, response.truncated is false, and the function exits the while loop.
      } catch (err) {
        console.log("Error", err);
        truncated = false;
      }
    }
    return keyArray;
  }

const s3Objects = await getexistingImages();

console.log(s3Objects.length);

async function getNFTImage(contractId, contractABI, tokenId, s3Bucket, s3Namespace, s3Objects) {
    const contract = new web3.eth.Contract(contractABI, contractId);
    let url = null;
    try {
        url = await contract.methods.tokenURI(tokenId).call();
    } catch (e) {
        console.log('Error pulling token '+tokenId+' from blockchain'+': '+e);
        return 1;
    }
    const baseLocation = url.replace(/[a-zA-Z:]+\/\//,'').replace(/[a-z0-9]+\.mypinata\.cloud\/ipfs\//,'');
    const regex = /ipfs/g;
    let metaURL = '';
    if (url.match(regex)) {
        if (url.match(/ipfs.io/) === null) {
            metaURL = 'https://ipfs.io/ipfs/'+baseLocation;
        } else {
            metaURL = 'https://'+baseLocation;
        }
    } else {
        metaURL = url;
    }


    try {
        const response = await fetch(metaURL);
        if(response.ok) {
            const jsonResponse = await response.json();
            const regex = /ipfs/g;
            let imageURL = '';
            if (url.match(regex)) {
                imageURL = 'https://ipfs.io/ipfs/'+jsonResponse.image.replace(/[a-zA-Z:]+\/\//,'').replace(/[a-z0-9]+\.mypinata\.cloud\/ipfs\//,'');
            } else {
                imageURL = jsonResponse.image;
            }

            //console.log(imageURL);

            const filename = jsonResponse.image.replace(/[a-zA-Z:]+\/\//,'').replace(/[a-z0-9]+\.mypinata\.cloud\/ipfs\//,'');

            const keyName = `${s3Namespace}/${contractId}/${filename}`;

            const matches = s3Objects.filter( s => s === keyName);

            const objectParams = {Bucket: s3Bucket, Key: keyName};

            if (!(matches.length > 0)) {
                //Stream metadata to S3
                const options = { uri: imageURL, encoding: null };
                await request(options, function(error, response, body){
                    if (error || response.statusCode !== 200 ) {
                        console.log('failed to get image '+filename);
                        //console.log(error);
                    } else {
                        objectParams.Body = body;
                        const command = new PutObjectCommand(objectParams);

                        try {
                            const data = s3Client.send(command);
                            console.log(`Token ${tokenId} successfuly uploaded`);
                        } catch (e) {
                            console.log('error downloading metadata to s3 bucket.'+e);
                        }
                    }
                });
            } else {
                //console.log(keyName+' already exists');
            }
        } else {
            console.log(tokenId+' fetch failed. '+metaURL);
        }
    } catch(e) {
        console.log('feth failed: ' + e);
    } 
}

async function getAllImages (tokenArray, s3Array) {
    const limit = pLimit(50);
    const input = [];

    for (let i = 0; i < tokenArray.length; i++) {
        let token = tokenArray[i];
        input[i] = new Promise((resolve, reject) => {
            limit(() => getNFTImage(token.contractId, token.contractABI, token.tokenId, token.s3Bucket, token.s3Namespace, s3Array));
        }); 
    }

    const result = await Promise.all(input);
}

getAllImages(requestArray, s3Objects);