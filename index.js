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

const drawText = (name, x, y) => {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.textContent = name;
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("class", "name");
  text.setAttribute("text-anchor", "middle");
  return text;
}

const drawCircle = (x, y, r) => {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", "#81ecec");
  return circle;
}

const drawNode = (subjects, node, x, y, r) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.appendChild(drawCircle(x, y, r));
  group.appendChild(drawText(subjects[node.EID].name, x, y));
  group.setAttribute("id", node.EID)
  return group;
}

const drawLine = (x, y) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", 85);
  line.setAttribute("y1", 85);
  line.setAttribute("x2", x);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", 0.8);
  return line;
}

const drawRelation = (node, x, y) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.appendChild(drawLine(x, y));
  group.appendChild(drawText(node.score, x, y));
  return group;
}

const drawMap = (subjects, relations) => {
  const primaryNode = selectPrimaryNode(subjects);
  const svg = document.getElementById("svg");
  svg.appendChild(drawNode(subjects, primaryNode, 100, 100, 20));

  const adjacentNodes = getAdjacentNodes(primaryNode, relations);
  const x = [20, 180, 20, 180]; const y = [20, 20, 180, 180];
  for(let [index, node] of adjacentNodes.entries()) {
    svg.appendChild(drawRelation(node, x[index], y[index]));
    svg.appendChild(drawNode(subjects, node, x[index], y[index], 20));
  }
}

const fetchSubjects = fetch('./data/subjects.json').then(response => response.json());
const fetchRelations = fetch('./data/related.json').then(response => response.json());
Promise.all([fetchSubjects, fetchRelations]).then(([subjects, relations]) => {
  drawMap(subjects, relations);
})