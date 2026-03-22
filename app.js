const STORAGE_KEY = "micro-journal-entries";

const form = document.getElementById("entry-form");
const textInput = document.getElementById("entry-text");
const tagsInput = document.getElementById("entry-tags");
const entriesList = document.getElementById("entries-list");
const entryTemplate = document.getElementById("entry-card-template");

function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => entry && typeof entry.text === "string" && entry.timestamp);
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function parseTags(rawTags) {
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function renderEntries() {
  const entries = loadEntries().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  entriesList.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No entries yet. Your journal feed will appear here.";
    entriesList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const fragment = entryTemplate.content.cloneNode(true);
    const timeEl = fragment.querySelector(".entry-time");
    const contentEl = fragment.querySelector(".entry-content");
    const tagRowEl = fragment.querySelector(".tag-row");

    timeEl.dateTime = entry.timestamp;
    timeEl.textContent = formatDate(entry.timestamp);
    contentEl.textContent = entry.text;

    if (entry.tags.length === 0) {
      tagRowEl.remove();
    } else {
      entry.tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "tag-pill";
        pill.textContent = tag;
        tagRowEl.appendChild(pill);
      });
    }

    entriesList.appendChild(fragment);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = textInput.value.trim();
  if (!text) {
    textInput.focus();
    return;
  }

  const newEntry = {
    timestamp: new Date().toISOString(),
    text,
    tags: parseTags(tagsInput.value),
  };

  const entries = loadEntries();
  entries.unshift(newEntry);
  saveEntries(entries);

  form.reset();
  textInput.focus();
  renderEntries();
});

renderEntries();
