interface onFulfilled<V> {
  (value: V): V | Promise<V> |undefined | null;
}

interface onRejected {
  (error: any): any;
}

export interface Interceptor<V> {
  onFulfilled?: onFulfilled<V>; // 成功回调
  onRejected?: onRejected; //失败回调
}

// T request response
export default class AxiosInterceptorManager<V> {
  public interceptors: (Interceptor<V> | null) [] = [];

  // 吊用use的时候添加拦截器
  use(onFulfilled?: onFulfilled<V>, onRejected?: onRejected): number {
    this.interceptors.push({
      onFulfilled,
      onRejected,
    });
    return this.interceptors.length - 1;
  }
  // 取消拦截器
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
