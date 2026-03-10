const crypto = require('crypto');

/**
 * Generate hash for images or files
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {String} SHA256 hash
 */
const generateFileHash = (fileBuffer) => {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

/**
 * Similarity percentage between two strings
 * Uses Levenshtein distance algorithm
 * @param {String} str1 - First string
 * @param {String} str2 - Second string
 * @returns {Number} Similarity percentage (0-100)
 */
const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  const editDistance = getEditDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
};

/**
 * Calculate Levenshtein distance
 * @param {String} s1
 * @param {String} s2
 * @returns {Number}
 */
const getEditDistance = (s1, s2) => {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

module.exports = {
  generateFileHash,
  calculateSimilarity,
  getEditDistance
};
