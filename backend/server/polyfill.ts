import crypto from 'crypto';

// Polyfill globalThis.crypto for Node.js environments where it is not defined (e.g. Node 18 or older)
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: crypto.webcrypto || crypto,
    writable: true,
    configurable: true,
  });
}
