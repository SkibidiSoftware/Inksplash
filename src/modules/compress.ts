import { pack, unpack } from "erlpack";
import { err } from "modules/logger";
import type { GatewayDispatchEvent, GatewayOp } from "modules/socket";
import { constants, deflateSync } from "zlib";

export type GatewayEncoding = "etf" | "json";
export type GatewayCompress = "none" | "zlib-stream" | "zstd-stream";

export function compressZlib(data: Buffer<ArrayBuffer>) {
    return deflateSync(data, { finishFlush: constants.Z_SYNC_FLUSH });
}

export function compressZstd(data: Buffer<ArrayBuffer>) {
    try { return Bun.zstdCompress(data); }
    catch (e) { err(`Couldn't compress package with Zstd: ${e}`); return null; }
}

export function compressEtf(data: unknown) {
    try { return pack(data); }
    catch (e) { err(`Couldn't compress package with erlpack: ${e}`); return null; }
}

export function decompressEtf(data: Buffer<ArrayBuffer>) {
    try { return unpack(data); }
    catch (e) { err(`Couldn't decompress package with erlpack: ${e}`); return null; }
}

// packets
export async function constructPacket<T>(
    options: { compress: GatewayCompress, encoding: GatewayEncoding },
    op: GatewayOp,
    data: T,
    eventType: GatewayDispatchEvent | null = null,
    sequence: number | null = null
) {
    let packetRawData = { op, d: data, t: eventType, s: sequence };
    let packetBuffer: Buffer<ArrayBuffer>;

    switch (options.encoding) {
        case "etf": {
            const etf = compressEtf(packetRawData);
            if (!etf) {
                err("Etf compression fault!");
                return null;
            }

            packetBuffer = Buffer.from(etf);
            break;
        }

        case "json": {
            packetBuffer = Buffer.from(JSON.stringify(packetRawData));
            break;
        }
    }

    switch (options.compress) {
        case "zlib-stream": {
            const zlib = await compressZlib(packetBuffer);
            if (!zlib) {
                err("Zlib compression fault!");
                return null;
            }

            packetBuffer = Buffer.from(zlib);
            break;
        }

        case "zstd-stream": {
            const zstd = await compressZstd(packetBuffer);
            if (!zstd) {
                err("Zstd compression fault!");
                return null;
            }

            packetBuffer = Buffer.from(zstd);
            break;
        }
    }

    return packetBuffer;
}

export async function receivePacket<T>(
    options: { encoding: GatewayEncoding },
    data: string | Buffer
): Promise<T | null> {
    switch (options.encoding) {
        case "json": {
            try { return JSON.parse(data.toString()) as T; }
            catch (e) { err(`Failed to parse JSON packet: ${e}`); return null; }
        }

        case "etf": {
            // todo
            return null;
        }
    }
}