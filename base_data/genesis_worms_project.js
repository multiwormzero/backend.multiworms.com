import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const input = { // PutItemInput
  TableName: "projects", // required
  Item: { // PutItemInputAttributeMap // required
    contract_address: { // AttributeValue Union: only one key present
        S: "0x4551C11B22FDd733A0328c62d6eF4e4C6496DadA",
    },
    project_name: { // AttributeValue Union: only one key present
        S: "Multiworms - Genesis Worms",
    },
    active: { // AttributeValue Union: only one key present
        N: "1",
    },
    image_store: { // AttributeValue Union: only one key present
        S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0x4551C11B22FDd733A0328c62d6eF4e4C6496DadA/QmaKk7DLEbavE9gXFvfds2dwLcdrRu3sbD6sJLp8G1Xfm8/",
    },
    json_store: { // AttributeValue Union: only one key present
        S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0x4551C11B22FDd733A0328c62d6eF4e4C6496DadA/QmaWts7xFTRnkgvsgb5V8PpAMZwnsrx3zbhVULCK4wjZYF/",
    },
    last_transaction_block: { // AttributeValue Union: only one key present
        N: "0",
    },
    number_of_items: { // AttributeValue Union: only one key present
        S: "3333",
    },
  },

};
const command = new PutItemCommand(input);
const response = await client.send(command);