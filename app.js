// Main Function
//------------------------------------------------------------------------------------------------

// Set events
document.getElementById("generate_button").addEventListener("click", processOutput);

// Set labels for boxes
const playerNameInputBoxLabel = "Player Names";
document.getElementById("playerNameInputBoxLabel").textContent = playerNameInputBoxLabel;

const roleInputBoxLabel = "Squads And Roles";
document.getElementById("roleInputBoxLabel").textContent = roleInputBoxLabel;

// Set boxes with default data
const playerNames = [
    "// Enter each player's name on a separate line",
    "",
    "Emma",
    "Noah",
    "Lila",
    "Ethan",
    "Sofia",
    "Liam",
    "Ava",
    "Oliver"
];
const playerNameString = playerNames.join("\n");
document.getElementById("playerNameInputBox").value = playerNameString;

const roles = [
    "// Create squads using the '#' symbol",
    "",
    "#Alpha Squad",
    "Squad Leader",
    "Grenadier",
    "Rifleman",
    "Medic",
    "",
    "#Bravo Squad",
    "Squad Leader",
    "Grenadier",
    "Rifleman",
    "Engineer"
];
const roleString = roles.join("\n");
document.getElementById("availableClassesInputBox").value = roleString;

// Load saved data from localStorage
loadSavedData();

// Process Initial Output
processOutput();

// FUNCTIONS
//------------------------------------------------------------------------------------------------
function isCommentOrEmpty(line) {
    return line.startsWith("//") || line.trim() === "";
}

function parseNames(inputText) {
    let lines = inputText.split("\n")
    let names = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (!(trimmedLine.startsWith("//", 0) || trimmedLine === "")) {
            names.push(trimmedLine);
        }
    }

    console.log("Parsed Text:", names);
    return names;
}

function parseRoles(inputText) {
    let lines = inputText.split("\n")
    let roles = [];
    let squads = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (isCommentOrEmpty(trimmedLine)) {
            continue;
        }
        if (trimmedLine.startsWith("#")) {
            const trimmed = trimmedLine.substring(1).trim();
            squads.push(trimmed);
        }
        roles.push(trimmedLine)
    }

    console.log(squads);
    console.log(roles);

    let returnArray = [squads, roles];
    return returnArray;
}

function processOutput() {

    function processInput(textareaID, parseFunction) {
        console.log(`Parsing input for: ${textareaID}`);
        const textarea = document.getElementById(textareaID);
        const inputText = textarea.value;

        return parseFunction(inputText);
    }

    // Process names
    const names = processInput("playerNameInputBox", parseNames);

    // Process roles and squads
    let rolesAndSquads = processInput("availableClassesInputBox", parseRoles);
    const squads = rolesAndSquads[0];
    const roles = rolesAndSquads[1];

    // Exit early if there are uneven roles and names
    if (names.length !== roles.filter(item => item !== "" && !item.startsWith("#")).length) {
        const roleCount = roles.filter(item => item !== "" && !item.startsWith("#")).length;
        console.log("Uneven amount of names and roles!");
        console.log("Names:", names, names.length)
        console.log("Roles:", roles, roleCount);

        Swal.fire({
            icon: "error",
            title: "Uneven Names and Roles!",
            html: `Names: ${names.length}<br>Roles: ${roleCount}`,
            width: "70%",
            background: "#000000",
        });
        return;
    }

    console.log("Processing complete!");
    console.log("Squads:", squads);
    console.log("Roles:", roles)
    console.log("Names:", names);

    // Lets build our squads now
    const squadDictionary = {};

    squads.forEach(_x => {
        squadDictionary[_x] = [];
    });

    // Assign names to roles
    let squadIndex = -1;
    roles.forEach((role, index) => {
        if (role.startsWith("#")) {
            squadIndex++;
            return;
        }

        const randomNameIndex = Math.floor(Math.random() * names.length);
        const randomName = names.splice(randomNameIndex, 1)[0];

        squadDictionary[squads[squadIndex]].push({
            name: randomName, role
        });

        squadIndex = (squadIndex + 1) % squads.length;
    });

    console.log(squadDictionary);

    // Build the output string
    let squadString = "";

    const squadKeys = Object.keys(squadDictionary);

    for (const squad of squadKeys) {
        if (squadString !== "") {
            squadString += "\n";
        }
        squadString += `${squad}\n`;

        squadDictionary[squad].forEach(member => {
            squadString += `    ${member.name} - ${member.role}\n`;
        });
    }

    console.log(squadString);

    // Set the output string to the box
    document.getElementById("squadOutputBox").value = squadString;

    // Save all of the users data
    saveDataToLocalStorage();
}

function loadSavedData() {
    const savedPlayerNames = localStorage.getItem("playerNames");
    const savedRoles = localStorage.getItem("roles");

    if (savedPlayerNames) {
        document.getElementById("playerNameInputBox").value = savedPlayerNames;
        console.log("Loaded player names from localStorage.");
    }

    if (savedRoles) {
        document.getElementById("availableClassesInputBox").value = savedRoles;
        console.log("Loaded roles from localStorage.");
    }
}

function saveDataToLocalStorage() {
    const playerNames = document.getElementById("playerNameInputBox").value;
    const roles = document.getElementById("availableClassesInputBox").value;

    localStorage.setItem("playerNames", playerNames);
    localStorage.setItem("roles", roles);

    console.log("Data saved to localStorage.");
    console.log("Player Names", localStorage.getItem("playerNames"));
    console.log("Roles", localStorage.getItem("roles"));
}