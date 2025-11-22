const STORAGE_KEY = 'studyBoards_v1';
let boards = [];
let currentBoardId = null;

function uid(){return Math.random().toString(36).slice(2,9)}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  boards = raw ? JSON.parse(raw) : [];
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

function calcProgress(board){
  if(!board.resources || board.resources.length===0) return 0;
  const done = board.resources.filter(r=>r.status==='Completed').length;
  return Math.round((done / board.resources.length) * 100);
}

function render(){
  const container = document.getElementById('boardsContainer');
  container.innerHTML='';
  const btpl = document.getElementById('board-template');
  const rtpl = document.getElementById('resource-template');

  boards.forEach(board=>{
    const node = btpl.content.cloneNode(true);
    const section = node.querySelector('.board');
    section.dataset.id = board.id;
    section.querySelector('.board-title').textContent = board.name;
    section.querySelector('.progress').textContent = calcProgress(board)+'%';
    const addBtn = section.querySelector('.add-resource-btn');
    addBtn.addEventListener('click', ()=>openResourceForm(board.id));

    const resourcesWrap = section.querySelector('.resources');
    (board.resources||[]).forEach(res=>{
      const rnode = rtpl.content.cloneNode(true);
      const article = rnode.querySelector('.resource-card');
      article.dataset.id = res.id;
      const a = rnode.querySelector('.resource-title');
      a.textContent = res.title;
      a.href = res.url;
      rnode.querySelector('.type').textContent = res.type;
      const sel = rnode.querySelector('.status-select');
      sel.value = res.status || 'To Do';
      sel.addEventListener('change', (e)=>{
        updateResourceStatus(board.id, res.id, e.target.value);
      });
      rnode.querySelector('.delete-resource').addEventListener('click', ()=>{
        deleteResource(board.id, res.id);
      });
      resourcesWrap.appendChild(rnode);
    });

    container.appendChild(section);
  });
}

function addBoard(name){
  const b = {id:uid(), name, resources:[]};
  boards.push(b);
  save(); render();
}

function findBoard(id){return boards.find(b=>b.id===id)}

function openResourceForm(boardId){
  currentBoardId = boardId;
  document.getElementById('resourceForm').reset();
  document.getElementById('resourceFormModal').classList.remove('hidden');
}

function closeResourceForm(){
  currentBoardId = null;
  document.getElementById('resourceFormModal').classList.add('hidden');
}

function addResourceToBoard(boardId, data){
  const board = findBoard(boardId);
  if(!board) return;
  board.resources.push({id:uid(), title:data.title, url:data.url, type:data.type, status:data.status});
  save(); render();
}

function updateResourceStatus(boardId, resId, status){
  const b = findBoard(boardId);
  if(!b) return;
  const r = b.resources.find(x=>x.id===resId);
  if(!r) return;
  r.status = status;
  save(); render();
}

function deleteResource(boardId, resId){
  const b = findBoard(boardId);
  if(!b) return;
  b.resources = b.resources.filter(r=>r.id!==resId);
  save(); render();
}

window.addEventListener('DOMContentLoaded', ()=>{
  load();
  render();

  document.getElementById('addBoardForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('boardName').value.trim();
    if(name) addBoard(name);
    e.target.reset();
  });

  document.getElementById('resourceForm').addEventListener('submit', e=>{
    e.preventDefault();
    const data = {
      title: document.getElementById('resTitle').value.trim(),
      url: document.getElementById('resUrl').value.trim(),
      type: document.getElementById('resType').value,
      status: document.getElementById('resStatus').value
    };
    if(currentBoardId && data.title && data.url) addResourceToBoard(currentBoardId, data);
    closeResourceForm();
  });

  document.getElementById('cancelRes').addEventListener('click', ()=>closeResourceForm());

  document.getElementById('resourceFormModal').addEventListener('click', (ev)=>{
    if(ev.target.id === 'resourceFormModal') closeResourceForm();
  });
});