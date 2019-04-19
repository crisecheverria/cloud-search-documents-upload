require("dotenv").config();
const Fuse = require("fuse.js");
const mongoose = require("mongoose");
const agaSearch = require("./aga-staging.json");
const _ = require("lodash");
// const striptags = require('striptags')
const Schema = mongoose.Schema;

const dbUrl = process.env.MONGO_URI;

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const Content = mongoose.model(
  "content",
  new Schema({ _id: Schema.Types.ObjectId, slug: String }, { strict: false })
);

// const agaIds = _.map(agaSearch, "id");
const filteredAga = agaSearch.map(x => ({ id: x.id, slug: x.fields.slug }));
// console.log(filteredAga);
// console.log('======================')

const compare = (data, agaSearch) => {
  const finalArray = [];
  const missing = [];

  // data.forEach(e1 => {
  //   // agaSearch.forEach(e2 => {
  //   //   if (e1["_id"] == e2["id"] && e1["slug"] == e2["slug"]) {
  //   //     finalArray.push(e1);
  //   //   } else {
  //   //     missing.push(e1);
  //   //   }
  //   // })

  //   if (!_.find(agaSearch, { id: e1["_id"] })) {
  //     missing.push(e1);
  //   }
  // });

  // _.differenceWith();

  for (const iterator of data) {
    if (agaSearch.find(x => x.id === iterator.id)) {
      finalArray.push(iterator);
    }
  }

  return finalArray;
};

Content.find({
  state: "published"
}).then(data => {
  console.log(data.length);
  // const dataIds = _.map(data.toObject(), "_id");
  //   console.log("Content Collection", data.length);
  const newData = data.map(x => ({ id: x._id, slug: x.slug }));
  const presents = compare(newData, filteredAga);
  // const published = _.difference(dataIds, agaIds);
  // console.log("new Data: ", newData.length);
  console.log("presents: ", presents.length);
});
