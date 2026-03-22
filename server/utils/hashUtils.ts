import bcrypt from 'bcrypt';
// Async: since JavaScript is single-threaded
// await pauses only that function, not the whole program
// it allows other operations to run while waiting for the hash to complete

// Promise: is an object as an placeholder value that will be available in the future
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of rounds to generate the salt
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
    return await bcrypt.hash(password, salt); // Hash the password with the salt
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
export { hashPassword, comparePassword };
