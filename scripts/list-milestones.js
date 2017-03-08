const fs = require('fs');
const fetchTaiga = require('../src/fetchTaiga.js');
const config = JSON.parse(fs.readFileSync('./config/taiga.json'));
const project = require('ramda').project;
const {Request, getToken} = fetchTaiga;
const {username, password, endpoint, projectID} = config;
const Req = Request(endpoint);

if(typeof projectID === 'string'){
  throw new Error(projectID);
}

const getProjects = user => (
  Req('/milestones?project=' + projectID, user.token)()
    .then(res => res.json())
    .then(d => console.log(
      JSON.stringify(project(['name', 'id'])(d), null, 2)
    ))
);

getToken(Req)(username, password)
    .then(getProjects)
    .catch(e => console.log(e));
