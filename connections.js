const groups = [
    ["Dubai", "Nepal", "Kazakhstan", "Switzerland"],      // Fruits
    ["Coloring", "Singing", "Praying", "Playing Guitar"],              // Animals
    ["Business", "Leading", "Swimming", "Cooking"],          // Colors
    ["Coimbatore", "Trichy", "Baroda", "Mumbai"]              // Vehicles
];

const categories = [
    "International Destinations Travelled Together",
    "Ida's Hobbies & Interests",
    "Alex's Talents & Skills",
    "Places Travelled in India Together"
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let allWords, selected, foundWords, foundGroups, foundGroupsCount;

function initializeGame() {
    allWords = groups.flat();
    shuffle(allWords);
    selected = [];
    foundWords = new Set();
    foundGroups = [];
    foundGroupsCount = 0;
    document.getElementById('submit').disabled = false;
    document.getElementById('message').textContent = '';
    renderGrid();
}

const grid = document.getElementById('grid');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submit');
const restartBtn = document.getElementById('restart');

// Render grid with found groups at the top, showing category
function renderGrid() {
    grid.innerHTML = '';
    // Render found groups (each as a row with category)
    foundGroups.forEach(({group, index}) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'category-label';
        catDiv.textContent = categories[index];
        catDiv.style.gridColumn = 'span 4';
        grid.appendChild(catDiv);
        group.forEach(word => {
            const div = document.createElement('div');
            div.className = 'word found';
            div.textContent = word;
            grid.appendChild(div);
        });
    });
    // Render remaining words (not found)
    const remainingWords = allWords.filter(word => !foundWords.has(word));
    remainingWords.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word';
        div.textContent = word;
        if (selected.includes(word)) div.classList.add('selected');
        div.onclick = () => selectWord(word);
        grid.appendChild(div);
    });
}

function selectWord(word) {
    if (foundWords.has(word)) return;
    if (selected.includes(word)) {
        selected = selected.filter(w => w !== word);
    } else if (selected.length < 4) {
        selected.push(word);
    }
    renderGrid();
}

submitBtn.onclick = () => {
    if (selected.length !== 4) {
        message.textContent = "Select 4 words!";
        return;
    }
    let matched = false;
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (
            group.every(word => selected.includes(word)) &&
            !foundGroups.some(g => g.group.every(w => group.includes(w)))
        ) {
            matched = true;
            group.forEach(word => foundWords.add(word));
            foundGroups.push({group, index: i});
            foundGroupsCount++;
            message.textContent = `Group found! (${foundGroupsCount}/4) 💖`;
            break;
        }
    }
    if (!matched) {
        message.textContent = "Not a correct group. Try again!";
    }
    selected = [];
    renderGrid();
    if (foundGroupsCount === 4) {
        message.textContent = "Congratulations! You found all groups! 🎉";
        submitBtn.disabled = true;
    }
};

restartBtn.onclick = () => {
    initializeGame();
};

initializeGame();