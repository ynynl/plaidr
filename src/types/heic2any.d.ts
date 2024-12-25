declare module 'heic2any' {
  function heic2any(options: { blob: Blob, toType?: string }): Promise<Blob | Blob[]>;
  export default heic2any;
} 