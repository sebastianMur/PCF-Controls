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

export const AFE_STATUS = {
  FAPP: {color:"#16A34A",display:"Fully Approved"}, 
  IAPP: {color:"#22C55E",display:"Internally Approved"},
  IHLD: {color:"#FACC15",display:"Internally Held"}, 
  IREJ: {color:"#DC2626",display:"Internally Rejected"},
  PREJ: {color:"#B91C1C",display:"Partner Rejected"}, 
  REL: {color:"#0284C7",display:"Released for Approval"}, 
  REV: {color:"#2563EB",display:"Revised"}, 
  ROUTED: {color:"#3B82F6",display:"Routed for Review"}, 
  SUP: {color:"#0EA5E9",display:"Supplemented"}, 
  UNREL: {color:"#F97316",display:"Unreleased"},
} as const;


