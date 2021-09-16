export type Methods = "get" | "GET" | "post" | "POST"; // 等等

export interface AxiosRequestConfig {
  url: string;
  method: Methods;
  params?: any; // 等价于[name:string]:any
  data?: Record<string, any>;
  headers?: Record<string, any>;
  timeout?:number;
  // params: Record<string, any>; // 等价于[name:string]:any
}

export interface AxiosInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
}

export interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>; // Axios.prototype.request 这个方法，T为成功后resolve的值
  interceptors:{
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  }
}

// 范型T 代表响应体的类型
export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers?: Record<string, any>;
  config?: AxiosRequestConfig;
  request?: XMLHttpRequest;
}
