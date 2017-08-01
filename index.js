const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

function makeEndPoint(name, valid) {
  let dataStore = [];
  // get all
  app.get(`/api/${name}s`, (req, res) => {
    res.json(dataStore);
  });

  // get one
  app.get(`/api/${name}s/:id`, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.sendStatus(400); // bad request
      return;
    }
    const entityToFind = dataStore.find(entity => entity.id === id);
    if (!entityToFind) {
      res.sendStatus(404); // not found
      return;
    }
    res.json(entityToFind);
  });

  // create
  app.post(`/api/${name}s`, (req, res) => {
    const newEntityRequest = req.body;
    if (!valid(newEntityRequest)) {
      res.sendStatus(400);
      return;
    }
    const newEntity = Object.assign({}, newEntityRequest, { id: uuid() });
    dataStore.push(newEntity);
    res.json(newEntity);
  });

  // edit
  app.put(`/api/${name}s/:id`, (req, res) => {
    const id = req.params.id;
    const newEntityRequest = req.body;
    if (!id) {
      res.sendStatus(400); // bad request
      return;
    }
    const entityToFind = dataStore.find(entity => entity.id === id);
    if (!entityToFind) {
      res.sendStatus(404); // not found
      return;
    }
    if (!valid(newEntityRequest)) {
      res.sendStatus(400); // bad request
      return;
    }
    const newEntity = Object.assign(entityToFind, newEntityRequest);
    res.json(newEntity);
  });

  // delete
  app.delete(`/api/${name}s/:id`, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.sendStatus(400); // bad request
      return;
    }
    const entityToFind = dataStore.find(entity => entity.id === id);
    if (!entityToFind) {
      res.sendStatus(404); // not found
      return;
    }
    const indexToRemove = dataStore.findIndex(entity => entity.id === id);
    dataStore.splice(indexToRemove, 1);
    res.send();
  });
} 

makeEndPoint('question', question => question && question.user && question.userId && question.content);
makeEndPoint('like', like => like && like.questionId && like.userId);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
