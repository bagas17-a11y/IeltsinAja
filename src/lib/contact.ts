/**
 * Single source of truth for operator / contact information.
 *
 * Used by:
 *  - WhatsAppButton (floating support)
 *  - Footer
 *  - PricingSelection ("need help?" link)
 *  - Consultation Hub booking
 *
 * Update once here when the founder's contact details change.
 */

export const OPERATOR = {
  /** Public-facing operator name used on the pricing/payment surface. */
  name: "IELTSinAja (operated by Bagas Haryo Wicaksono)",
  /** Country dial code + WhatsApp number for support (no leading +). */
  whatsappNumber: "6281934349453",
  instagramHandle: "ieltsinaja",
  /** Bank details for manual transfers — keep aligned with PricingSelection bank info. */
  bank: {
    bankName: "BCA",
    accountNumber: "2302934607",
    accountName: "Bagas Haryo Wicaksono",
  },
};

/**
 * Build a https://wa.me link with a prefilled message.
 * Strips a leading "+" automatically for friendliness.
 */
export function buildWhatsAppLink(message: string, phone = OPERATOR.whatsappNumber): string {
  const cleanedPhone = phone.replace(/^\+/, "");
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

/** Default contact messages — reuse for consistency. */
export const CONTACT_MESSAGES = {
  generalHelp:
    "Hi IELTSinAja team, I have a question about the platform.",
  pricingHelp:
    "Hi IELTSinAja team, I have a question about your pricing or payment.",
  bookConsultation:
    "Hi IELTSinAja team, I'd like to book a 1-on-1 IELTS coaching session.",
  paymentTransferred:
    "Hi IELTSinAja team, I have just made a transfer and uploaded my receipt. Please confirm.",
};

/** Prefilled message when a user picks a paid plan after signup. */
export function planSignupWhatsAppMessage(opts: {
  email: string;
  planName: string;
  displayPrice: string;
  fullName?: string | null;
}): string {
  const nameLine = opts.fullName ? `\nName: ${opts.fullName}` : "";
  return (
    `Hi IELTSinAja! I just signed up and want the *${opts.planName}* package.\n\n` +
    `Email: ${opts.email}${nameLine}\n` +
    `Package: ${opts.planName} (${opts.displayPrice})\n\n` +
    `I'll send payment proof here on WhatsApp. Please activate my account when received.`
  );
}
