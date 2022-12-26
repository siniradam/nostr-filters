import { filter, plainFilter, semanticFilter } from "./index.js";

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
  .pubkeys(["Pub1", "Pub2"]) //Keeps unique values
  .time("since", "days", "after", 3)
  .time("until", "now")
  .limit(10)
  .build();

console.log(myfilter);

filter("plain")
  .authors(["author1", "author2"])
  .since(1672083116)
  .pubkeys(["pub1", "pub2"]);
