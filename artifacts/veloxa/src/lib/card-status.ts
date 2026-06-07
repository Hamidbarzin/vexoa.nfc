export const CARD_STATUSES = ["blank", "active", "lost", "suspended"] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export function normalizeCardStatus(status: string): CardStatus | string {
  return status === "inactive" ? "blank" : status;
}

export const CARD_STATUS_LABELS: Record<CardStatus, string> = {
  blank: "Blank",
  active: "Active",
  lost: "Lost",
  suspended: "Suspended",
};

export function getPublicCardBlockMessage(status: CardStatus | string): {
  title: string;
  description: string;
} {
  switch (status) {
    case "blank":
      return {
        title: "Card Not Activated",
        description: "This NFC card has not been activated yet. The owner needs to complete setup first.",
      };
    case "lost":
      return {
        title: "Card Reported Lost",
        description: "This NFC card has been marked as lost and is no longer available.",
      };
    case "suspended":
      return {
        title: "Card Suspended",
        description: "This NFC card has been suspended and the public profile is unavailable.",
      };
    default:
      return {
        title: "Card Unavailable",
        description: "This NFC card cannot be viewed right now.",
      };
  }
}
