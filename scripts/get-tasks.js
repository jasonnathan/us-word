require('datejs');
const fs = require('fs');
const project = require('ramda').project;
const pick = require('ramda').pick;
const fetchTaiga = require('../src/fetchTaiga.js');
const config = JSON.parse(fs.readFileSync('./config/taiga.json'));
const {Request, getToken} = fetchTaiga;
const {username, password, endpoint, projectID, sprintID} = config;
const Req = Request(endpoint);

if(typeof projectID === 'string'){
  throw new Error(projectID);
}

if(typeof sprintID === 'string'){
  throw new Error(sprintID);
}

const sKeys = [
  "id", "total_points", "subject"
];

const fetchTasks = (token) => async (story) => (
  await Req('/tasks?user_story=' + story.id, token)()
          .then(res => res.json())
          .then(d => Promise.resolve(project(["subject", "id"], d)))
)

const getTasksForStories = (stories, authGetTask) => Promise.all(
  project(sKeys)(stories).map(async story => (
      Object.assign({}, story, {tasks: await authGetTask(story)})
    )
  )
);

const getStories = user => async d => Promise.resolve({
  estimated_start: Date.parse(d.estimated_start),
  estimated_finish: Date.parse(d.estimated_finish),
  stories_points: d.user_stories.length + "/" + d.total_points,
  stories: await getTasksForStories(d.user_stories, fetchTasks(user.token)),
  name: d.name,
});

const getProjects = (user) => (
  Req('/milestones/' + sprintID, user.token)()
    .then(res => res.json())
    .then(getStories(user))
)

module.exports = () => getToken(Req)(username, password)
    .then(getProjects)
    //.then(p => console.log(p))
