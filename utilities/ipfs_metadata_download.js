/*--------------------------------- Description ------------------------------------
    This script is used to download metadata from IPFS and upload them to an S3 bucket.
    It is a part of the process of setting up the Multiworms project. 

    This script will likely need to be run multiple times to ensure all metadata is downloaded.
    IPFS is a decentralized network and the metadata may not be available at the time of the request.

    Warning: This script will incure costs on the AWS account. 
------------------------------------------------------------------------------------*/
import { S3Client, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import request from 'request-promise';
import Web3 from 'web3';
import pLimit from 'p-limit';
import { erc721ABI } from './defaultABI.js';

const web3 = new Web3('https://rpc.mtv.ac');
const s3Client = new S3Client({ region: 'us-east-2' });

const tokenURIABI = erc721ABI;

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
        metaURL = 'https://ipfs.io/ipfs/'+baseLocation;
    } else {
        metaURL = url;
    }

    try {
        const keyName = `${s3Namespace}/${contractId}/${baseLocation}`;
        const matches = s3Objects.filter( s => s === keyName);
        if (matches.length > 0) {
            //console.log(keyName+' already exists');
            return 1;
        }
        
        const response = await fetch(metaURL);
        if(response.ok) {
            const jsonResponse = await response.json();
            const objectParams = {Bucket: s3Bucket, Key: keyName, Body: JSON.stringify(jsonResponse)};

            //Stream metadata to S3
            const options = { uri: metaURL, encoding: null };
            await request(options, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    console.log('failed to get meatadata. ' + error);
                    console.log(error);
                } else {
                    const command = new PutObjectCommand(objectParams);

                    try {
                        const data = s3Client.send(command);
                        console.log(`Token ${tokenId} successfuly uploaded`);
                    } catch (e) {
                        console.log('error downloading metadata to s3 bucket.'+e);
                    }
                }
            });

            return true;
        } else {
            console.log(tokenId+' fetch failed. '+response.url)
            return false;
        }
    } catch(e) {
        console.log(tokenId+' location feth failed: ' + e);
    }
}


async function getAllMetadata (tokenArray, s3Array) {
    const limit = pLimit(100);
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


