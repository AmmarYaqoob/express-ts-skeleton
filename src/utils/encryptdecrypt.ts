import { compare, genSalt, hash } from "bcryptjs";

export const encrypt = async (value: string): Promise<string> => {
    const salt = await genSalt(10);
    return hash(value, salt);
};

export const compareHash = async (
    value: string,
    hashValue: string
): Promise<boolean> => {
    try {
        return await compare(value, hashValue);
    } catch {
        return false;
    }
};