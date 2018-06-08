console.log("setup done");

fetch('./data/subjects.json')
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    console.log(data);
  })

fetch('./data/related.json')
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    console.log(data);
  })