export const STATUS_REASON = {
  Active: 1,
  Sent: 529510001,
  SentforRevision: 529510002,
};

export const STATUS = {
  Active: 0,
  Inactive: 1,
};
export const CAPEX_OPEX = {
  Opex: 529510000,
  Capex: 529510001,
};
export const MAIN_PROJECT_TYPE = {
  RW: 529510000,
  CW: 529510001,
};

export const TEMPLATE_TYPE = {
  RW: 529510000,
  CW: 529510001,
  PA: 723710001
};

export const AFE_STATUS_COLOR = {
  FAPP: "#16A34A", // ✅ Green — Final Approved
  IAPP: "#22C55E", // ✅ Light Green — Intermediate Approved
  IHLD: "#FACC15", // 🟡 Yellow — On Hold
  IREJ: "#DC2626", // ❌ Red — Intermediate Rejected
  PREJ: "#B91C1C", // ❌ Darker Red — Preliminary Rejected
  REL: "#0284C7", // 📦 Blue — Released
  REV: "#2563EB", // 🔵 Blue — Under Review
  ROUTED: "#3B82F6", // 🔵 Blue — Routed for Approval
  SUP: "#0EA5E9", // 🟦 Sky Blue — Submitted / Supported
  UNREL: "#F97316", // 🟠 Orange — Unreleased / Pending
} as const;
