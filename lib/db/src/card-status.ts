export const CARD_STATUSES = ["blank", "active", "lost", "suspended"] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export function isCardStatus(value: string): value is CardStatus {
  return (CARD_STATUSES as readonly string[]).includes(value);
}

export function normalizeCardStatus(status: string): string {
  return status === "inactive" ? "blank" : status;
}

export function isActivatableStatus(status: string): boolean {
  const normalized = normalizeCardStatus(status);
  return normalized === "blank";
}
