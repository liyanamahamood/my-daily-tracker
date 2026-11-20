
// ===================================
// GET TODAY'S DATE
// ===================================

const today = new Date();

document.getElementById("today-date").textContent =
    today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

const dateKey = today.toLocaleDateString("en-CA");


// ===================================
// LOAD SAVED TASKS AND PRAYERS
// ===================================

let tasks = JSON.parse(localStorage.getItem("tasks-" + dateKey)) || [];

let prayers = JSON.parse(localStorage.getItem("prayers-" + dateKey)) || {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
};


// ===================================
// SAVE TASKS
// ===================================

function saveTasks() {
    localStorage.setItem("tasks-" + dateKey, JSON.stringify(tasks));
}


// ===================================
// UPDATE DAILY PROGRESS
// ===================================

function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const completedPrayers = Object.values(prayers).filter(Boolean).length;

    const totalItems = tasks.length + 5;
    const completedItems = completedTasks + completedPrayers;

    const percentage = Math.round((completedItems / totalItems) * 100);

    document.getElementById("progress-percent").textContent =
        percentage + "%";

    document.getElementById("progress-fill").style.width =
        percentage + "%";

    let message = "Every little step counts. Keep blooming! 🌱";

    if (percentage === 100) {
        message = "You did it! What a beautiful day! 🌷";
    } else if (percentage >= 70) {
        message = "You're doing amazing. Keep going! 🌿";
    } else if (percentage >= 30) {
        message = "Look at your progress. Keep growing! ✨";
    }

    document.getElementById("progress-message").textContent = message;
}


// ===================================
// DISPLAY TASKS WITH GOLDEN EFFECT
// ===================================

function displayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed-task");
        }

        // CHECKBOX
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;

            saveTasks();
            displayTasks();
            updateProgress();
        });

        // TASK NAME
        const text = document.createElement("span");
        text.textContent = task.name;

        // GOLDEN CHECK AND SPARKLE
        const checkIcon = document.createElement("span");
        checkIcon.className = "task-check-icon";

        if (task.completed) {
            checkIcon.textContent = "✓ ✨";
        }

        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);

            saveTasks();
            displayTasks();
            updateProgress();
        });

        li.append(checkbox, text, checkIcon, deleteButton);
        taskList.appendChild(li);
    });
}


// ===================================
// ADD TASK
// ===================================

document.getElementById("add-task").addEventListener("click", () => {
    const input = document.getElementById("task-input");
    const taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        name: taskName,
        completed: false
    });

    saveTasks();
    displayTasks();
    updateProgress();

    input.value = "";
});


// ADD TASK USING ENTER

document.getElementById("task-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        document.getElementById("add-task").click();
    }
});


// ===================================
// DISPLAY SALAH TRACKER
// ===================================

function displayPrayers() {
    const prayerList = document.getElementById("prayer-list");
    prayerList.innerHTML = "";

    Object.keys(prayers).forEach(prayer => {
        const div = document.createElement("div");
        div.className = "prayer-item";

        const name = document.createElement("span");
        name.textContent = prayer;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = prayers[prayer];

        checkbox.addEventListener("change", () => {
            prayers[prayer] = checkbox.checked;

            localStorage.setItem(
                "prayers-" + dateKey,
                JSON.stringify(prayers)
            );

            updateProgress();
        });

        div.append(name, checkbox);
        prayerList.appendChild(div);
    });
}


// ===================================
// DEAR DIARY - JOURNAL FEATURE
// ===================================

// GET JOURNAL ELEMENTS

const moodEntry = document.getElementById("mood-entry");
const gratitudeEntry = document.getElementById("gratitude-entry");
const dayEntry = document.getElementById("day-entry");

const saveJournalButton = document.getElementById("save-journal");
const journalStatus = document.getElementById("journal-status");
const journalDate = document.getElementById("journal-date");


// DISPLAY JOURNAL DATE

journalDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});


// LOAD TODAY'S JOURNAL

function loadJournal() {
    const savedJournal = JSON.parse(
        localStorage.getItem("journal-" + dateKey)
    ) || {
        mood: "",
        gratitude: "",
        note: ""
    };

    moodEntry.value = savedJournal.mood || "";
    gratitudeEntry.value = savedJournal.gratitude || "";
    dayEntry.value = savedJournal.note || "";
}


// SAVE TODAY'S JOURNAL

function saveJournal() {
    const journal = {
        mood: moodEntry.value,
        gratitude: gratitudeEntry.value,
        note: dayEntry.value
    };

    localStorage.setItem(
        "journal-" + dateKey,
        JSON.stringify(journal)
    );

    journalStatus.textContent = "Your thoughts have been saved. 🌷";

    saveJournalButton.textContent = "Saved with love ✓";

    // REFRESH JOURNAL HISTORY
    displayJournalHistory();

    setTimeout(() => {
        saveJournalButton.textContent = "Save Today's Journal ✨";
    }, 2000);
}


// SAVE BUTTON

saveJournalButton.addEventListener("click", saveJournal);


// ===================================
// JOURNAL HISTORY / ARCHIVE
// ===================================

function displayJournalHistory() {
    const historyList = document.getElementById("journal-history-list");

    historyList.innerHTML = "";

    // FIND ALL SAVED JOURNAL DATES
    const journalDates = Object.keys(localStorage)
        .filter(key => key.startsWith("journal-"))
        .map(key => key.replace("journal-", ""))
        .sort((a, b) => b.localeCompare(a));

    // NO SAVED ENTRIES
    if (journalDates.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-journal";
        emptyMessage.textContent =
            "Your saved memories will appear here. 🌱";

        historyList.appendChild(emptyMessage);
        return;
    }

    // DISPLAY EACH JOURNAL ENTRY
    journalDates.forEach(date => {

        const journal = JSON.parse(
            localStorage.getItem("journal-" + date)
        );

        if (!journal) return;

        // ENTRY CARD
        const entry = document.createElement("div");
        entry.className = "journal-history-item";

        // FORMAT DATE
        const [year, month, day] = date.split("-").map(Number);

        const entryDate = new Date(year, month - 1, day);

        const heading = document.createElement("h3");

        heading.textContent = entryDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        // SHORT PREVIEW
        const preview = document.createElement("p");

        preview.textContent =
            journal.mood ||
            journal.gratitude ||
            journal.note ||
            "A quiet day in your diary.";

        // READ MORE TEXT
        const readText = document.createElement("span");

        readText.className = "read-entry";
        readText.textContent = "Read entry ↓";

        // FULL ENTRY CONTENT
        const fullEntry = document.createElement("div");

        fullEntry.style.display = "none";
        fullEntry.style.marginTop = "12px";

        // FUNCTION TO ADD EACH JOURNAL SECTION
        function addJournalPart(title, content) {

            const label = document.createElement("h4");

            label.textContent = title;
            label.style.color = "#24483E";
            label.style.marginTop = "12px";

            const paragraph = document.createElement("p");

            paragraph.textContent = content || "Not written.";

            fullEntry.append(label, paragraph);
        }

        // ADD ALL THREE REFLECTIONS
        addJournalPart("How I felt", journal.mood);
        addJournalPart("What I'm grateful for", journal.gratitude);
        addJournalPart("My day", journal.note);

        // OPEN OR CLOSE ENTRY
        entry.addEventListener("click", () => {

            const isClosed = fullEntry.style.display === "none";

            fullEntry.style.display = isClosed ? "block" : "none";

            readText.textContent = isClosed
                ? "Close entry ↑"
                : "Read entry ↓";
        });

        entry.append(heading, preview, readText, fullEntry);

        historyList.appendChild(entry);
    });
}


// ===================================
// DAILY QURAN VERSES
// ===================================

const quranVerses = [
    {
        text: "For indeed, with hardship [will be] ease.",
        reference: "Surah Ash-Sharh · 94:5"
    },
    {
        text: "Unquestionably, by the remembrance of Allah hearts are assured.",
        reference: "Surah Ar-Ra'd · 13:28"
    },
    {
        text: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
        reference: "Surah Aal-i-Imraan · 3:139"
    },
    {
        text: "Allah does not charge a soul except [with that within] its capacity.",
        reference: "Surah Al-Baqarah · 2:286"
    },
    {
        text: "And your Lord is going to give you, and you will be satisfied.",
        reference: "Surah Ad-Duhaa · 93:5"
    },
    {
        text: "And those who strive for Us - We will surely guide them to Our ways.",
        reference: "Surah Al-Ankabut · 29:69"
    }
];


// SELECT ONE VERSE EACH DAY

const startOfYear = new Date(today.getFullYear(), 0, 0);

const dayNumber = Math.floor(
    (today - startOfYear) / (1000 * 60 * 60 * 24)
);

const verseIndex = dayNumber % quranVerses.length;

const dailyVerse = quranVerses[verseIndex];


// DISPLAY QURAN VERSE

document.getElementById("quran-verse").textContent =
    dailyVerse.text;

document.getElementById("quran-reference").textContent =
    dailyVerse.reference;


// ===================================
// START THE APP
// ===================================

displayTasks();
displayPrayers();
updateProgress();

loadJournal();
displayJournalHistory();


// ===================================
// SCREEN NAVIGATION
// ===================================

const navItems = document.querySelectorAll(".nav-item");
const appScreens = document.querySelectorAll(".app-screen");

navItems.forEach(button => {

    button.addEventListener("click", () => {

        const screenId = button.dataset.screen;

        appScreens.forEach(screen => {
            screen.classList.remove("active");
        });

        document.getElementById(screenId).classList.add("active");

        navItems.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        window.scrollTo(0, 0);
    });
});
