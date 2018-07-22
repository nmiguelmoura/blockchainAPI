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
      "hash":"c59465e96a692ba8923162abd6ff48a3d94d96dee172bd222284c6386167c978",
      "height":0,
      "body":"Genesis block",
      "time":1532281456957,
      "previousBlockHash":""
   },
   {  
      "hash":"e8d87c6e62907384f76e3c37492ad54422b34a360062b850de55a4c1d79405c9",
      "height":1,
      "body":"Test-block-1",
      "time":1532281458966,
      "previousBlockHash":"c59465e96a692ba8923162abd6ff48a3d94d96dee172bd222284c6386167c978"
   },
   {  
      "hash":"7ca9cbf0914195d73af7675efe7e59bc974bcc23978e3177fb9dd75eb4979ca4",
      "height":2,
      "body":"Test-block-2",
      "time":1532281461823,
      "previousBlockHash":"e8d87c6e62907384f76e3c37492ad54422b34a360062b850de55a4c1d79405c9"
   },
   {  
      "hash":"a87a27eb8855f2746e01b2cf49bd1e9e4a7e102bbc004ff12907b107121d9477",
      "height":3,
      "body":"Test-block-3",
      "time":1532281464270,
      "previousBlockHash":"7ca9cbf0914195d73af7675efe7e59bc974bcc23978e3177fb9dd75eb4979ca4"
   }
]
```

##### Get a block from the chain
To get the first block from the chain, navigate to `localhost:8000/block/0` (0 might be replaced by the desired block height):

```
{  
      "hash":"c59465e96a692ba8923162abd6ff48a3d94d96dee172bd222284c6386167c978",
      "height":0,
      "body":"Genesis block",
      "time":1532281456957,
      "previousBlockHash":""
   }
```

##### Create a new block in the chain
Post to `localhost:8000/block` with parameter `body` filled with the new block content. Example using Fetch API:

```
const postData = (url = ``, data = {}) => {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};

postData(`http://localhost:8000/block`, {body: `Genesis block`})
  .then(data => console.log(data)) // JSON from `response.json()` call
  .catch(error => console.error(error));
  
  // Example use of Fetch API from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
``` 