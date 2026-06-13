import crypto from 'crypto';

console.log('--- POLYFILL DEBUG ---');
console.log('Node version:', process.version);
console.log('typeof globalThis.crypto:', typeof globalThis.crypto);

if (typeof globalThis.crypto === 'undefined') {
  try {
    // Try simple assignment first
    // @ts-ignore
    globalThis.crypto = crypto.webcrypto || crypto;
    console.log('Polyfilled globalThis.crypto via simple assignment');
  } catch (err: any) {
    console.log('Simple assignment failed, trying defineProperty. Error:', err.message);
    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: crypto.webcrypto || crypto,
        writable: true,
        configurable: true,
      });
      console.log('Polyfilled globalThis.crypto via defineProperty');
    } catch (defErr: any) {
      console.error('All polyfill attempts failed:', defErr.message);
    }
  }
}

console.log('Final typeof globalThis.crypto:', typeof globalThis.crypto);
console.log('----------------------');
