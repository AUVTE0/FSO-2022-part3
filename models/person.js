const mongoose = require('mongoose')

// check for password in cl arg
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((e) => {
        console.log("error connecting to MongoDB: ", e.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
              return /\d{2,3}-\d+/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
        required: [true, 'User phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = doc._id.toString(),
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

