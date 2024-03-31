import Web3 from 'web3';
import { createHash } from 'crypto';
import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
import { S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import pLimit from 'p-limit';
import { erc721ABI } from '../utilities/defaultABI.js';

const s3Client = new S3Client({ region: 'us-east-2' });
const web3 = new Web3('https://rpc.mtv.ac');
const contractId = "0xd162D3fB9F9F6F59592C62676E1771b96dF5A01e";
const contractABI = erc721ABI;
const bucketName = 'com.multiworms.nftstore';

const ddb = new DynamoDBClient({ region: "us-east-2"});

async function getTokenData (contractId, contractABI, tokenId, web3) {
    let contract = null;
    let owner = null;
    let imageS3URL;
    let imageThumbS3URL;
    let uri
    let ipfsURL;

    try {
        // Get info from blockchain
        contract = new web3.eth.Contract(contractABI,contractId);
        owner = await contract.methods.ownerOf(tokenId).call();
        uri = await contract.methods.tokenURI(tokenId).call();
        
        // Get info from S3
        const url = new URL(uri);
        const s3Key = 'metadata/'+contractId+'/'+url.host+url.pathname;
        const params = { Bucket: bucketName, Key: s3Key };

        const data = await s3Client.send(new GetObjectCommand(params));
        const nftjson = await data.Body.transformToString();

        // Create URLs
        const imageURL = new URL(JSON.parse(nftjson).image);
        ipfsURL = 'https://ipfs.io/ipfs/'+imageURL.host+imageURL.pathname;
        imageS3URL = 'https://s3.us-east-2.amazonaws.com/'+bucketName+'/images/'+contractId+'/'+imageURL.host+imageURL.pathname;
        imageThumbS3URL = 'https://s3.us-east-2.amazonaws.com/'+bucketName+'/images/'+contractId+'/'+imageURL.host+'/thumbnails'+imageURL.pathname;

    } catch (e) { 
        console.log('Error: '+e); 
    };

    const result = await JSON.parse(`{ "contractId":"${contractId}", "tokenId":"${tokenId}", "owner":"${owner}", "uri":"${uri}", "imageURL":"${ipfsURL}", "imageS3URL":"${imageS3URL}", "imageThumbS3URL":"${imageThumbS3URL}" }`);

    return result;
  }
  
async function putNFT (contractId, contractABI, tokenId, web3, dynamodb) {
    const nftData = await getTokenData(contractId,contractABI, tokenId, web3);
    const pk = createHash('md5').update(nftData.contractId+nftData.tokenId).digest('hex');

    var params = {
        Item: {
            "partitionKey": {
                S: `${pk}`
            },
            "contractId": {
                S: `${nftData.contractId}`
            }, 
            "tokenId": {
                N: `${nftData.tokenId}`
            }, 
            "owner": {
                S: `${nftData.owner}`
            },
            "uri": {
                S: `${nftData.uri}`
            },
            "imageURL": {
                S: `${nftData.imageURL}`
            },
            "imageS3URL": {
                S: `${nftData.imageS3URL}`
            },
            "imageThumbS3URL": {
                S: `${nftData.imageThumbS3URL}`
            }
        }, 
        
        TableName: "nfts"
        };

        const putItemCommand = new PutItemCommand(params);

        dynamodb.send(putItemCommand, function(err, data) {
            if (err) console.log(`${tokenId} Error: `+err, err.stack); // an error occurred
            else if (tokenId % 1 == 0) {
            console.log(`${tokenId}: Successful Put`)
        };           // successful response

    });
}

//putNFT(contractId,contractABI,1,web3, ddb);

async function getNFTs (supply, indexId, contractId, contractABI, web3, ddb) {
    const limit = pLimit(50);
    const input = [];

    for (let i = 0; i < Number(supply); i++) {
        input[i] = new Promise((resolve, reject) => {
            limit(() => putNFT(contractId, contractABI, i+Number(indexId), web3, ddb));
        }); 
    }

    await Promise.all(input).catch((e) => console.log('Error: '+e));
}

async function getProject(contractId) {
    let project = {};
    let result;

    const params = {
        "TableName": "projects",
        "ConsistentRead": true,
        "ExpressionAttributeValues": {
            ":ca" : { "S": contractId }
        },
        "ExpressionAttributeNames": {
            "#ca": "contract_address"
        },
        "FilterExpression": "#ca = :ca"
    };

    const command = new ScanCommand(params);
    const data = await ddb.send(command);

    project = {};
    project.contractId = data.Items[0].contract_address.S;
    project.supply = data.Items[0].number_of_items.N;
    project.index_number = data.Items[0].index_number.N;


    return project;
}

async function getNFTsFromProjects (contractId, ddb) {
    const input = [];
    let response;

    const project = await getProject(contractId);
    response = await getNFTs(project.supply, project.index_number, project.contractId, contractABI, web3, ddb)

}



getNFTsFromProjects(contractId, ddb);
