// Mock EBT Data Generator for Demo/Testing
// Generates realistic EBT transaction data and balances

export interface MockTransaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  balanceAfter: number;
  description?: string;
}

export interface MockEBTAccount {
  cardLastFour: string;
  state: string;
  currentBalance: number;
  refillDate: string;
  monthlyBenefit: number;
  transactions: MockTransaction[];
}

// Realistic merchant names by category
const MERCHANTS = {
  groceries: [
    'Walmart Supercenter',
    'Kroger',
    'Publix',
    'Aldi',
    'Safeway',
    'Target',
    'Food Lion',
    'Whole Foods Market',
    'Trader Joe\'s',
    'Costco',
    'Sam\'s Club',
    'Sprouts Farmers Market'
  ],
  convenience: [
    '7-Eleven',
    'Circle K',
    'Wawa',
    'QuikTrip',
    'RaceTrac',
    'Sheetz'
  ],
  pharmacy: [
    'CVS Pharmacy',
    'Walgreens',
    'Rite Aid',
    'Walmart Pharmacy'
  ],
  household: [
    'Dollar General',
    'Dollar Tree',
    'Family Dollar',
    'Big Lots'
  ],
  farmers_market: [
    'Local Farmers Market',
    'Community Farmers Market',
    'Downtown Farmers Market'
  ]
};

// Typical spending patterns
const SPENDING_PATTERNS = {
  weekly_grocery: { min: 40, max: 80, category: 'groceries' },
  bi_weekly_grocery: { min: 80, max: 150, category: 'groceries' },
  convenience: { min: 5, max: 25, category: 'convenience' },
  pharmacy: { min: 10, max: 30, category: 'pharmacy' },
  household: { min: 15, max: 40, category: 'household' },
  farmers_market: { min: 20, max: 60, category: 'farmers_market' }
};

/**
 * Generates a random merchant from category
 */
function getRandomMerchant(category: keyof typeof MERCHANTS): string {
  const merchants = MERCHANTS[category];
  return merchants[Math.floor(Math.random() * merchants.length)];
}

/**
 * Generates a random amount within a range
 */
function getRandomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Generates realistic transaction history for the past 30 days
 */
export function generateMockTransactions(
  initialBalance: number,
  monthlyBenefit: number,
  householdSize: number = 1
): MockTransaction[] {
  const transactions: MockTransaction[] = [];
  let currentBalance = initialBalance;
  const today = new Date();

  // Calculate days since last refill (assume refill on 1st of month)
  const dayOfMonth = today.getDate();
  const daysSinceRefill = dayOfMonth - 1;

  // Add refill transaction if it happened this month
  if (daysSinceRefill >= 0 && daysSinceRefill < 30) {
    const refillDate = new Date(today);
    refillDate.setDate(1);

    transactions.push({
      id: crypto.randomUUID(),
      date: refillDate.toISOString().split('T')[0],
      merchant: 'SNAP EBT Deposit',
      category: 'deposit',
      amount: monthlyBenefit,
      balanceAfter: currentBalance + monthlyBenefit,
      description: 'Monthly SNAP benefit deposit'
    });

    currentBalance += monthlyBenefit;
  }

  // Generate spending transactions
  // More transactions for larger households
  const transactionCount = Math.floor(10 + (householdSize * 3));

  for (let i = 0; i < transactionCount; i++) {
    // Random day in the past (after refill)
    const daysAgo = Math.floor(Math.random() * Math.min(daysSinceRefill, 28)) + 1;
    const transactionDate = new Date(today);
    transactionDate.setDate(today.getDate() - daysAgo);

    // Determine transaction type based on probability
    const rand = Math.random();
    let pattern: { min: number; max: number; category: string };
    let category: keyof typeof MERCHANTS;

    if (rand < 0.50) {
      // 50% - Weekly grocery trip
      pattern = SPENDING_PATTERNS.weekly_grocery;
      category = 'groceries';
    } else if (rand < 0.75) {
      // 25% - Bi-weekly larger grocery
      pattern = SPENDING_PATTERNS.bi_weekly_grocery;
      category = 'groceries';
    } else if (rand < 0.85) {
      // 10% - Convenience store
      pattern = SPENDING_PATTERNS.convenience;
      category = 'convenience';
    } else if (rand < 0.92) {
      // 7% - Pharmacy
      pattern = SPENDING_PATTERNS.pharmacy;
      category = 'pharmacy';
    } else if (rand < 0.97) {
      // 5% - Household items
      pattern = SPENDING_PATTERNS.household;
      category = 'household';
    } else {
      // 3% - Farmers market
      pattern = SPENDING_PATTERNS.farmers_market;
      category = 'farmers_market';
    }

    const amount = -getRandomAmount(pattern.min, pattern.max);
    currentBalance = Math.max(0, currentBalance + amount); // amount is negative

    transactions.push({
      id: crypto.randomUUID(),
      date: transactionDate.toISOString().split('T')[0],
      merchant: getRandomMerchant(category),
      category: pattern.category,
      amount: amount,
      balanceAfter: currentBalance
    });
  }

  // Sort by date (most recent first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Recalculate balances in reverse chronological order
  let balance = transactions[0].balanceAfter;
  for (let i = 1; i < transactions.length; i++) {
    balance -= transactions[i].amount; // Reverse the transaction
    transactions[i].balanceAfter = balance;
  }

  return transactions;
}

/**
 * Calculates next refill date (1st of next month)
 */
function getNextRefillDate(): string {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

/**
 * Estimates monthly SNAP benefit based on household size
 * Using 2024 SNAP maximum allotments
 */
function estimateMonthlyBenefit(householdSize: number): number {
  const maxBenefits: { [key: number]: number } = {
    1: 291,
    2: 535,
    3: 766,
    4: 973,
    5: 1155,
    6: 1386,
    7: 1532,
    8: 1751
  };

  if (householdSize <= 0) return 0;
  if (householdSize > 8) {
    // For each additional person, add $219
    return maxBenefits[8] + ((householdSize - 8) * 219);
  }

  return maxBenefits[householdSize] || maxBenefits[1];
}

/**
 * Generates a complete mock EBT account with realistic data
 */
export function generateMockEBTAccount(
  householdSize: number = 1,
  state: string = 'TN'
): MockEBTAccount {
  const monthlyBenefit = estimateMonthlyBenefit(householdSize);

  // Current balance should be somewhere between 0 and monthly benefit
  // Depending on how far into the month we are
  const dayOfMonth = new Date().getDate();
  const percentageRemaining = 1 - (dayOfMonth / 30);
  const estimatedBalance = Math.floor(monthlyBenefit * percentageRemaining * (0.7 + Math.random() * 0.3));

  const transactions = generateMockTransactions(
    estimatedBalance,
    monthlyBenefit,
    householdSize
  );

  // Get actual balance from last transaction
  const currentBalance = transactions.length > 0 ? transactions[0].balanceAfter : estimatedBalance;

  return {
    cardLastFour: String(Math.floor(1000 + Math.random() * 9000)),
    state,
    currentBalance: Math.max(0, currentBalance),
    refillDate: getNextRefillDate(),
    monthlyBenefit,
    transactions
  };
}

/**
 * Mock EBT balance check (simulates API call)
 * In production, this would call the scraper or Plaid
 */
export async function mockCheckEBTBalance(
  cardNumber: string,
  pin: string,
  householdSize: number = 1,
  state: string = 'TN'
): Promise<MockEBTAccount> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Validate credentials (basic format check)
  if (!cardNumber || cardNumber.length !== 16) {
    throw new Error('Invalid card number');
  }

  if (!pin || pin.length !== 4) {
    throw new Error('Invalid PIN');
  }

  // Generate and return mock data
  return generateMockEBTAccount(householdSize, state);
}

/**
 * Refresh mock balance (simulates re-checking balance)
 */
export async function mockRefreshBalance(
  existingAccount: MockEBTAccount
): Promise<MockEBTAccount> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if it's a new month (refill date passed)
  const today = new Date();
  const refillDate = new Date(existingAccount.refillDate);

  if (today >= refillDate) {
    // Generate new data with refill
    return {
      ...existingAccount,
      currentBalance: existingAccount.monthlyBenefit,
      refillDate: getNextRefillDate(),
      transactions: [
        {
          id: crypto.randomUUID(),
          date: refillDate.toISOString().split('T')[0],
          merchant: 'SNAP EBT Deposit',
          category: 'deposit',
          amount: existingAccount.monthlyBenefit,
          balanceAfter: existingAccount.monthlyBenefit,
          description: 'Monthly SNAP benefit deposit'
        },
        ...existingAccount.transactions
      ]
    };
  }

  // Otherwise, return existing data (no changes)
  return existingAccount;
}
