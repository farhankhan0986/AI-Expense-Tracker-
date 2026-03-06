const Groq = require('groq-sdk');

const KEYWORD_MAP = {
  // Food
  grocery: 'Food',
  groceries: 'Food',
  restaurant: 'Food',
  pizza: 'Food',
  burger: 'Food',
  coffee: 'Food',
  cafe: 'Food',
  starbucks: 'Food',
  mcdonalds: 'Food',
  lunch: 'Food',
  dinner: 'Food',
  breakfast: 'Food',
  food: 'Food',
  snack: 'Food',
  doordash: 'Food',
  ubereats: 'Food',
  grubhub: 'Food',
  bakery: 'Food',
  supermarket: 'Food',

  // Transport
  uber: 'Transport',
  lyft: 'Transport',
  taxi: 'Transport',
  gas: 'Transport',
  fuel: 'Transport',
  parking: 'Transport',
  metro: 'Transport',
  bus: 'Transport',
  train: 'Transport',
  subway: 'Transport',
  toll: 'Transport',
  car: 'Transport',

  // Shopping
  amazon: 'Shopping',
  walmart: 'Shopping',
  target: 'Shopping',
  shopping: 'Shopping',
  clothing: 'Shopping',
  shoes: 'Shopping',
  electronics: 'Shopping',
  furniture: 'Shopping',
  ikea: 'Shopping',
  costco: 'Shopping',

  // Entertainment
  netflix: 'Entertainment',
  spotify: 'Entertainment',
  movie: 'Entertainment',
  cinema: 'Entertainment',
  concert: 'Entertainment',
  game: 'Entertainment',
  gaming: 'Entertainment',
  hulu: 'Entertainment',
  disney: 'Entertainment',
  theater: 'Entertainment',
  music: 'Entertainment',

  // Bills
  rent: 'Bills',
  electricity: 'Bills',
  water: 'Bills',
  internet: 'Bills',
  phone: 'Bills',
  insurance: 'Bills',
  mortgage: 'Bills',
  utility: 'Bills',
  utilities: 'Bills',
  cable: 'Bills',
  subscription: 'Bills',

  // Health
  pharmacy: 'Health',
  doctor: 'Health',
  hospital: 'Health',
  dental: 'Health',
  dentist: 'Health',
  medicine: 'Health',
  gym: 'Health',
  fitness: 'Health',
  health: 'Health',
  clinic: 'Health',
  therapy: 'Health',
  vitamin: 'Health',

  // Education
  tuition: 'Education',
  course: 'Education',
  book: 'Education',
  books: 'Education',
  udemy: 'Education',
  coursera: 'Education',
  school: 'Education',
  college: 'Education',
  university: 'Education',
  seminar: 'Education',
  workshop: 'Education',

  // Travel
  hotel: 'Travel',
  airbnb: 'Travel',
  flight: 'Travel',
  airline: 'Travel',
  travel: 'Travel',
  vacation: 'Travel',
  resort: 'Travel',
  luggage: 'Travel',
  booking: 'Travel',
};

function classifyByKeyword(description) {
  const lower = description.toLowerCase();
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      return category;
    }
  }
  return null;
}

async function classifyWithAI(description) {
  if (!process.env.GROQ_API_KEY) return null;

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an expense classifier. Given an expense description, respond with exactly one category from: Food, Transport, Shopping, Entertainment, Bills, Health, Education, Travel, Other. Respond with only the category name.',
        },
        {
          role: 'user',
          content: description,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const category = response.choices[0].message.content.trim();
    const valid = [
      'Food',
      'Transport',
      'Shopping',
      'Entertainment',
      'Bills',
      'Health',
      'Education',
      'Travel',
      'Other',
    ];
    return valid.includes(category) ? category : 'Other';
  } catch (err) {
    console.error('Groq classification error:', err.message);
    return null;
  }
}

async function classifyExpense(description) {
  const keywordResult = classifyByKeyword(description);
  if (keywordResult) return keywordResult;

  const aiResult = await classifyWithAI(description);
  if (aiResult) return aiResult;

  return 'Other';
}

module.exports = { classifyExpense };
