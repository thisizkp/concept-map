const selectPrimaryNode = nodesList => {
  const keys = Object.keys(nodesList);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return nodesList[randomKey];
}

const getAdjacentNodes = (primaryNode, relations) => {
  return relations[primaryNode.EID].sort((a,b) => {
    if (a.score < b.score) return 1;
    else if (a.score > b.score) return -1;
    return 0;
  }).slice(0,4);
}

const fetchSubjects = fetch('./data/subjects.json').then(response => response.json());
const fetchRelations = fetch('./data/related.json').then(response => response.json());
Promise.all([fetchSubjects, fetchRelations]).then(([subjects, relations]) => {
  const primaryNode = selectPrimaryNode(subjects);
  const adjacentNodes = getAdjacentNodes(primaryNode, relations);
  console.log(adjacentNodes);
})