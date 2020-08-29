export interface ResultInterface {
    data: any,
    meta: any,
}
export interface UsecaseInterface<Data, Options> {
    exec: (data: Data, options?: Options) => Promise<ResultInterface>;
}
