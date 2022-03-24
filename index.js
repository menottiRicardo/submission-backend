const express = require("express");
const app = express();
app.use(express.json());
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const people = persons.length;
  const date = new Date().toLocaleString();
  response.send(`
  <div>
  <p>Phonebook has info for ${people} people</p>
  <p>${date}</p>
  </div>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person === undefined) {
    response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const newId = Math.floor(Math.random() * 25);

  const newPerson = request.body;
  newPerson.id = newId + 1;

  const exist = persons.find(
    (person) => person.name === newPerson.name
  );

  if (exist !== undefined) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else if (!newPerson.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  } else if (!newPerson.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }
  
  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
