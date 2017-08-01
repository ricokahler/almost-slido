// generates a random ID
function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) }

if (!localStorage.getItem('userId')) {
  localStorage.setItem('userId', b());
}
const userId = localStorage.getItem('userId');

function addQuestion(question) {
  const section = document.querySelector('.section--content');
  const questionDiv = document.createElement('div');
  section.appendChild(questionDiv);
  questionDiv.outerHTML = `
    <div class="question container" id="question-${question.id}">
      <article class="media box">
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${question.user || 'Anonymous'}</strong>
              <br>${question.content}
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span
                  class="icon is-small like-button"
                  data-question-id="${question.id}"
                  data-liked="no"
                >
                  <i class="fa fa-thumbs-up"></i>
                  &nbsp;<span class="likes">0</span>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  `;
  return section.querySelector(`.question:last-child`);
}

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  const user = document.querySelector('#user').value || 'Anonymous';
  const content = document.querySelector('#textarea').value;
  if (!content) { return; }
  const body = JSON.stringify({ user, content, userId });
  fetch('/api/questions', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' }
  }).then(data => data.json()).then(question => {
    const questionDiv = addQuestion(question);
    console.log(questionDiv);
    const likeButton = questionDiv.querySelector('.like-button');
    addLikeButtonListener(likeButton);
  })
});

function addLikeButtonListener(likeButton) {
  likeButton.addEventListener('click', e => {
    const currentTarget = e.currentTarget;
    const questionId = currentTarget.dataset.questionId;
    const user = document.querySelector('#user').value || 'Anonymous';
    const liked = currentTarget.dataset.liked === 'yes';
    const likesSpan = likeButton.querySelector('.likes');
    const likeCount = parseInt(likesSpan.innerText);

    if (liked) { // the user requested to unlike
      const likeId = likeButton.dataset.likeId;
      fetch(`/api/likes/${likeId}`, { method: 'DELETE' }).then(() => {
        likesSpan.innerText = (likeCount - 1).toString();
        currentTarget.dataset.liked = 'no'
      });
    } else { // the user requested to create a like
      const body = JSON.stringify({ userId, questionId });
      fetch(`/api/likes`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      }).then(() => {
        likesSpan.innerText = (likeCount + 1).toString();
        currentTarget.dataset.liked = 'yes'
      });
    }
  });
}

const loadQuestions = fetch('/api/questions/').then(data => data.json()).then(questions => {
  const section = document.querySelector('.section--content');
  questions.forEach(addQuestion);
});

loadQuestions.then(() => {
  Array.from(document.querySelectorAll('.like-button')).forEach(addLikeButtonListener);
}).then(() => {
  return fetch('/api/likes/').then(data => data.json()).then(likes => {
    likes.forEach(like => {
      const question = document.querySelector(`#question-${like.questionId}`);
      if (!question) {
        return;
      }
      const likeButton = question.querySelector('.like-button');
      if (userId === like.userId) {
        likeButton.dataset.liked = 'yes';
        likeButton.dataset.likeId = like.id;
      }
      const liked = likeButton.dataset.liked === 'yes';
      const likesSpan = likeButton.querySelector('.likes');
      if (!likesSpan) {
        return;
      }
      const likeCount = parseInt(likesSpan.innerText);
      likesSpan.innerText = (likeCount + 1).toString();
    });
  });
});