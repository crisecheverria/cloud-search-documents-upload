require('dotenv').config()
const Fuse = require('fuse.js')
const mongoose = require('mongoose')
const agaSearch = require('./aga-search.json')
const _ = require('lodash')
const striptags = require('striptags')
const Schema = mongoose.Schema;

const dbUrl = process.env.MONGO_URI_PROD

mongoose.connect(dbUrl, { useNewUrlParser: true }).then(() => console.log('MongoDB Connected')).catch(err => console.log(err))

const Content = mongoose.model('content', new Schema({ _id: Schema.Types.ObjectId, slug: String }, { strict: false })) 

const agaIds = _.map(agaSearch, 'id')
console.log(agaIds.length)

const compare = (arr1, arr2) => {
    const finalArray = []

    arr1.forEach(e1 => arr2.forEach(e2 => {
        if (e1 === e2) {
            finalArray.push(e1)
        }
    }));

    return finalArray
}

Content.find({
    'state': 'published'
  }).then(data => {

    const dataIds = _.map(data, '_id')
    // console.log(dataIds)
    const published = compare(dataIds, agaIds)
    console.log(published.length)

  })

