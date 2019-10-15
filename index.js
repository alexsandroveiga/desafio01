const express =  require('express');

const server = express();

server.use(express.json());

let requests = 0;
const projects = [];

function allRequests(req, res, next) {
  requests++;

  console.log(`Número de requisições: ${requests}`);
  
  next();
}

server.use(allRequests);

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Projeto não encontrado' });
  }

  next(); 
}

server.post('/projects/', (req, res) => {
  const { id, title } = req.body;

  projects.push({id, title, tasks: []});

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.splice(projects.findIndex(project => project.id == id), 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);