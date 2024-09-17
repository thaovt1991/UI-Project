export class RequestModel {
    data : Array<any>;
    methodName?: string;
    assemblyName?: string;
    className?: string;
  }
  
  export class RequestCorrespondence{
    FromDate?: string;
    ToDate?: string;
    SignStatus?: string;
    CusCode?: string;
    Company?: string;
    pIndex?: number;
    pageRecord?: number;
    isLoadPage: boolean = true;
  }
  
  export class RequestSMS{
    startDay?: string;
    endDay?: string;
    cusCode?: string;
    pIndex?: number;
    pageRecord?: number;
    isLoadPage: boolean = true;
  }
