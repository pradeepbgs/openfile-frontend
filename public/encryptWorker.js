

// public/encryptWorker.js

self.onmessage = async function (e) {
  const { fileData } = e.data;

  // Example: simulate heavy CPU-bound encryption
  const encrypted = fakeEncrypt(fileData); // Replace with real encryption

  self.postMessage({ encrypted });
};

function fakeEncrypt(data) {
  // Simulate CPU work
  let result = 0;
  for (let i = 0; i < 1e8; i++) {
    result += i % 3;
  }
  return `encrypted-${data}`;
}
