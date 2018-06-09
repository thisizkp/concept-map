/* SVG Helpers */
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
  circle.setAttribute("fill", "#54a0ff");
  circle.setAttribute("class", "circle");
  circle.onclick = function(e) {
    const id = e.target.closest("g").id;
    drawMap(subjects[id]);
  }
  return circle;
}

const drawLine = (x1, y1, x2, y2) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#dfe6e9");
  line.setAttribute("stroke-width", 0.8);
  return line;
}

const drawNode = (node, x, y, r) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", node.EID);
  group.appendChild(drawCircle(x, y, r));
  group.appendChild(drawText(subjects[node.EID].name, x, y));
  return group;
}

const drawRelation = (node, x1, y1, x2, y2) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "relation");
  group.appendChild(drawLine(x1, y1, x2, y2));
  group.appendChild(drawText(node.score, (x1+x2)/2, (y1+y2)/2));
  return group;
}

const drawMap = primaryNode => {
  const svg = document.getElementById("svg");
  while(svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }

  svg.appendChild(drawNode(primaryNode, 150, 150, 20));
  const x = [60, 240, 60, 240]; const y = [60, 60, 240, 240];
  const x1 = [135, 165, 135, 165]; const y1 = [135, 135, 165, 165];

  const adjacentNodes = getAdjacentNodes(primaryNode);
  for(let [index, node] of adjacentNodes.entries()) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "node");
    group.setAttribute("id", node.EID);
    group.appendChild(drawRelation(node, x1[index], y1[index], x[index], y[index]));
    group.appendChild(drawNode(node, x[index], y[index], 10));
    svg.appendChild(group);
  }
}

/* DATA LOGIC */
const getRandomNode = nodesList => {
  const keys = Object.keys(nodesList);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return nodesList[randomKey];
}

const getAdjacentNodes = primaryNode => {
  if (!relations[primaryNode.EID]) return [];
  return relations[primaryNode.EID].sort((a,b) => {
    if (a.score < b.score) return 1;
    else if (a.score > b.score) return -1;
    return 0;
  }).slice(0,4);
}

const startApp = () => {
  drawMap(getRandomNode(subjects));
}

const fetchSubjects = fetch('./data/subjects.json').then(response => response.json());
const fetchRelations = fetch('./data/related.json').then(response => response.json());
Promise.all([fetchSubjects, fetchRelations]).then(([subjects, relations]) => {
  window.subjects = subjects;
  window.relations = relations;
  startApp();
})