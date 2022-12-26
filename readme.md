# Nostr-Filters

## Filters the easy way.

 It's meant to create nostr request filters easily.
 You have two options, classic approach, or semantic.


## Semantic Approach
```js
let myfilter = filter("semantic")
  .ids(["ID2", "ID3"])
  .kindName("note")
  .kindName("channelMuteUser")
  .kind(7)
  .kinds([40, 41])
  .author("authorPubKey1")
  .authors(["authorPubKey2", "authorPubKey3"])
  .event("EventID1")
  .events(["EventID2", "EventID3"])
  .pubkey("Pub1")
  .pubkeys(["Pub1", "Pub2"]) //Removes same ID from the result.
  .time("since", "days", "after", 3)
  .time("until", "now")
  .limit(10)
  .build();
```

This should return this;

```json
{
    "authors": [
        "authorPubKey1",
        "authorPubKey2",
        "authorPubKey3"
    ],
    "since": 1672344233,
    "until": 1672085033,
    "limit": 10,
    "kinds": [
        1,
        44,
        7,
        40,
        41
    ],
    "ids": [
        "ID2",
        "ID3"
    ],
    "#e": [
        "EventID1",
        "EventID2",
        "EventID3"
    ],
    "#p": [
        "Pub1",
        "Pub2"
    ]
}
```

## Plain (dumb) Approach

```js
filter("plain")
  .authors(["author1", "author2"])
  .since(1672083116)
  .pubkeys(["pub1", "pub2"]);
```


You can also acces to methods directly if you don't want to use `filter(type)`.
 ```js 
    plainFilter()
    .method(["val"])
``` 

or 

```js
    semanticFilter()
    .method(["val"])
```


### Additionally
You can use just access to kind names with `kindNames`