import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const input = { // CreateTableInput
  AttributeDefinitions: [ // AttributeDefinitions // required
    // { // AttributeDefinition
    //   AttributeName: "STRING_VALUE", // required
    //   AttributeType: "S" || "N" || "B", // required
    // },
    // { // project_name
    //     AttributeName: "project_name", // required
    //     AttributeType: "S", // required
    // },
    { // contract_address
        AttributeName: "contract_address", // required
        AttributeType: "S", // required
    },
    // { // active
    //     AttributeName: "active", // required
    //     AttributeType: "N", // required
    // },
    // { // image_store
    //     AttributeName: "image_store", // required
    //     AttributeType: "S", // required
    // },
    // { // json_store
    //     AttributeName: "json_store", // required
    //     AttributeType: "S", // required
    // },
    // { // last_transaction_block
    //     AttributeName: "last_transaction_block", // required
    //     AttributeType: "N", // required
    // },
    // { // number_of_items
    //     AttributeName: "number_of_items", // required
    //     AttributeType: "N", // required
    // },
  ],
  TableName: "projects", // required
  KeySchema: [ // KeySchema // required
    { // KeySchemaElement
      AttributeName: "contract_address", // required
      KeyType: "HASH", // required
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
  TableClass: "STANDARD",
  DeletionProtectionEnabled: false,
};
const command = new CreateTableCommand(input);
const response = await client.send(command);
