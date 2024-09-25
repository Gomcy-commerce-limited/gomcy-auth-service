

const generateUniqueUsername = (prefix = "") => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789-_';
    const randomLength = Math.floor(Math.random() * 6) + 4; // Random length between 4 and 9

    let username = prefix;
    for (let i = 0; i < randomLength; i++) {
        username += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }

    return username;
};

export default generateUniqueUsername;