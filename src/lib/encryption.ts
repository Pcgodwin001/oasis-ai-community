// Encryption utilities for sensitive data
// Note: For production, encryption should happen server-side (edge function)
// This provides client-side hashing for validation purposes only

/**
 * Hashes sensitive data for client-side validation
 * NOT for storage - use edge function for actual encryption
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Validates EBT card number format (16 digits)
 */
export function validateEBTCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Must be 16 digits
  if (!/^\d{16}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm check (standard credit card validation)
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return (sum % 10) === 0;
}

/**
 * Validates PIN format (4 digits)
 */
export function validatePIN(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/**
 * Formats card number for display (shows last 4 digits)
 * Example: 1234567890123456 -> •••• •••• •••• 3456
 */
export function formatCardNumber(cardNumber: string, showFull = false): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  if (showFull) {
    // Show full number in groups of 4
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }

  // Show only last 4 digits
  const lastFour = cleaned.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}

/**
 * Gets last 4 digits of card for storage
 */
export function getCardLastFour(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return cleaned.slice(-4);
}

/**
 * Determines EBT card state from card number (if applicable)
 * This is a simplified version - actual state detection may vary
 */
export function detectStateFromCard(cardNumber: string): string | null {
  // Most states don't encode state info in card number
  // This is a placeholder for potential future enhancement
  // For now, user must select state manually
  return null;
}

/**
 * Validates credentials before sending to backend
 */
export interface CredentialValidation {
  valid: boolean;
  errors: string[];
}

export function validateEBTCredentials(
  cardNumber: string,
  pin: string
): CredentialValidation {
  const errors: string[] = [];

  if (!cardNumber || cardNumber.trim() === '') {
    errors.push('Card number is required');
  } else if (!validateEBTCardNumber(cardNumber)) {
    errors.push('Invalid card number format');
  }

  if (!pin || pin.trim() === '') {
    errors.push('PIN is required');
  } else if (!validatePIN(pin)) {
    errors.push('PIN must be 4 digits');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
