declare module 'express-static-gzip' {
  import { RequestHandler } from 'express';
  
  interface ExpressStaticGzipOptions {
    enableBrotli?: boolean;
    customCompressions?: Array<{
      encodingName: string;
      fileExtension: string;
    }>;
    orderPreference?: string[];
    index?: boolean | string;
    serveStatic?: any;
  }
  
  function expressStaticGzip(
    root: string,
    options?: ExpressStaticGzipOptions
  ): RequestHandler;
  
  export = expressStaticGzip;
}