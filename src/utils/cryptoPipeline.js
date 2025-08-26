import crypto from 'node:crypto';


var vernam_key = "";

// --- STEP 1: Preprocessing ---
const preprocess = (text) => {
  return text.replace(/ /g, "~");
};

const postprocess = (text) => {
  return text.replace(/~/g, " ");
};

// --- STEP 2: Caesar-Monoalphabetic Cipher ---
const caesarEncrypt = (text, shift = 3) => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
};

const caesarDecrypt = (text, shift = 3) => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char >= 'a' ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
};


// --- STEP 3: Swap #1 (Adjacent Character Swap) ---
const swapAdjacent = (text) => {
  let chars = text.split("");
  for (let i = 0; i < chars.length - 1; i += 2) {
    [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
  }
  return chars.join("");
};

const unswapAdjacent = swapAdjacent; // Swapping twice restores original

// --- STEP 4: SplitMorph (Group characters into 5 groups) ---
const splitMorph = (text) => {
  const groups = [[], [], [], [], []];
  for (let i = 0; i < text.length; i++) {
    groups[i % 5].push(text[i]);
  }
  return groups.map((g) => g.join("")).join("|");
};

const unsplitMorph = (text) => {
  const parts = text.split("|");
  const maxLength = Math.max(...parts.map((p) => p.length));
  let result = "";
  for (let i = 0; i < maxLength; i++) {
    for (let j = 0; j < 5; j++) {
      if (parts[j][i]) result += parts[j][i];
    }
  }
  return result;
};

export const encrypt = (plaintext) => {
  const replaced = preprocess(plaintext);
  const caesar = caesarEncrypt(replaced);
  const swapped = swapAdjacent(caesar);
  const morphed = splitMorph(swapped);
  return morphed;
};

export const decrypt = (ciphertext) => {
  const unmorphed = unsplitMorph(ciphertext);
  const unswapped = unswapAdjacent(unmorphed);
  const decrypted = caesarDecrypt(unswapped);
  const restored = postprocess(decrypted);
  return restored;
};


// --- STEP 5: Vernam ---
const generateVernamKey = (length) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const vernamEncrypt = (plaintext) => {
	vernam_key = generateVernamKey(plaintext.length);

	const stringToBinary = (text) =>
		text.split('').map(char =>
			char.charCodeAt(0).toString(2).padStart(8, '0')
		).join('');

	const binaryText = stringToBinary(plaintext);
	const binaryKey = stringToBinary(vernam_key);

	const xorBinary = [...binaryText].map((bit, i) =>
		bit === binaryKey[i] ? '0' : '1'
	).join('');

	let binaryResult = "";
	for (let i = 0; i < xorBinary.length; i += 8) {
		const byte = xorBinary.slice(i, i + 8);
		binaryResult += String.fromCharCode(parseInt(byte, 2));
	}

	return binaryResult;
};

const vernamDecrypt = (ciphertext) => {
	const stringToBinary = (text) =>
		text.split('').map(char =>
			char.charCodeAt(0).toString(2).padStart(8, '0')
		).join('');

	const binaryCipher = stringToBinary(ciphertext);

	const binaryKey = stringToBinary(vernam_key);

	const xorBinary = [...binaryCipher].map((bit, i) =>
		bit === binaryKey[i] ? '0' : '1'
	).join('');

	let plaintext = "";
	for (let i = 0; i < xorBinary.length; i += 8) {
		const byte = xorBinary.slice(i, i + 8);
		plaintext += String.fromCharCode(parseInt(byte, 2));
	}

	vernam_key = "";
	return plaintext;
};

// vernam test
// const encrypted = vernamEncrypt("test");
// console.log("Encrypted:", encrypted);

// const decrypted = vernamDecrypt(encrypted);
// console.log("Decrypted:", decrypted);


// --- STEP 6: Transposition ---
const transpositionEncrypt = (text, keyword) => {
	const numCols = keyword.length;
	const numRows = Math.ceil(text.length / numCols);

	let matrix = Array.from({ length: numRows }, () => Array(numCols).fill(' '));
	for (let i = 0; i < text.length; i++) {
		const row = Math.floor(i / numCols);
		const col = i % numCols;
		matrix[row][col] = text[i];
	}

	const sortedKey = [...keyword].map((char, i) => ({ char, index: i }))
		.sort((a, b) => a.char.localeCompare(b.char));

	let result = '';
	for (const { index } of sortedKey) {
		for (let row = 0; row < numRows; row++) {
			result += matrix[row][index];
		}
	}

	return result;
};

const transpositionDecrypt = (ciphertext, keyword) => {
	const numCols = keyword.length;
	const numRows = Math.ceil(ciphertext.length / numCols);
	const numFullCols = ciphertext.length % numCols;
	const sortedKey = [...keyword].map((char, i) => ({ char, index: i }))
		.sort((a, b) => a.char.localeCompare(b.char));

	let colLengths = Array(numCols).fill(numRows);
	if (numFullCols !== 0) {
		for (let i = numFullCols; i < numCols; i++) colLengths[sortedKey[i].index]--;
	}

	let matrix = Array(numCols).fill().map(() => []);
	let pointer = 0;
	for (const { index } of sortedKey) {
		for (let i = 0; i < colLengths[index]; i++) {
			matrix[index].push(ciphertext[pointer++]);
		}
	}

	let result = '';
	for (let row = 0; row < numRows; row++) {
		for (let col = 0; col < numCols; col++) {
			if (matrix[col][row]) result += matrix[col][row];
		}
	}

	return result;
};

// test
// const keyword = "LOCK";

// const encrypted = transpositionEncrypt("hello", keyword);
// console.log("Encrypted:", encrypted);

// const decrypted = transpositionDecrypt(encrypted, keyword);
// console.log("Decrypted:", decrypted);


// --- STEP 6: Transposition ---
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});


const rsaEncrypt = (message, pubKey) => {
	return crypto.publicEncrypt(pubKey, Buffer.from(message));
};
const rsaDecrypt = (encryptedBuffer, privKey) => {
	return crypto.privateDecrypt(privKey, encryptedBuffer).toString();
};

// test
// const message = "hello";
// const encrypted = rsaEncrypt(message, publicKey);
// console.log("Encrypted (Base64):", encrypted.toString('base64'));

// const decrypted = rsaDecrypt(encrypted, privateKey);
// console.log("Decrypted:", decrypted);
