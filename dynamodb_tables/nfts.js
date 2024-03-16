import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const input = { // CreateTableInput
    AttributeDefinitions: [ // AttributeDefinitions // required
        {
            "AttributeName": "contractId",
            "AttributeType": "S"
        },
        {
            "AttributeName": "partitionKey",
            "AttributeType": "S"
        },
        {
            "AttributeName": "tokenId",
            "AttributeType": "N"
        }
    ],
    TableName: "nfts", // required
    KeySchema: [ // KeySchema // required
        {
            "AttributeName": "partitionKey",
            "KeyType": "HASH"
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "contractId-tokenId-index",
            KeySchema: [
                {
                    "AttributeName": "contractId",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "tokenId",
                    "KeyType": "RANGE"
                }
            ],
            Projection: {
                "ProjectionType": "ALL"
            },
        }
    ],
    BillingMode: "PAY_PER_REQUEST",
    TableClass: "STANDARD",
    DeletionProtectionEnabled: false,
};
const command = new CreateTableCommand(input);
const response = await client.send(command);
