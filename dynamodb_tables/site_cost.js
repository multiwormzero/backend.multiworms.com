import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const input = { // CreateTableInput
  AttributeDefinitions: [ // AttributeDefinitions // required
    { // month
        AttributeName: "month", // required
        AttributeType: "N", // required
    },
  ],
  TableName: "site_const", // required
  KeySchema: [ // KeySchema // required
    { // KeySchemaElement
      AttributeName: "month", // required
      KeyType: "HASH", // required
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
  TableClass: "STANDARD",
  DeletionProtectionEnabled: false,
};
const command = new CreateTableCommand(input);
const response = await client.send(command);
