const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const list = document.getElementById("taskList");

function makeItem(title, description) {
  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = `
    <div class="row">
      <h3 class="title"></h3>
      <div class="actions">
        <button class="action secondary toggle" type="button">Mark as Completed</button>
        <button class="action edit" type="button">Edit</button>
        <button class="action danger del" type="button">Delete</button>
      </div>
    </div>
    <p class="desc"></p>
  `;
  el.querySelector(".title").textContent = title;
  el.querySelector(".desc").textContent = description;
  return el;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = titleInput.value.trim();
  const d = descInput.value.trim();
  if (!t) return;
  const el = makeItem(t, d);
  list.prepend(el);
  form.reset();
  titleInput.focus();
});

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const item = e.target.closest(".item");
  if (btn.classList.contains("del")) {
    item.remove();
    return;
  }
  if (btn.classList.contains("toggle")) {
    const done = item.classList.toggle("completed");
    btn.textContent = done ? "Mark as Incomplete" : "Mark as Completed";
    return;
  }
  if (btn.classList.contains("edit")) {
    const editor = item.querySelector(".inline");
    if (!editor) {
      const t = item.querySelector(".title").textContent;
      const d = item.querySelector(".desc").textContent;
      const box = document.createElement("div");
      box.className = "inline";
      box.innerHTML = `
        <input class="e-title" value="${t}">
        <textarea class="e-desc">${d}</textarea>
      `;
      item.insertBefore(box, item.children[1]);
      btn.textContent = "Save";
    } else {
      const nt = editor.querySelector(".e-title").value.trim();
      const nd = editor.querySelector(".e-desc").value.trim();
      if (nt) item.querySelector(".title").textContent = nt;
      item.querySelector(".desc").textContent = nd;
      editor.remove();
      btn.textContent = "Edit";
    }
  }
});
