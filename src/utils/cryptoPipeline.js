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