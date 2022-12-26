export const kindNames = {
  metaData: 0,
  note: 1,
  recommendRelay: 2,
  contacts: 3,
  encryptedDirectMessage: 4,
  eventDeletion: 5,
  reaction: 7,
  channelCreation: 40,
  channelMetaData: 41,
  channelMessage: 42,
  channelHideMessage: 43,
  channelMuteUser: 44,
};

export const plainFilter = () => {
  let filter = {
    limit: 10,
  };

  return {
    ids: function (ids) {
      filter.ids = ids;
      return this;
    },
    authors: function (pubkeys) {
      filter.authors = pubkeys;
      return this;
    },
    kinds: function (ids) {
      filter.kinds = ids;
      return this;
    },
    since: function (timestamp) {
      filter.since = timestamp;
      return this;
    },
    until: function (timestamp) {
      filter.until = timestamp;
      return this;
    },
    events: function (eventIds) {
      filter["#e"] = eventIds;
      return this;
    },
    pubkeys: function (pubKeys) {
      filter["#p"] = pubKeys;
      return this;
    },
    limit: function (count) {
      filter.limit = count;
      return this;
    },
    //
    build: function () {
      return filter;
    },
  };
};

export const semanticFilter = () => {
  let filter = {};

  /** @type Array.<Number> */
  let kinds = [];

  /** @type Array.<String> */
  let idList = [];

  /** @type Array.<String> */
  let events = [];

  /** @type Array.<String> */
  let tags = [];

  /** @type Array.<String> */
  let pubs = [];

  //TimeStamp
  const day = 864e5;
  const hour = 36e2;
  const daysBefore = (d) => ((Date.now() - day * d) / 1000) | 0;
  const daysAfter = (d) => ((Date.now() + day * d) / 1000) | 0;
  const hoursBefore = (h) => ((Date.now() - hour * h) / 1000) | 0;
  const hoursAfter = (h) => ((Date.now() + hour * h) / 1000) | 0;

  return {
    /**
     * @param {String} singleId
     */
    id: function (singleId) {
      idList.push(singleId);
      return this;
    },
    /**
     * @param {Array<String>} ids
     */
    ids: function (ids) {
      idList.push(...ids);
      return this;
    },
    /**
     * @param {keyof kindNames} kindName Name of a kind.
     * @description Chain this function for each additional kind.
     */
    kindName: function (kindName) {
      //metaData,note,reaction,contacts,
      //encryptedDirectMessage, eventDeletion,recommendRelay,
      //channelCreation, channelMetaData, channelMessage,
      //channelHideMessage, channelMuteUser
      if (kindNames[kindName]) {
        kinds.push(kindNames[kindName]);
      }
      return this;
    },
    /**
     * @param {Number} kindId
     * @description Add one kind id at a time, chain for each.
     */
    kind: function (kindId) {
      kinds.push(kindId);
      return this;
    },
    /**
     * @param {Array<Number>} kindIds Kind number array
     * @description To add couple of kinds at once.
     */
    kinds: function (kindIds) {
      if (Array.isArray(kindIds)) {
        kinds.push(...kindIds);
      }
      return this;
    },
    /**
     * @param {String} pubkey Add an author
     * @description To add couple of kinds at once.
     */
    author: function (pubkey) {
      if (!filter.authors) {
        filter.authors = [];
      }
      filter.authors.push(pubkey);
      return this;
    },
    /**
     * @param {Array<String>} pubkeys multiple authors
     * @description To add couple of authors at once.
     */
    authors: function (pubkeys) {
      if (!filter.authors) {
        filter.authors = [];
      }
      filter.authors.push(...pubkeys);
      return this;
    },
    //events
    /**
     * @param {Array<String>} eventIds multiple authors
     * @description To add couple of authors at once.
     */
    events: function (eventIds) {
      events.push(...eventIds);
      return this;
    },
    /**
     * @param {String} eventId
     */
    event: function (eventId) {
      events.push(eventId);
      return this;
    },
    /**
     * @param {Array<String>} pubKeys
     */
    pubkeys: function (pubKeys) {
      pubs.push(...pubKeys);
      return this;
    },
    pubkey: function (pubKey) {
      pubs.push(pubKey);
      return this;
    },
    //Records; Newer than this
    /**
     *
     * @param {"since"|"until"} type
     * @param {"now"|"yesterday"|"days"|"hours"} unit
     * @param {"before"|"after"=} beforeAfter
     * @param {Number=} n Days or hours value
     * @returns
     */
    time: function (type, unit, beforeAfter, n) {
      if (unit == "now") {
        filter[type] = daysBefore(0);
      } else if (unit == "yesterday") {
        filter[type] = daysBefore(1);
        //
      } else if (unit == "days" && beforeAfter == "before") {
        filter[type] = daysBefore(n);
      } else if (unit == "days" && beforeAfter == "after") {
        filter[type] = daysAfter(n);
        //
      } else if (unit == "hours" && beforeAfter == "before") {
        filter[type] = hoursBefore(n);
      } else if (unit == "hours" && beforeAfter == "after") {
        filter[type] = hoursAfter(n);
      }
      return this;
    },
    //Records; Older than this
    until: function (timestamp) {
      filter.until = timestamp;
      return this;
    },
    since: function (timestamp) {
      filter.since = timestamp;
      return this;
    },
    limit: function (count) {
      filter.limit = count;
      return this;
    },
    build: function () {
      if (kinds.length > 0) {
        filter.kinds = kinds;
      }
      if (idList.length > 0) {
        filter["ids"] = idList;
      }
      if (events.length > 0) {
        filter["#e"] = [...new Set(events)];
      }
      if (pubs.length > 0) {
        filter["#p"] = [...new Set(pubs)];
      }

      return filter;
    },
    buildString: function () {
      return JSON.stringify(this.build());
    },
  };
};

export const filter = (type) => {
  if (type == "semantic") {
    return semanticFilter();
  } else {
    return plainFilter();
  }
};
