const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log('unexpected number of arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://coreytshih_db_user:${password}@cluster0.dvsy5i1.mongodb.net/phonebook`

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

switch (process.argv.length) {
  case 3:
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
    break

  case 5:
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(result => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      mongoose.connection.close()
    })
}