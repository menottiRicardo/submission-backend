const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :param",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

morgan.token("param", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  Person.find({}).then((persons) => {
    const date = new Date().toLocaleString();
    response.send(`
  <div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>
  </div>`);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      console.log(person)
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  console.log(person)
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedperson) => {
      response.json(updatedperson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});



app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: "number is missing",
    });
  }
  // const exist = persons.find(
  //   (person) => person.name === newPerson.name
  // );

  // if (exist !== undefined) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // } else if (!newPerson.number) {
  //   return response.status(400).json({
  //     error: "number is missing",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedperson) => {
    response.json(savedperson);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
