import bcrypt from 'bcrypt';

const saltRounds = 10; // complexity level for hashing


const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash; 
    } catch (err) {
        throw new Error('Error hashing password: ' + err.message);
    }
};

const comparePassword = async (enteredPassword, storedHash) => {
    try {
        const match = await bcrypt.compare(enteredPassword, storedHash);
        return match; 
    } catch (err) {
        throw new Error('Error comparing passwords: ' + err.message);
    }
};

export default {hashPassword,comparePassword};
