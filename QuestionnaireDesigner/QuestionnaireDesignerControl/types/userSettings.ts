// // interface OrgSettingsAttributes {
// //   activitytypefilter: number;
// //   activitytypefilterv2: number;
// //   allowunresolvedpartiesonemailsend: number;
// //   blockedattachments: string;
// //   businesscardoptions: string;
// //   emailconnectionchannel: number;
// //   enableemailtemplateviews: number;
// //   isemailmonitoringallowed: number;
// //   isembedteamscollabenabled: number;
// //   ismsteamscollaborationenabled: number;
// //   ismsteamsenabled: number;
// //   isnewaddproductexperienceenabled: number;
// //   isonedriveenabled: number;
// //   ispaienabled: number;
// //   isplaybookenabled: number;
// //   ispricelistmandatory: number;
// //   isquickcreateenabledforopportunityclose: number;
// //   iswriteinproductsallowed: number;
// //   maxuploadfilesize: number;
// //   name: string;
// //   organizationid: string;
// //   orgdborgsettings: string;
// //   qualifyleadadditionaloptions: string;
// //   resolvesimilarunresolvedemailaddress: number;
// //   sendbulkemailinuci: number;
// //   skipselectrecorddialog: number;
// //   teamschatdatasync: number;
// //   versionnumber: string;
// // }

// // interface OrgSettings {
// //   languageId: number;
// //   uniqueName: string;
// //   isAutoSaveEnabled: boolean;
// //   attributes: OrgSettingsAttributes;
// //   tenantId: string;
// // }

// // interface WebApiContext {
// //   offline: any;
// //   online: any;
// // }

// // interface XrmProxy {
// //   _navigationContext: NavigationContext;
// //   //   UserSettings: UserSettings;
// //   OrgSettings: OrgSettings;
// //   Utils: any;
// //   Page: any;
// //   Reporting: any;
// //   Diagnostics: any;
// //   IntelligenceApi: any;
// //   Client: any;
// //   GraphApi: any;
// //   _applicationUI: any;
// //   _webApiContext: WebApiContext;
// //   _unifiedWebApiContext: any;
// //   Initialized: boolean;
// //   Offline: any;
// //   _deviceContext: any;
// //   _externalContext: any;
// // }

// // interface ExternalUtils {
// //   xrmProxy: XrmProxy;
// // }

// interface Calendar {
//   MinSupportedDateTime: string;
//   MaxSupportedDateTime: string;
//   AlgorithmType: number;
//   CalendarType: number;
//   Eras: number[];
//   TwoDigitYearMax: number;
//   IsReadOnly: boolean;
// }

// interface DateTimeFormatInfo {
//   AMDesignator: string;
//   AbbreviatedDayNames: string[];
//   AbbreviatedMonthGenitiveNames: string[];
//   AbbreviatedMonthNames: string[];
//   CalendarWeekRule: number;
//   Calendar: Calendar;
//   DateSeparator: string;
//   DayNames: string[];
//   Eras: (number | string | null)[];
//   FirstDayOfWeek: number;
//   FullDateTimePattern: string;
//   LongDatePattern: string;
//   LongTimePattern: string;
//   MonthDayPattern: string;
//   MonthGenitiveNames: string[];
//   MonthNames: string[];
//   PMDesignator: string;
//   ShortDatePattern: string;
//   ShortTimePattern: string;
//   ShortestDayNames: string[];
//   SortableDateTimePattern: string;
//   TimeSeparator: string;
//   UniversalSortableDateTimePattern: string;
//   YearMonthPattern: string;
//   amDesignator: string;
//   abbreviatedDayNames: string[];
//   abbreviatedMonthGenitiveNames: string[];
//   abbreviatedMonthNames: string[];
//   calendarWeekRule: number;
//   calendar: Calendar;
//   dateSeparator: string;
//   dayNames: string[];
//   eras: (number | string | null)[];
//   firstDayOfWeek: number;
//   fullDateTimePattern: string;
//   longDatePattern: string;
//   longTimePattern: string;
//   monthDayPattern: string;
//   monthGenitiveNames: string[];
//   monthNames: string[];
//   pmDesignator: string;
//   shortDatePattern: string;
//   shortTimePattern: string;
//   shortestDayNames: string[];
//   sortableDateTimePattern: string;
//   timeSeparator: string;
//   universalSortableDateTimePattern: string;
//   yearMonthPattern: string;
// }

// interface NumberFormatInfo {
//   CurrencyDecimalDigits: number;
//   CurrencyDecimalSeparator: string;
//   CurrencyGroupSeparator: string;
//   CurrencyGroupSizes: number[];
//   CurrencyNegativePattern: number;
//   CurrencyPositivePattern: number;
//   CurrencySymbol: string;
//   NativeDigits: string[];
//   NegativeInfinitySymbol: string;
//   NegativeSign: string;
//   NumberDecimalDigits: number;
//   NumberDecimalSeparator: string;
//   NumberGroupSeparator: string;
//   NumberGroupSizes: number[];
//   NumberNegativePattern: number;
//   PerMilleSymbol: string;
//   PercentDecimalDigits: number;
//   PercentDecimalSeparator: string;
//   PercentGroupSeparator: string;
//   PercentGroupSizes: number[];
//   PercentNegativePattern: number;
//   PercentPositivePattern: number;
//   PercentSymbol: string;
//   PositiveInfinitySymbol: string;
//   PositiveSign: string;
//   currencyDecimalDigits: number;
//   currencyDecimalSeparator: string;
//   currencyGroupSeparator: string;
//   currencyGroupSizes: number[];
//   currencyNegativePattern: number;
//   currencyPositivePattern: number;
//   currencySymbol: string;
//   nativeDigits: string[];
//   negativeInfinitySymbol: string;
//   negativeSign: string;
//   numberDecimalDigits: number;
//   numberDecimalSeparator: string;
//   numberGroupSeparator: string;
//   numberGroupSizes: number[];
//   numberNegativePattern: number;
//   perMilleSymbol: string;
//   percentDecimalDigits: number;
//   percentDecimalSeparator: string;
//   percentGroupSeparator: string;
//   percentGroupSizes: number[];
//   percentNegativePattern: number;
//   percentPositivePattern: number;
//   percentSymbol: string;
//   positiveInfinitySymbol: string;
//   positiveSign: string;
// }

// interface TimeZoneAdjuster {
//   dateStart: string;
//   dateEnd: string;
//   daylightStart: {
//     day: number;
//     month: number;
//     dayOfWeek: number;
//     week: number;
//     timeOfDay: string;
//     isFixedDateRule: boolean;
//   };
//   delta: number;
//   daylightEnd: {
//     day: number;
//     month: number;
//     dayOfWeek: number;
//     week: number;
//     timeOfDay: string;
//     isFixedDateRule: boolean;
//   };
// }

// interface FormattingData {
//   timeZoneUtcOffsetMinutes: number;
//   dateTimeFormatInfo: DateTimeFormatInfo;
//   numberFormatInfo: NumberFormatInfo;
//   timeZoneAdjusters: TimeZoneAdjuster[];
//   formatInfoCultureName: string;
//   //   formatter: any;
//   languagesByCode: { [key: string]: string };
//   workDayStartTime: string;
//   workDayStopTime: string;
// }

// // interface UtilsData {
// //   encoder: any;
// //   dateTimeUtils: any;
// // }

// export interface IUserSettings {
//   //   _externalUtils: ExternalUtils;
//   _formattingData: FormattingData;
//   //   _utilsData: UtilsData;
//   userId: string;
//   userName: string;
//   dateFormattingInfo: DateTimeFormatInfo;
//   numberFormattingInfo: NumberFormatInfo;
//   isRTL: boolean;
//   languageId: number;
//   locale: string;
//   securityRoles: string[];
//   isHighContrastEnabled: boolean;
//   timeZoneUtcOffsetMinutes: number;
//   pagingLimit: number;
//   workDayStartTime: string;
//   workDayStopTime: string;
//   formatInfoCultureName: string;
//   formatInfoCultureId: number;
//   aadObjectId: string;
// }
