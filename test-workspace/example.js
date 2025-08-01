// Test file for Andromeda VS Code extension
function emptyFunction() {
    // This should trigger a lint warning
}

var unusedVariable = "not used anywhere";

function problemFunction() {
    // Empty statement
    if (true) {
        return "early return";
    }
    console.log("unreachable code");
}

// Test different syntax patterns
const obj = {
    name: "test",
    getValue: function () {
        return this.value || 42;
    },
};

// Async function
async function fetchData() {
    try {
        const response = await fetch("/api/data");
        return response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}
