const fs = require('fs');
const fetchTaiga = require('../src/fetchTaiga.js');
const config = JSON.parse(fs.readFileSync('./config/taiga.json'));
const project = require('ramda').project;
const {Request, getToken} = fetchTaiga;
const {username, password, endpoint} = config;
const Req = Request(endpoint);

const getProjects = user => (
  Req('/projects?member=' + user.id, user.token)()
    .then(res => res.json())
    .then(d => console.log(
      JSON.stringify(project(['name', 'id'])(d), null, 2)
    ))
);

getToken(Req)(username, password)
    .then(getProjects)
    .catch(e => console.log(e));
