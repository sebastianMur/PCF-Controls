export interface INote {
  annotationid: string;
  documentbody: string;
  filename: string;
  filesize: number;
  isdocument: boolean;
  mimetype: string;
  objecttypecode: string;
  _objectid_value: string;
  notetext: string;
  subject: string;
  '@odata.etag': string;
}

export interface IPostNote {
  annotationId: string;
  filename: string;
  documentbody: string;
  mimetype: string;
}
