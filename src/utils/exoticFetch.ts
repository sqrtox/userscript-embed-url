export type ExoticFetchResponseType<T> = keyof ExoticFetchResponseTypeMap<T>;

export type ExoticFetchResponseTypeMap<T> = Readonly<{
  arraybuffer: ArrayBuffer,
  blob: Blob,
  document: Document,
  json: T,
  text: string
}>

export type ExoticFetchResponse<T, K extends ExoticFetchResponseType<T>> = Readonly<{
  response: ExoticFetchResponseTypeMap<T>[K],
  finalUrl: string
}>

export type ExoticFetchRequestOptions<T, K extends ExoticFetchResponseType<T>> = Readonly<Partial<{
  responseType: K,
  method: ExoticFetchRequestMethod
}>>;

export type ExoticFetchRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'TRACE' | 'OPTIONS' | 'CONNECT';

export const exoticFetch = <T, K extends ExoticFetchResponseType<T> = 'blob'>(
  url: string,
  {
    method = 'GET',
    responseType = 'blob' as K
  }: ExoticFetchRequestOptions<T, K> = {}
) => new Promise<ExoticFetchResponse<T, K>>((resolve, reject) => {
  GM.xmlHttpRequest({
    method,
    url,
    responseType,
    onload: res => {
      resolve({
        response: res.response,
        finalUrl: res.finalUrl
      });
    },
    onerror: err => reject(err)
  });
});
