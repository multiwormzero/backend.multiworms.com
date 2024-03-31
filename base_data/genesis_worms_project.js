import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const client = new DynamoDBClient({ region: "us-east-2"});
const projects = [{ // PutItemInput
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
        N: "3333",
    },
    index_number: {
          N: "0",
    }
  }

},
{ // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0x20a1FD7bD6ACED8eC85a3589b6aB0430eCBd66A8",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - Littleworms",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0x20a1FD7bD6ACED8eC85a3589b6aB0430eCBd66A8/QmSF6BJ2XzJRAfaKYqknbxWsaHNAiw7chztTanKFnf4zLV/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0x20a1FD7bD6ACED8eC85a3589b6aB0430eCBd66A8/QmQPL2UhBmdjzcrRZnkktQs5dEpikkJvVkNp6VoymXdTqC/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "33",
      },
      index_number: {
            N: "0",
      }
    }
  
  },
  { // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0xcBe37Ec780A827727866EBd80D3674adB711d62C",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - PunkWorms",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0xcBe37Ec780A827727866EBd80D3674adB711d62C/Qma4oV53LkRokQNDBBx5hafWaYiaDqhK4VcivdhYCzLyqf/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0xcBe37Ec780A827727866EBd80D3674adB711d62C/QmPRN8ocWF8F9mxumZwDeUittjKpcfmwE9GjsQRiyFDDTq/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "33",
      },
      index_number: {
            N: "0",
      }
    }
  
  },
  { // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0x611Af5254fD862A76cB4bb5bbc37B97A4e6fab4b",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - GuerrillaWorms",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0x611Af5254fD862A76cB4bb5bbc37B97A4e6fab4b/QmW5bKiyfSnQggNSgQaXQ5CmXMgZhUDY9rQXcXwvbZvwDK/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0x611Af5254fD862A76cB4bb5bbc37B97A4e6fab4b/Qmb9SKzj4C1JCEDyGme75wgiiAXzrefswAKKCvCuWhEGng/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "33",
      },
      index_number: {
            N: "0",
      }
    }
  
  },
  { // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0x630B97E985a4782E8Ae0a5e000b8Ce47a85407dd",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - MutedWorms",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0x630B97E985a4782E8Ae0a5e000b8Ce47a85407dd/bafybeidhzp367a36zppqrtzm3i7bjxf3gsv6ffw6ut64dkodosziljbyqy/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0x630B97E985a4782E8Ae0a5e000b8Ce47a85407dd/bafybeidqjgewv67dd5a4br27usw73qf3je2fvlm46v4uznozl7cswphlai/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "33",
      },
      index_number: {
            N: "1",
      }
    }
  
  },
  { // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0x6fa7DA0E17db762F242A7a0b005162EBba42f6E3",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - ProxWorms",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0x6fa7DA0E17db762F242A7a0b005162EBba42f6E3/bafybeialkmuuboocpe2mlvf6q3qklhpac3h5zpkhdt4zcibswov5z22qzm/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0x6fa7DA0E17db762F242A7a0b005162EBba42f6E3/bafybeig4cu34s4ty5b2hrzeon2l4xwq6vtlgy4mmohfhfuvmcmcbdc23ba/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "60",
      },
      index_number: {
            N: "1",
      }
    }
  
  },
  { // PutItemInput
    TableName: "projects", // required
    Item: { // PutItemInputAttributeMap // required
      contract_address: { // AttributeValue Union: only one key present
          S: "0xd162D3fB9F9F6F59592C62676E1771b96dF5A01e",
      },
      project_name: { // AttributeValue Union: only one key present
          S: "Multiworms - Gen 2",
      },
      active: { // AttributeValue Union: only one key present
          N: "1",
      },
      image_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/images/0xd162D3fB9F9F6F59592C62676E1771b96dF5A01e/QmQ4TvR48RdpmPrD2xE8RyUDdDcZguzupaSzwqtWFZwpww/",
      },
      json_store: { // AttributeValue Union: only one key present
          S: "https://s3.us-east-2.amazonaws.com/com.multiworms.nftstore/metadata/0xd162D3fB9F9F6F59592C62676E1771b96dF5A01e/QmXJjg6xJ1hNKenYi9NP2MohWs6RgCfHSy3t6M8bw7ZZSq/",
      },
      last_transaction_block: { // AttributeValue Union: only one key present
          N: "0",
      },
      number_of_items: { // AttributeValue Union: only one key present
          N: "5000",
      },
      index_number: {
            N: "1",
      }
    }
  
  },
];

projects.forEach(params => {
    const command = new PutItemCommand(params);
    const response = client.send(command);
});