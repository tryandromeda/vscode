// Test file for Andromeda VS Code Extension features
// This file demonstrates the enhanced capabilities

// Andromeda File System API usage
const content = Andromeda.readTextFileSync("./package.json");
Andromeda.writeTextFileSync("./output.txt", content);

// Web Crypto API
const data = new TextEncoder().encode("Hello, World!");
crypto.subtle.digest("SHA-256", data).then(hash => {
  console.log("Hash computed:", hash);
});

// Canvas API
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#ff6b6b";
ctx.fillRect(50, 50, 100, 100);

// Performance API
const start = performance.now();
// Some operation...
const duration = performance.now() - start;
console.log("Operation took:", duration, "ms");

// Web Storage API
localStorage.setItem("key", "value");
const value = localStorage.getItem("key");

// Database operations
const db = new Database(":memory:");
db.prepare("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)").run();

// Console methods with enhanced completions
console.log("Debug info");
console.warn("Warning message");
console.error("Error occurred");
console.table([{ name: "John", age: 30 }]);

// Environment operations
const homeDir = Andromeda.env.get("HOME");
Andromeda.env.set("TEST_VAR", "test_value");

// Process operations
console.log("Arguments:", Andromeda.args);
// Andromeda.exit(0); // Uncomment to exit

// Example of issues that can be auto-fixed:
var oldStyle = "should be let or const"; // Should suggest const
let unusedVariable = "not used"; // Should warn about unused variable
function emptyFunction() {} // Should warn about empty function
let camelcase_issue = "bad naming"; // Should suggest camelCase

// Strict equality issues
if (value == "test") { // Should suggest === instead of ==
  console.log("Equal");
}
