import Web3 from 'web3';
import { createHash } from 'crypto';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
import pLimit from 'p-limit';


const web3 = new Web3('https://rpc.mtv.ac');
const contractId = "0x4551C11B22FDd733A0328c62d6eF4e4C6496DadA";
import { erc721ABI } from '../utilities/defaultABI.js';
const contractABI = erc721ABI;

const ddb = new DynamoDBClient({ region: "us-east-2"});

async function getTokenData (contractId, contractABI, tokenId, web3) {
    let contract = null;
    let owner = null;
    let metauri = null;
    let imageURL = null;
    let imageS3URL;
    let imageThumbS3URL;
    let file;
    let ipfsFolder;

    try {
        contract = new web3.eth.Contract(contractABI,contractId);
        owner = await contract.methods.ownerOf(tokenId).call();
        const uri = await contract.methods.tokenURI(tokenId).call();
    
        const baseLocation = await uri.replace(/[a-zA-Z:]+\/\//,'').replace(/[a-z0-9]+\.mypinata\.cloud\/ipfs\//,'');
        const regex = /ipfs/g;
        metauri = '';
        if (uri.match(regex)) {
            metauri = 'https://ipfs.io/ipfs/'+baseLocation;
        } else {
            metauri = uri;
        }

        // Get image URL from metadata
        const response = await fetch(metauri);
        if(response.ok) {
            const jsonResponse = await response.json();
            
            if (metauri.match(regex)) {
                imageURL = 'https://ipfs.io/ipfs/'+jsonResponse.image.replace(/[a-zA-Z:]+\/\//,'').replace(/[a-z0-9]+\.mypinata\.cloud\/ipfs\//,'');
                file = imageURL.replace(/https:\/\/ipfs.io\/ipfs\//,'').replace(/[a-zA-Z0-9]+\//,'')
                ipfsFolder = imageURL.replace(/https:\/\/ipfs.io\/ipfs\//,'').replace(/\/.*/,'');
                imageS3URL = 'https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/'+contractId+'/'+imageURL.replace(/https:\/\/ipfs.io\/ipfs\//,'');
                imageThumbS3URL = 'https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/'+contractId+'/'+ipfsFolder+'/thumbnails/'+file;


            } else {
                imageURL = jsonResponse.image;
                imageS3URL = 'https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/'+contractId+'/'+imageURL.replace(/https:\/\/ipfs.io\/ipfs\//,'');
            }
        } else {
            console.log(tokenId+' fetch failed. '+ metauri);
        }

    } catch (e) { console.log('Error: '+e); };
    const result = await JSON.parse(`{ "contractId":"${contractId}", "tokenId":"${tokenId}", "owner":"${owner}", "uri":"${metauri}", "imageURL":"${imageURL}", "imageS3URL":"${imageS3URL}", "imageThumbS3URL":"${imageThumbS3URL}" }`);
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
            else if (tokenId % 100 == 0) {
            console.log(`${tokenId}: Successful Put`)
        };           // successful response

    });
}

//putNFT(contractId,contractABI,1,web3, ddb);

async function getNFTs (supply, indexId, contractId, contractABI, web3, ddb) {
    const limit = pLimit(10);
    const input = [];

    for (let i = 0; i < supply+indexId; i++) {
        input[i] = new Promise((resolve, reject) => {
            limit(() => putNFT(contractId, contractABI, i+indexId, web3, ddb));
        }); 
    }

    const result = await Promise.all(input);
}

getNFTs(3333, 0, contractId, contractABI, web3, ddb);