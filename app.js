const state = { tasks: [
  { id: "t1", title: "Read the lab README", status: "todo" },
  { id: "t2", title: "Implement render()", status: "doing" },
  { id: "t3", title: "Demo add / move / edit / delete", status: "done" },
]};
const STATUSES = ["todo", "doing", "done"];
const uid = () => `t${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function render() {
  STATUSES.forEach(s => {
    const col = document.querySelector(`[data-column-body="${s}"]`);
    const tasks = state.tasks.filter(t => t.status === s);
    col.innerHTML = tasks.length ? "" : `<p class="empty">No tasks</p>`;
    tasks.forEach(t => {
      const card = document.createElement("div");
      card.className = "card";

      const h3 = document.createElement("h3");
      h3.textContent = t.title;
      card.appendChild(h3);

      const actions = document.createElement("div");
      actions.className = "card-actions";

      STATUSES.filter(x => x !== t.status).forEach(x => {
        const btn = document.createElement("button");
        btn.dataset.action = "move";
        btn.dataset.id = t.id;
        btn.dataset.status = x;
        btn.textContent = `→ ${x[0].toUpperCase() + x.slice(1)}`;
        actions.appendChild(btn);
      });

      const editBtn = document.createElement("button");
      editBtn.dataset.action = "edit";
      editBtn.dataset.id = t.id;
      editBtn.textContent = "Edit";
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.dataset.action = "delete";
      deleteBtn.dataset.id = t.id;
      deleteBtn.textContent = "Delete";
      actions.appendChild(deleteBtn);

      card.appendChild(actions);
      col.appendChild(card);
    });
    document.querySelector(`[data-count="${s}"]`).textContent = tasks.length;
  });
}

const addTask = title => state.tasks.push({ id: uid(), title, status: "todo" });
const moveTask = (id, status) => { const t = state.tasks.find(t => t.id === id); if (t && STATUSES.includes(status)) t.status = status; };
const editTask = (id, title) => { const t = state.tasks.find(t => t.id === id); if (t && title) t.title = title; };
const deleteTask = id => { if (confirm("Delete this task?")) state.tasks.splice(state.tasks.findIndex(t => t.id === id), 1); };

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form").addEventListener("submit", e => { e.preventDefault(); const i = document.querySelector("#task-title"); const v = i.value.trim(); if (!v) return; addTask(v); i.value = ""; i.focus(); render(); });
  document.querySelector("#board").addEventListener("click", e => { const btn = e.target.closest("button[data-action]"); if (!btn) return; const { action, id, status } = btn.dataset; if (action === "move") moveTask(id, status); else if (action === "edit") { const t = state.tasks.find(t => t.id === id); const v = prompt("Edit title:", t?.title); if (v?.trim()) editTask(id, v.trim()); } else if (action === "delete") deleteTask(id); render(); });
  render();
});
