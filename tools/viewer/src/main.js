import "./style.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { parseTree } from "./parser.js";
import { layoutTree } from "./layout.js";
import sample from "../examples/rebrand.md?raw";
const $ = (s) => document.querySelector(s),
  colors = ["#397a70", "#ac792f", "#b36551", "#597f9b", "#88708d", "#778348"];
let tree,
  collapsed = new Set(),
  expandedAnswers = new Set(),
  positions,
  scale = 1,
  tx = 40,
  ty = 30,
  view = innerWidth < 650 ? "outline" : "map",
  baseUrl = "";
const viewport = $("#viewport"),
  world = $("#world");
function notice(message) {
  $("#notice").textContent = message;
  $("#notice").hidden = !message;
}
function rich(markdown) {
  const el = document.createElement("div");
  el.innerHTML = DOMPurify.sanitize(
    marked.parse(markdown + "\n\n" + (tree?.definitions || "")),
    {
      ALLOWED_TAGS: [
        "p",
        "strong",
        "em",
        "a",
        "code",
        "pre",
        "br",
        "ul",
        "ol",
        "li",
        "blockquote",
        "del",
      ],
      ALLOWED_ATTR: ["href", "title"],
    },
  );
  el.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
      if (
        baseUrl &&
        !/^[a-z][a-z\d+.-]*:/i.test(href) &&
        !href.startsWith("//")
      )
        a.href = new URL(href, baseUrl).href;
      else {
        a.removeAttribute("href");
        a.classList.add("unavailable");
        a.title = "Relative source link: " + href;
        a.tabIndex = 0;
        a.addEventListener("click", () =>
          notice(
            "This link points to " +
              href +
              ". Open it from the original Markdown project.",
          ),
        );
        return;
      }
    }
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  return el;
}
function allNodes(n = tree) {
  return [n, ...n.children.flatMap((c) => allNodes(c))];
}
function visible(n) {
  return { ...n, children: collapsed.has(n.id) ? [] : n.children.map(visible) };
}
function nodeContent(n, isRoot = false) {
  const container = document.createElement("div");
  const q = rich(isRoot ? tree.title : n.question);
  q.className = "question";
  container.append(q);
  if (isRoot) {
    const note = document.createElement("div");
    note.className = "root-note";
    note.textContent = "One question. Many ways forward.";
    container.append(note);
  }
  if (n.answer) {
    const a = document.createElement("div");
    a.className = "answer";
    const label = document.createElement("span");
    label.className = "answer-label";
    label.textContent = "Answer";
    a.append(label);
    const body = rich(n.answer);
    body.className = "answer-content";
    const long = true;
    if (long && !expandedAnswers.has(n.id)) body.classList.add("preview");
    a.append(body);
    if (long) {
      const b = document.createElement("button");
      b.textContent = expandedAnswers.has(n.id) ? "Show less" : "Read answer";
      b.setAttribute("aria-expanded", expandedAnswers.has(n.id));
      b.onclick = () => {
        expandedAnswers.has(n.id)
          ? expandedAnswers.delete(n.id)
          : expandedAnswers.add(n.id);
        render(n.id, "answer");
      };
      b.dataset.action = "answer";
      a.append(b);
    }
    container.append(a);
  }
  if (n.children.length && !isRoot) {
    const b = document.createElement("button");
    b.className = "branch-toggle";
    b.dataset.action = "branch";
    b.setAttribute("aria-expanded", !collapsed.has(n.id));
    b.innerHTML = `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8${collapsed.has(n.id) ? "M6 2v8" : ""}"/></svg>`;
    b.append(
      document.createTextNode(
        collapsed.has(n.id)
          ? `${n.children.length} ${n.children.length === 1 ? "question" : "questions"}`
          : "Fold branch",
      ),
    );
    b.onclick = () => {
      collapsed.has(n.id) ? collapsed.delete(n.id) : collapsed.add(n.id);
      render(n.id, "branch");
    };
    container.append(b);
  }
  return container;
}
// Measure the actual three-line preview, rather than guessing from source length.
function prepareAnswers(scope) {
  scope.querySelectorAll(".answer-content.preview").forEach((body) => {
    const overflowing = body.scrollHeight > body.clientHeight + 1;
    const button = body.parentElement.querySelector('[data-action="answer"]');
    button.hidden = !overflowing;
    if (overflowing)
      body.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
    else body.classList.remove("preview");
  });
}
function transform() {
  world.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
  $("#zoom").textContent = Math.round(scale * 100) + "%";
}
function render(anchor, action) {
  const before = positions?.nodes.find((n) => n.id === anchor);
  $("#nodes").replaceChildren();
  const shown = visible(tree),
    sizes = new Map(),
    elements = new Map();
  function mount(n, branch = 0) {
    const el = document.createElement("article");
    el.className = "node" + (n.id === "root" ? " root" : "");
    el.dataset.id = n.id;
    el.style.setProperty("--branch", colors[branch % colors.length]);
    el.append(
      nodeContent(
        allNodes().find((x) => x.id === n.id),
        n.id === "root",
      ),
    );
    $("#nodes").append(el);
    prepareAnswers(el);
    sizes.set(n.id, el.offsetHeight);
    elements.set(n.id, el);
    n.children.forEach((c, i) => mount(c, n.id === "root" ? i : branch));
  }
  mount(shown);
  positions = layoutTree(shown, sizes);
  for (const n of positions.nodes) {
    const el = elements.get(n.id);
    el.style.left = n.x + "px";
    el.style.top = n.y + "px";
  }
  const svg = $("#connections");
  svg.replaceChildren();
  svg.setAttribute("width", positions.width);
  svg.setAttribute("height", positions.height);
  for (const { from, to } of positions.edges) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const x = from.x + 280,
      y = from.y + from.height / 2,
      endY = to.y + to.height / 2;
    path.setAttribute(
      "d",
      `M${x} ${y} C${x + 55} ${y},${to.x - 55} ${endY},${to.x} ${endY}`,
    );
    path.setAttribute("stroke", colors[to.branch % colors.length]);
    svg.append(path);
  }
  if (before) {
    const after = positions.nodes.find((n) => n.id === anchor);
    tx += (before.x - after.x) * scale;
    ty += (before.y - after.y) * scale;
  }
  transform();
  renderOutline();
  if (anchor && action && view === "map")
    elements
      .get(anchor)
      ?.querySelector(`[data-action="${action}"]`)
      ?.focus({ preventScroll: true });
}
function renderOutline() {
  const out = $("#outline");
  const scroll = out.scrollTop;
  const activeId = document.activeElement.closest("[data-id]")?.dataset.id;
  const activeAction = document.activeElement.dataset.action;
  out.replaceChildren();
  const title = document.createElement("h2");
  title.className = "outline-root";
  title.textContent = tree.title;
  out.append(title);
  function list(nodes) {
    const ul = document.createElement("ul");
    nodes.forEach((n) => {
      const li = document.createElement("li");
      li.dataset.id = n.id;
      li.append(nodeContent(n));
      if (n.children.length) li.append(list(n.children));
      ul.append(li);
    });
    return ul;
  }
  out.append(list(tree.children));
  prepareAnswers(out);
  out.scrollTop = scroll;
  if (view === "outline" && activeId && activeAction)
    out
      .querySelector(`[data-id="${activeId}"] [data-action="${activeAction}"]`)
      ?.focus({ preventScroll: true });
}
function fit() {
  const w = viewport.clientWidth,
    h = viewport.clientHeight;
  scale = Math.min(
    1.05,
    Math.max(
      0.15,
      Math.min((w - 80) / positions.width, (h - 50) / positions.height),
    ),
  );
  tx = (w - positions.width * scale) / 2;
  ty = (h - positions.height * scale) / 2;
  transform();
}
function setView(next) {
  view = next;
  viewport.hidden = view !== "map";
  $("#outline").hidden = view !== "outline";
  $(".map-controls").hidden = view !== "map";
  $("#map-view").setAttribute("aria-pressed", view === "map");
  $("#outline-view").setAttribute("aria-pressed", view === "outline");
  render();
  if (view === "map") {
    fit();
  }
}
function load(text, name, isSample = false) {
  try {
    if (text.length > 1000000)
      throw new Error("Use a Markdown tree smaller than 1 MB.");
    const next = parseTree(text);
    tree = next;
    collapsed = new Set(
      allNodes()
        .filter((n) => n.id !== "root" && n.children.length)
        .map((n) => n.id),
    );
    expandedAnswers.clear();
    baseUrl = isSample
      ? "https://github.com/life-itself/planning/blob/main/projects/2608-seeds-of-renaissance-rebrand.md"
      : "";
    $("#document-name").textContent = name;
    const nodes = allNodes().slice(1);
    $("#summary").textContent =
      `${nodes.length} questions · ${nodes.filter((n) => n.answer).length} with answers${isSample ? " · Sample from 25 Sep 2026" : ""}`;
    notice("");
    $("#import").hidden = true;
    render();
    setView(view);
  } catch (error) {
    notice(error.message);
  }
}
function zoom(
  factor,
  cx = viewport.clientWidth / 2,
  cy = viewport.clientHeight / 2,
) {
  const next = Math.min(2, Math.max(0.15, scale * factor));
  tx = cx - ((cx - tx) * next) / scale;
  ty = cy - ((cy - ty) * next) / scale;
  scale = next;
  transform();
}
$("#zoom-in").onclick = () => zoom(1.2);
$("#zoom-out").onclick = () => zoom(1 / 1.2);
$("#fit").onclick = fit;
$("#overview").onclick = () => {
  collapsed = new Set(
    allNodes()
      .filter((n) => n.id !== "root" && n.children.length)
      .map((n) => n.id),
  );
  render();
  fit();
};
$("#expand").onclick = () => {
  collapsed.clear();
  render();
  fit();
};
$("#map-view").onclick = () => setView("map");
$("#outline-view").onclick = () => setView("outline");
$("#sample").onclick = () => load(sample, "Seeds of Renaissance", true);
$("#open").onclick = () => $("#file").click();
$("#file").onchange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 1e6) {
      notice("Choose a Markdown file smaller than 1 MB.");
      return;
    }
    try {
      load(await file.text(), file.name);
    } catch {
      notice("Could not read this file. Try opening it again.");
    }
  }
  e.target.value = "";
};
$("#paste-toggle").onclick = () => {
  $("#import").hidden = !$("#import").hidden;
  if (!$("#import").hidden) $("#markdown").focus();
};
$("#cancel").onclick = () => ($("#import").hidden = true);
$("#render").onclick = () => load($("#markdown").value, "Your inquiry");
let drag = null;
viewport.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".node")) return;
  drag = { x: e.clientX, y: e.clientY, tx, ty };
  viewport.setPointerCapture(e.pointerId);
});
viewport.addEventListener("pointermove", (e) => {
  if (!drag) return;
  tx = drag.tx + e.clientX - drag.x;
  ty = drag.ty + e.clientY - drag.y;
  transform();
});
viewport.addEventListener("pointerup", () => (drag = null));
viewport.addEventListener("pointercancel", () => (drag = null));
viewport.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const r = viewport.getBoundingClientRect();
      zoom(Math.exp(-e.deltaY * 0.008), e.clientX - r.left, e.clientY - r.top);
    } else {
      tx -= e.deltaX;
      ty -= e.deltaY;
      transform();
    }
  },
  { passive: false },
);
viewport.addEventListener("keydown", (e) => {
  if (e.target !== viewport) return;
  const moves = {
    ArrowLeft: [40, 0],
    ArrowRight: [-40, 0],
    ArrowUp: [0, 40],
    ArrowDown: [0, -40],
  };
  if (moves[e.key]) {
    e.preventDefault();
    tx += moves[e.key][0];
    ty += moves[e.key][1];
    transform();
  }
  if (e.key === "+") zoom(1.2);
  if (e.key === "-") zoom(1 / 1.2);
});
window.addEventListener("resize", () => {
  if (view === "map") fit();
});
load(sample, "Seeds of Renaissance", true);
