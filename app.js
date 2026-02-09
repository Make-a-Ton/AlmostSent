const TABLE_NAME = "unsent_notes";

if (!window.__supabaseClient) {
  window.__supabaseClient = null;
}

const form = document.getElementById("note-form");
const messageInput = document.getElementById("note-message");
const toInput = document.getElementById("note-to");
const statusText = document.getElementById("form-status");
const archiveStatus = document.getElementById("archive-status");
const notesGrid = document.getElementById("notes-grid");
const emptyState = document.getElementById("empty-state");
const emptyStateText = emptyState ? emptyState.querySelector("p") : null;
const searchInput = document.getElementById("search-input");
const refreshBtn = document.getElementById("refresh-btn");
const clearSearchBtn = document.getElementById("clear-search");
const rulesModal = document.getElementById("rules-modal");
const acceptRulesBtn = document.getElementById("accept-rules");
const noteModal = document.getElementById("note-modal");
const noteModalClose = document.getElementById("note-modal-close");
const noteModalMessage = document.getElementById("note-modal-message");
const noteModalTo = document.getElementById("note-modal-to");
const noteModalDate = document.getElementById("note-modal-date");

const setStatus = (msg, isError = false) => {
  statusText.textContent = msg;
  statusText.style.color = isError ? "#b13d39" : "";
  if (archiveStatus) {
    archiveStatus.textContent = msg;
    archiveStatus.style.color = isError ? "#b13d39" : "";
  }
  if (msg) {
    console.info("[Status]", msg);
  }
};

const formatSupabaseError = (error) => {
  if (!error) return "Unknown error";
  const parts = [error.message];
  if (error.details) parts.push(error.details);
  if (error.hint) parts.push(error.hint);
  return parts.filter(Boolean).join(" — ");
};

const showSetupHint = () => {
  if (window.location.protocol === "file:") {
    setStatus(
      "Open with http://localhost:3000 (env.json won't load from file://).",
      true
    );
  }
};

const showRulesIfNeeded = () => {
  if (!rulesModal) return;
  rulesModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
};

const acceptRules = () => {
  if (rulesModal) {
    rulesModal.classList.add("hidden");
  }
  document.body.classList.remove("modal-open");
};

const formatDate = (iso) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const openNoteModal = (note) => {
  if (!noteModal) return;

  if (noteModalMessage) {
    noteModalMessage.textContent = note.message || "";
  }

  if (noteModalTo) {
    const name = (note.recipient || "You").slice(0, 20);
    noteModalTo.textContent = `To, ${name}`;
  }

  if (noteModalDate && note.created_at) {
    noteModalDate.textContent = formatDate(note.created_at);
  }

  noteModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
};

const closeNoteModal = () => {
  if (!noteModal) return;
  noteModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
};

const createNoteCard = (note) => {
  const card = document.createElement("article");
  card.className = "note-card";

  const dateEl = document.createElement("span");
  dateEl.className = "note-date";
  dateEl.textContent = formatDate(note.created_at);

  const toLine = document.createElement("div");
  toLine.className = "note-meta";
  const name = (note.recipient || "You").slice(0, 10);
  toLine.textContent = `To, ${name}`;

  const message = document.createElement("p");
  message.className = "note-message";
  message.textContent = note.message;

  card.appendChild(dateEl);
  card.appendChild(toLine);
  card.appendChild(message);

  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Read note for ${name}`);

  card.addEventListener("click", () => openNoteModal(note));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openNoteModal(note);
    }
  });

  return card;
};

const renderNotes = (notes) => {
  notesGrid.innerHTML = "";
  if (!notes.length) {
    if (emptyStateText) {
      const query = searchInput.value.trim();
      emptyStateText.textContent = query
        ? "No notes for that name. Try clearing the search."
        : "Be the first one to write a letter.";
    }
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");
  notes.forEach((note) => notesGrid.appendChild(createNoteCard(note)));
};

const loadNotes = async () => {
  if (!window.__supabaseClient) {
    setStatus("Supabase not loaded. Check your server or env.json.", true);
    renderNotes([]);
    return;
  }
  const query = searchInput.value.trim();
  let request = window.__supabaseClient
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    request = request.ilike("recipient", `%${query}%`);
  }

  const { data, error } = await request;
  if (error) {
    setStatus(`Could not load notes: ${formatSupabaseError(error)}`, true);
    return;
  }

  renderNotes(data || []);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Submitting...");

  const message = messageInput.value.trim();
  const recipient = toInput.value.trim();

  if (!recipient) {
    setStatus("Please enter a name.", true);
    return;
  }

  if (!message) {
    setStatus("Please enter a message.", true);
    return;
  }

  if (message.length > 200) {
    setStatus("Please keep the message under 200 characters.", true);
    return;
  }

  if (!window.__supabaseClient) {
    setStatus("Supabase not loaded. Check your server or env.json.", true);
    return;
  }

  const { error } = await window.__supabaseClient.from(TABLE_NAME).insert([
    {
      message,
      recipient,
    },
  ]);

  if (error) {
    setStatus(`Submission failed: ${formatSupabaseError(error)}`, true);
    return;
  }

  form.reset();
  setStatus("Message submitted.");
  const toggleBtn = document.getElementById("toggle-form");
  if (toggleBtn && form) {
    form.style.display = "none";
    toggleBtn.textContent = "Write a note";
  }
  await loadNotes();
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchInput._debounce);
  searchInput._debounce = window.setTimeout(loadNotes, 350);
});

refreshBtn.addEventListener("click", loadNotes);
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    loadNotes();
  });
}

if (acceptRulesBtn) {
  acceptRulesBtn.addEventListener("click", acceptRules);
}

if (noteModalClose) {
  noteModalClose.addEventListener("click", closeNoteModal);
}

if (noteModal) {
  noteModal.addEventListener("click", (event) => {
    if (event.target === noteModal) {
      closeNoteModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNoteModal();
  }
});

const loadEnv = async () => {
  if (window.__ENV) return window.__ENV;
  try {
    const response = await fetch("env.json");
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
};

const init = async () => {
  showSetupHint();
  const env = await loadEnv();
  if (env && env.SUPABASE_URL && env.SUPABASE_ANON_KEY && window.supabase) {
    window.__supabaseClient = window.supabase.createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );
  } else {
    setStatus("Missing env.json keys. Run server.js and reload.", true);
  }
  showRulesIfNeeded();
  loadNotes();
};

init();
