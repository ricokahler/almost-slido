const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let questions = [];

/**
 * Validates a question object
 * @param {string} question 
 */
function valid(question) {
  return question && question.user && question.content;
}

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.get('/api/questions/:questionId', (req, res) => {
  const questionId = req.params.questionId;
  const questionToFind = questions.find(question => question.id === questionId);
  if (!questionToFind) {
    res.sendStatus(404);
  } else {
    res.json(questionToFind);
  }
});

app.post('/api/questions', (req, res) => {
  const question = req.body;
  // if the request is valid
  if (valid(question)) {
    // create a new question object with an ID
    const questionWithId = {
      id: uuid(),
      user: question.user,
      content: question.content
    };
    // push it to the "datastore"
    questions.push(questionWithId);
    // send the new object back
    res.json(questionWithId);
  } else {
    // if the request is invalid, send a 400
    res.sendStatus(400);
  }
});

app.put('/api/questions/:questionId', (req, res) => {
  const questionId = req.params.questionId;
  const newQuestion = req.body;
  const questionToFind = questions.find(question => question.id === questionId);
  if (!questionToFind) {
    res.sendStatus(404);
  } else if (!valid(newQuestion)) {
    res.sendStatus(400);
  } else {
    // mutate `questionToFind`
    questionToFind.user = newQuestion.user;
    questionToFind.content = newQuestion.content;
    res.json(questionToFind);
  }
});

app.delete('/api/questions/:questionId', (req, res) => {
  const questionId = req.params.questionId;
  const questionToFind = questions.find(question => question.id === questionId);
  if (!questionId) {
    res.sendStatus(400);
  } else if (!questionToFind) {
    res.sendStatus(404);
  } else {
    const indexToRemove = questions.findIndex(question => question.id === questionId);
    questions.splice(indexToRemove, 1);
    res.send();
  }
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
