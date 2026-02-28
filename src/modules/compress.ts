import { pack, unpack } from "erlpack";
import { err } from "modules/logger";
import type { GatewayClientData, GatewayDispatchEvent, GatewayOp } from "classes/gateway";
import type { Deflate } from "fast-zlib";

export type GatewayEncoding = "etf" | "json";
export type GatewayCompress = "none" | "zlib-stream" | "zstd-stream";

export function compressZlib(deflate: Deflate, data: Buffer<ArrayBuffer>) {
    try { return deflate.process(data); }
    catch (e) { err(`Couldn't compress package with Zlib: ${e}`); return null; }
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
    options: { compress: GatewayCompress, zlibDeflate: Deflate, encoding: GatewayEncoding },
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
            const zlib = await compressZlib(options.zlibDeflate, packetBuffer);
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