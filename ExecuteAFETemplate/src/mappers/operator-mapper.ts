import type { D365Operator, Operator } from "@/types/template";

export const fromApiOperator = (record: D365Operator): Operator => ({
  xomuog_name: record.xomuog_name,
  xomuog_operatorid: record.xomuog_operatorid,
  xomuog_number: record.xomuog_number,
  statuscode: record.statuscode,
});
