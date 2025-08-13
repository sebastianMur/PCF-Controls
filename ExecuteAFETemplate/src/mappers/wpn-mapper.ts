import type { D365WPN, WPN } from "@/types/template";

export const fromApiWPN = (record: D365WPN): WPN => ({
  xomuog_wellproblemnotificationid: record.xomuog_wellproblemnotificationid,
  xomuog_primaryjobtypeid: record.xomuog_primaryjobtype_ee,
  xomuog_primaryjobtypename:
    record[
      "xomuog_primaryjobtype_ee@OData.Community.Display.V1.FormattedValue"
    ],
  xomuog_engineerid: record._xomuog_engineerid_value,
  xomuog_secondaryjobtype: record.xomuog_secondaryjobtype_ee,
  xomuog_secondaryjobtypename:
    record[
      "xomuog_secondaryjobtype_ee@OData.Community.Display.V1.FormattedValue"
    ],
  xomuog_templateid: record._xomuog_templateid_value,
  xomuog_templatesummaryid: record._xomuog_templatesummaryid_value,
  xomuog_well: record._xomuog_wellid_value,
  xomuog_wellidname:
    record["_xomuog_wellid_value@OData.Community.Display.V1.FormattedValue"],
  xomuog_landman: record._xomuog_landman_value,
});
