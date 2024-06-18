document.addEventListener("DOMContentLoaded", () => {
    const addBox = document.querySelector(".add-box"),
        popupBox = document.querySelector(".popup-box"),
        popupTitle = popupBox.querySelector("header p"),
        closeIcon = popupBox.querySelector(".close-btn"),
        titleTag = document.querySelector("#title"),
        descTag = document.querySelector("#description"),
        addBtn = popupBox.querySelector("button"),
        notesWrapper = document.querySelector(".notes-wrapper");

    let isUpdate = false, updateId;

    addBox.addEventListener("click", () => {
        popupTitle.innerText = "Add a new Note";
        addBtn.innerText = "Add Note";
        popupBox.classList.add("show");
        document.querySelector("body").style.overflow = "hidden";
        if (window.innerWidth > 660) titleTag.focus();
    });

    closeIcon.addEventListener("click", () => {
        isUpdate = false;
        titleTag.value = descTag.value = "";
        popupBox.classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
    });

    async function fetchNotes() {
        const res = await fetch('/api/notes');
        const notes = await res.json();
        displayNotes(notes);
    }

    function displayNotes(notes) {
        notesWrapper.innerHTML = '';
        notes.forEach((note) => {
            let filterDesc = note.description.replaceAll("\n", '<br/>');
            let liTag = `<li class="note" data-id="${note._id}">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${filterDesc}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${note.date}</span>
                                <div class="settings">
                                    <button class="menu-btn" onclick="updateNote('${note._id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</button>
                                    <button class="menu-btn" onclick="deleteNote('${note._id}')"><i class="uil uil-trash"></i>Delete</button>
                                </div>
                            </div>
                        </li>`;
            notesWrapper.insertAdjacentHTML("beforeend", liTag);
        });
    }

    window.deleteNote = async function(noteId) {
        if (confirm("Are you sure you want to delete this note?")) {
            await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
            fetchNotes();
        }
    }

    window.updateNote = function(noteId, title, filterDesc) {
        let description = filterDesc.replaceAll('<br/>', '\r\n');
        updateId = noteId;
        isUpdate = true;
        addBox.click();
        titleTag.value = title;
        descTag.value = description;
        popupTitle.innerText = "Update a Note";
        addBtn.innerText = "Update Note";
    }

    document.querySelector("#note-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = titleTag.value.trim(),
            description = descTag.value.trim();

        if (title && description) {
            const currentDate = new Date(),
                month = currentDate.toLocaleString('default', { month: 'long' }),
                day = currentDate.getDate(),
                year = currentDate.getFullYear(),
                noteInfo = { title, description, date: `${month} ${day}, ${year}` };

            if (!isUpdate) {
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteInfo)
                });
            } else {
                await fetch(`/api/notes/${updateId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteInfo)
                });
                isUpdate = false;
            }
            fetchNotes();
            closeIcon.click();
        }
    });

    fetchNotes();
});
