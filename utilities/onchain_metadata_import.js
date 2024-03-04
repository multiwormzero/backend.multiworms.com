//import AWS from 'aws-sdk';
import { CompressionType, S3Client} from '@aws-sdk/client-s3'
import { ListObjectsCommand } from "@aws-sdk/client-s3";
//import request from 'request-promise';
import Web3 from 'web3';
import pLimit from 'p-limit';

const web3 = new Web3('https://rpc.mtv.ac');
//const s3 = new AWS.S3({apiVersion: '2006-03-01'});
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

const tokenContract = "0x4551c11b22fdd733a0328c62d6ef4e4c6496dada";
const mintSize = 3333;
const firstTokenNumber = 0;
const bucketName = 'com.multiworms.nftstore';
const namespace = 'metadata';
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

async function getexistingMetadata() {
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

const s3Objects = await getexistingMetadata();

console.log(s3Objects.length);


async function getNFTMetadata(contractId, contractABI, tokenId, s3Bucket, s3Namespace, s3Objects) {
    const contract = new web3.eth.Contract(contractABI, contractId);
    const responseURL = await contract.methods.tokenURI(tokenId).call();
    const base64URL = responseURL.replace(/data:application\/json\;base64,/,'');
    const buff = new Buffer.from(base64URL, 'base64');
    const metajson = JSON.parse(buff.toString('ascii'));

    try {
            const keyName = `${s3Namespace}/${contractId}/${tokenId}`;
            const objectParams = {Bucket: s3Bucket, Key: keyName, Body: JSON.stringify(metajson)};

            const matches = s3Objects.filter( s => s == keyName);

            if (!(matches.length > 0)) {
                //Stream metadata to S3
                        s3Client.putObject(objectParams, function (error, data) {
                            if (error) {
                                console.log('error downloading metadata to s3 bucket.');
                            } else {
                                console.log(`Token ${tokenId} successfuly uploaded`);
                            }
                        });
            } else {
                //console.log(keyName+' already exists');
            }
            return true;
    } catch(e) {
        console.log('Error: ' + e);
    }
}


async function getAllMetadata (tokenArray, s3Array) {
    const limit = pLimit(25);
    const input = [];

    for (let i = 0; i < tokenArray.length; i++) {
        let token = tokenArray[i];
        input[i] = new Promise((resolve, reject) => {
            limit(() => getNFTMetadata(token.contractId, token.contractABI, token.tokenId, token.s3Bucket, token.s3Namespace, s3Array));
        }); 
    }

    const result = await Promise.all(input);
    console.log(input.length);
}

getAllMetadata(requestArray, s3Objects);


