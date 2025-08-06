import type {
  Attachment,
  D365Attachment,
  SendAttachment,
} from "@/types/template";
import { base64ToBlob, fileToBase64 } from "@/utils/functions";

export const fromApiAttachments = (record: D365Attachment): Attachment => {
  return {
    annotationid: record.annotationid,
    name: record.filename,
    type: record.mimetype,
    url: URL.createObjectURL(
      base64ToBlob(record.documentbody, record.mimetype),
    ),
  } as Attachment;
};
export const toApiAttachments = async (
  record: File,
  templateSummaryId: string,
): Promise<SendAttachment> => {
  const base64String = (await fileToBase64(record)).split(",")[1];

  return {
    "objectid_xomuog_templatesummary@odata.bind": `/xomuog_templatesummaries(${templateSummaryId})`,
    documentbody: base64String,
    filename: record.name,
    mimetype: record.type,
    isdocument: true,
    objecttypecode: "xomuog_templatesummary",
    subject: record.name,
  };
};
