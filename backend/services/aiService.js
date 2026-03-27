 

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let userCorrections = [];

const classifyExpense = async (title) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Classify this expense.

Return ONLY valid JSON. No markdown, no explanation.

Format:
{
  "category": "Food | Transport | Utilities | Entertainment | Healthcare | Shopping | Other",
  "tags": ["tag1", "tag2"],
  "note": "short reason"
}

Expense: ${title}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("RAW AI:", text); //  debug

    //   RESPONSE
    let cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return fallback(title);
    }

    return parsed;

  } catch (err) {
    console.log("AI Error:", err.message);
    return fallback(title);
  }
};

// fallback logic
const fallback = (title) => {
  const lower = title.toLowerCase();

  if (lower.includes("uber") ||
    lower.includes("ola") ||
    lower.includes("bus") ||
    lower.includes("train") ||
    lower.includes("flight")
    || lower.includes("rapido")) {
    return {
      category: "Transport",
      tags: ["ride"],
      note: "Detected transport-related keyword"
    };
  }

  if (
    lower.includes("food") ||
    lower.includes("swiggy") ||
    lower.includes("zomato") ||
    lower.includes("restaurant")
    || lower.includes("cafe") ||
    lower.includes("blinkit") ||
    lower.includes("grocery") ||
    lower.includes("big-basket")
  ) {
    return {
      category: "Food",
      tags: ["meal"],
      note: "Detected food-related keyword"
    };
  }

  if (lower.includes("netflix") ||
    lower.includes("subscription") ||
    lower.includes("spotify") ||
    lower.includes("prime")
    || lower.includes("sonyliv")
    || lower.includes("appletv")
    || lower.includes("youtube")
  ) {
    return {
      category: "Entertainment",
      tags: ["subscription", "streaming"],
      note: "Detected subscription-based entertainment"
    };
  }

  return {
    category: "Other",
    tags: [],
    note: "Fallback classification used"
  };
};

const addCorrection = (title, correctCategory) => {
  userCorrections.push({ title, correctCategory });
};

module.exports = {
  classifyExpense,
  addCorrection
};