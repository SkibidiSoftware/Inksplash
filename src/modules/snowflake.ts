import { DISCORD_EPOCH } from "modules/constants";

export interface SnowflakeOptions {
    timestamp?: number;
    workerId?: number;
    processId?: number;
    sequence?: number;
}

let globalSequence = 0;
export function generateSnowflake(options: SnowflakeOptions = {}) {
    const timestamp = options.timestamp ?? Date.now();
    const workerId = options.workerId ?? 1;
    const processId = options.processId ?? 0;
    const sequence = options.sequence ?? ++globalSequence;
    
    return (
        ((BigInt(timestamp) - BigInt(DISCORD_EPOCH)) << BigInt(22)) |
        (BigInt(workerId) << BigInt(17)) |
        (BigInt(processId) << BigInt(12)) |
        BigInt(sequence)
    ).toString();
}

export function generateRandomCode(length: number = 32) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    let code = "";
    for (let i = 0; i < length; i++)
        code += chars[Math.floor(Math.random() * chars.length)];

    return code;
}