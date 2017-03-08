const fetch = require('node-fetch');
const prop = require('ramda').prop;

const fetchTaiga = {
  Request: endpoint => (path, token) => (body) => {
    const method = token ? "GET" : "POST";

    const headers = {
      "Content-Type": "application/json"
    };

    const opts = {method, headers};

    if(token){
      headers.Authorization = "Bearer " + token
    }

    if(body){
      opts.body = body;
    }

    console.log("Fetching..." + path);

    return fetch(endpoint+"/"+path, opts);
  },
  getToken: req => (username, password) => (
    req("/auth")(JSON.stringify({
      type: "normal", username, password
    }))
    .then(res => res.json())
    .then(d => Promise.resolve({id: d.id, token: d.auth_token}))
  )
}


module.exports = fetchTaiga;
