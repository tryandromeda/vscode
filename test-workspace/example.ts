// TypeScript test file for Andromeda
interface User {
    id: number;
    name: string;
    email?: string;
}

function processUser(user: User): void {
    // Empty function should trigger warning
}

let count: number = 0;
count = "string"; // Type error should be caught

class DataProcessor {
    private data: any[] = [];
    
    addItem(item: any): void {
        this.data.push(item);
    }
    
    getCount(): number {
        return this.data.length;
    }
}

// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Union types
type Status = "pending" | "completed" | "failed";

function updateStatus(status: Status) {
    switch (status) {
        case "pending":
            console.log("Processing...");
            break;
        case "completed":
            console.log("Done!");
            break;
        // Missing "failed" case should be caught
    }
}

// Async/await with types
async function fetchUserData(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch user ${id}`);
    }
    return response.json() as User;
}
