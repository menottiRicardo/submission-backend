const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.ist1r.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  console.log("Phonebook:");
  Person.find().then((result) => {
    result.forEach((note) => {
      console.log(note.name, note.number);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 4) {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(
      `person saved! ${name} number ${number} to phonebook`
    );
    mongoose.connection.close();
  });
}
