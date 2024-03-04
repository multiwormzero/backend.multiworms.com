import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const input = { // PutItemInput
  TableName: "projects", // required
  Item: { // PutItemInputAttributeMap // required
    contract_address: { // AttributeValue Union: only one key present
        S: "0x4551c11b22fdd733a0328c62d6ef4e4c6496dada",
    },
    project_name: { // AttributeValue Union: only one key present
        S: "Multiworms - Genesis Worms",
    },
    active: { // AttributeValue Union: only one key present
        N: "1",
    },
    image_store: { // AttributeValue Union: only one key present
        S: "https://s3.us-west-2.amazonaws.com/com.mwzlabs.nftstore/images/0xAA1760d841a86F0A94B4Cb87cFC709C58f8BBAb5/QmabZD1fTrh1WvERisWrp1S4yKzMTL2Vm21r5yPCMM8jLh/",
    },
    json_store: { // AttributeValue Union: only one key present
        S: "https://s3.us-west-2.amazonaws.com/com.mwzlabs.nftstore/metadata/0xAA1760d841a86F0A94B4Cb87cFC709C58f8BBAb5/QmcshmPygAMy6LQq7Nm2QsnzLYZg5cfPSU4VXPDXMZJg2U/",
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