#Blockchain API
This API was built in `Node` using `Express.js`. The API has three endpoints that allow interaction with the chain:

- `/chain` - **(GET)** returns the whole chain correctly sorted by height;
- `/block/:height` - **(GET)** returns a block from the chain, given its height;
- `block` - **(POST)** creates a new block in the chain given its body content. Returns the block if saved correctly.

### Setup
1. Install [Node](https://nodejs.org);
2. On the terminal, open the project folder and run `npm i`;
3. On the terminal, run `npm start`;
4. On the browser, navigate to `localhost:8000`.

### Usage
##### Get the whole chain
To get the whole chain, navigate to `localhost:8000/chain`. The JSON output is similar to the following:

```
[
    {
        "hash": "40b026cd13ee27e4e716335c5f66444be5cc1b65a28d6b531016b9454f956037",
        "height": 0,
        "body": {
            "address": "0",
            "star": {
                "dec": "Genesis Block",
                "ra": "Genesis Block",
                "story": "47656e6573697320426c6f636b"
            }
        },
        "time": 1533467464366,
        "previousBlockHash": ""
    },
    {
        "hash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb",
        "height": 1,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "10",
                "story": "34",
                "mag": "teeste",
                "constel": "2"
            }
        },
        "time": 1533467464367,
        "previousBlockHash": "40b026cd13ee27e4e716335c5f66444be5cc1b65a28d6b531016b9454f956037"
    },
    {
        "hash": "1542c478846b5886c0a8e9b97704d7f85c31b5d33e624494372d37031e102f7e",
        "height": 2,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "124234",
                "story": "34",
                "mag": "teeste",
                "constel": "2"
            }
        },
        "time": 1533467469625,
        "previousBlockHash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb"
    }
]
```

##### Get a block from the chain by height
To get the first block from the chain, navigate to `localhost:8000/block/1` (1 might be replaced by the desired block height):

```
{
        "hash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb",
        "height": 1,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "10",
                "story": "34",
                "mag": "teeste",
                "constel": "2",
                "storyDecoded": 4
            }
        },
        "time": 1533467464367,
        "previousBlockHash": "40b026cd13ee27e4e716335c5f66444be5cc1b65a28d6b531016b9454f956037"
    }
```

##### Get a block from the chain by hash
To get a block by hash, navigate to `localhost:8000/block/hash:221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb`:

```
{
        "hash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb",
        "height": 1,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "10",
                "story": "34",
                "mag": "teeste",
                "constel": "2",
                "storyDecoded": 4
            }
        },
        "time": 1533467464367,
        "previousBlockHash": "40b026cd13ee27e4e716335c5f66444be5cc1b65a28d6b531016b9454f956037"
    }
```

##### Get a block from the chain by address
To get blocks by address, navigate to `localhost:8000/block/address:13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz`:

```
[
    {
        "hash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb",
        "height": 1,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "10",
                "story": "34",
                "mag": "teeste",
                "constel": "2",
                "storyDecoded": 4
            }
        },
        "time": 1533467464367,
        "previousBlockHash": "40b026cd13ee27e4e716335c5f66444be5cc1b65a28d6b531016b9454f956037"
    },
    {
        "hash": "1542c478846b5886c0a8e9b97704d7f85c31b5d33e624494372d37031e102f7e",
        "height": 2,
        "body": {
            "address": "13TjEENu5qFuwF5hcPzqNLftgY7pxvUxfz",
            "star": {
                "dec": "2",
                "ra": "124234",
                "story": "34",
                "mag": "teeste",
                "constel": "2",
                "storyDecoded": 4
            }
        },
        "time": 1533467469625,
        "previousBlockHash": "221a1a3a9e08c19f392efc808756adb2dfa659d3275220d2f605a779a03ddabb"
    }
]
```

##### Request address validation
To request validation of your address, post a request to `localhost:8000/requestValidation` and include your wallet address in the payload with key `address`. The response will be like:

```
{
    "address": "your_address",
    "timestamp": 1533467389619,
    "message": "your_address:1533467389619:starRegistry",
    "validationWindow": 300
}
```

##### Validate your address with the message signature
To validate your address, post a request to `localhost:8000/message-signature/validate` and include your wallet address in the payload with key `address` and the signature with key `signature`. The response will be like:

```
{
    "registerStar": true,
    "status": {
        "address": "your_address",
        "timestamp": 1533467371963,
        "message": "your_address:1533467371963:starRegistry",
        "validationWindow": 214.75799999999998
    }
}
```

##### Create a new block in the chain
Post to `localhost:8000/block` with parameter `address` filled with your address, and parameter `star` being a stringified object like presented bellow. If block is added to the chain, you'll get a response like:

```
{
    "hash": "f100eb5b05c27aa09471747587a89dc34f6a526cf03088aa07986d78aba4b7cc",
    "height": 3,
    "body": {
        "address": "your_address",
        "star": {
            "dec": "your_star_declination",
            "ra": "your_star_right_ascension",
            "story": "Your_star_story",
            "mag": "your_star_magnitude",
            "constel": "your_star_nearest_constellation"
        }
    },
    "time": 1533467486142,
    "previousBlockHash": "1542c478846b5886c0a8e9b97704d7f85c31b5d33e624494372d37031e102f7e"
}
``` 

### How to post a new star?
1. Submit your wallet address to `localhost:8000/requestValidation`.
2. Sign the message you got from the response.
3. Submit your address and your signature to `localhost:8000/message-signature/validate`.
4. Submit your star info to `localhost:8000/block`. Include your address and star info in object format. Star info should contain parameters `dec` (declination), `ra` (right ascension), `story` (your star story). It can also contain optional parameters `ma` (magnitude) and `constel` (constellation).