import crypto from 'crypto'

const algorithm = "aes-256-cbc";
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv(
        algorithm,
        secretKey,
        iv
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};


export const decrypt = (encryptedText: string) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        iv
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};