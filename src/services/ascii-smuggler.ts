// ASCII Smuggler: Encode/decode invisible instructions using Unicode tag characters
// See: https://www.promptfoo.dev/docs/red-team/plugins/ascii-smuggling/

const TAG_BASE = 0xE0000;
const TAG_MIN = TAG_BASE + 0x20; // Space
const TAG_MAX = TAG_BASE + 0x7E; // '~'

import { stripThinkTags } from './payload-utils'

/**
 * Encodes a string into Unicode tag characters (invisible in most UIs).
 * Strips <think>...</think> tags before encoding.
 */
export function encodeToTagChars(input: string): string {
  const clean = stripThinkTags(input)
  return Array.from(clean)
    .map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 0x20 && code <= 0x7E) {
        return String.fromCodePoint(TAG_BASE + code);
      }
      return ch;
    })
    .join('');
}

/**
 * Decodes a string from Unicode tag characters back to ASCII.
 */
export function decodeFromTagChars(tagged: string): string {
  return Array.from(tagged)
    .map(ch => {
      const code = ch.codePointAt(0)!;
      if (code >= TAG_MIN && code <= TAG_MAX) {
        return String.fromCharCode(code - TAG_BASE);
      }
      return ch;
    })
    .join('');
}

/**
 * Encodes a string using zero-width binary encoding:
 * - Start: U+200B
 * - 0: U+200C
 * - 1: U+2063
 * - End: U+200D
 * See: https://www.promptfoo.dev/blog/invisible-unicode-threats/
 */
export function encodeWithZeroWidth(input: string): string {
  const ZWSP = '\u200B'; // Start
  const ZWNJ = '\u200C'; // 0
  const INVSEP = '\u2063'; // 1
  const ZWJ = '\u200D'; // End
  let encoded = ZWSP;
  for (const ch of input) {
    const bin = ch.charCodeAt(0).toString(2).padStart(8, '0');
    for (const bit of bin) {
      encoded += bit === '0' ? ZWNJ : INVSEP;
    }
  }
  encoded += ZWJ;
  return encoded;
}

/**
 * Decodes a zero-width binary encoded string (for testing/validation).
 */
export function decodeFromZeroWidth(encoded: string): string {
  const ZWSP = '\u200B';
  const ZWNJ = '\u200C';
  const INVSEP = '\u2063';
  const ZWJ = '\u200D';
  // Remove start/end markers
  let core = encoded;
  if (core.startsWith(ZWSP)) core = core.slice(1);
  if (core.endsWith(ZWJ)) core = core.slice(0, -1);
  // Convert to binary string
  let bin = '';
  for (const ch of core) {
    if (ch === ZWNJ) bin += '0';
    else if (ch === INVSEP) bin += '1';
  }
  // Split into bytes and decode
  let out = '';
  for (let i = 0; i < bin.length; i += 8) {
    const byte = bin.slice(i, i + 8);
    if (byte.length === 8) {
      out += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return out;
}

/**
 * Encodes a string using only ASCII control characters (char codes 1 and 2 for bits 0 and 1).
 * Each character is converted to 8 bits, each bit is mapped to a control character.
 * The result is a fully invisible string.
 * Strips <think>...</think> tags before encoding.
 */
export function encodeWithAsciiControl(input: string): string {
  const clean = stripThinkTags(input)
  let encoded = ''
  for (const ch of clean) {
    const bin = ch.charCodeAt(0).toString(2).padStart(8, '0')
    for (const bit of bin) {
      encoded += bit === '0' ? String.fromCharCode(1) : String.fromCharCode(2)
    }
  }
  return encoded
}

/**
 * Decodes a string from ASCII control character encoding (char codes 1 and 2 for bits 0 and 1).
 */
export function decodeWithAsciiControl(input: string): string {
  let bin = ''
  for (const ch of input) {
    if (ch.charCodeAt(0) === 1) bin += '0'
    else if (ch.charCodeAt(0) === 2) bin += '1'
  }
  let decoded = ''
  for (let i = 0; i < bin.length; i += 8) {
    const byte = bin.slice(i, i + 8)
    if (byte.length === 8) {
      decoded += String.fromCharCode(parseInt(byte, 2))
    }
  }
  return decoded
} 