import { AxiosRequestConfig, AxiosResponse } from "./types";
import AxiosInterceptorManage, { Interceptor } from "./AxiosInterceptorManager";
import qs from "qs";
// import parseHeaders from "parse-headers";

export default class Axios<T> {
  public interceptors = {
    request: new AxiosInterceptorManage<AxiosRequestConfig>(),
    response: new AxiosInterceptorManage<AxiosResponse<T>>(),
  };
  // response里 data 类型
  request(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T> | AxiosRequestConfig> {
    const chain: Array<any> = [
      //   Interceptor<AxiosRequestConfig> | Interceptor<AxiosResponse<T>>
      { onFulfilled: this.dispatchRequest, onRejected: (error: any) => error },
    ];

    this.interceptors.request.interceptors.forEach(
      (interceptor: Interceptor<AxiosRequestConfig> | null) => {
        if (interceptor) {
          chain.unshift(interceptor);
        }
      }
    );
    this.interceptors.response.interceptors.forEach(
      (interceptor: Interceptor<AxiosResponse<T>> | null) => {
        interceptor && chain.push(interceptor);
      }
    );
    let promise: any = Promise.resolve(config);
    // let promise:Promise<AxiosRequestConfig | AxiosResponse<T>> = Promise.resolve(config);
    while (chain.length > 0) {
      const { onFulfilled, onRejected } = chain.shift()!; // unshift 向头部添加元素， shift 从头删除元素并返回；
      promise = promise.then(onFulfilled, onRejected);
    }
    return promise;
  }

  dispatchRequest(config: AxiosRequestConfig): Promise<any> {
    let { method, url, params, headers, data, timeout } = config;
    // let controller = new AbortController();
    // let signal = controller.signal;
    console.log(timeout);

    if (params && typeof params == "object") {
      params = qs.stringify(params);
      url += (url.indexOf("?") === -1 ? "?" : "&") + params;
    }
    // 超时函数
    // const timeoutAction = (timer: number) => {
    //   return new Promise((reslove) => {
    //     setTimeout(() => {
    //       // 实例化超时响应json数据
    //       const response = new Response(
    //         JSON.stringify({
    //           code: 1,
    //           msg: `timeout ${timer}s`,
    //         })
    //       );
    //       controller.abort(); // 发送终止信号
    //       reslove(response);
    //     }, timer * 1000);
    //   })
    // };
    return Promise.race([
      // timeoutAction(0), //超时控制在time 秒
      fetch(url, {
        body: (data && JSON.stringify(data)) || "", // must match 'Content-Type' header
        method, // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json",
          ...headers,
        },
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // *
        // signal: signal //设置信号
      }),
    ])
      .then((res) => {
        return res;
      })
      .then((res) => {
        console.log("res===>", res);
      });
      // dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // return new Promise<any>((resolve, reject) => {
    //   // return new Promise<AxiosResponse<T>>((resolve, reject) => {
    //   fetch(url, {
    //     body: (data && JSON.stringify(data)) || "", // must match 'Content-Type' header
    //     method, // *GET, POST, PUT, DELETE, etc.
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: "same-origin", // include, same-origin, *omit
    //     headers: {
    //       "user-agent": "Mozilla/4.0 MDN Example",
    //       "content-type": "application/json",
    //       ...headers,
    //     },
    //     mode: "cors", // no-cors, cors, *same-origin
    //     redirect: "follow", // manual, *follow, error
    //     referrer: "no-referrer", // *
    //   })
    //     .then((response) => {
    //       resolve(response.json);
    //       console.log("response===>", response);

    //       return response.json();
    //     })
    //     .catch(() => {
    //       reject("net::ERR_INTERNET_DISCONNECTED"); // 链接问题
    //     }); // parses response to JSON;
    // });
  }

  //   // 定义一个派发请求的方法
  //   dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>| AxiosRequestConfig> {
  //     return new Promise<AxiosResponse<T>>((resolve, reject) => {
  //       let { method, url, params, headers, data, timeout } = config;
  //       let request = new XMLHttpRequest();
  //       if (params && typeof params == "object") {
  //         params = qs.stringify(params);
  //         url += (url.indexOf("?") === -1 ? "?" : "&") + params;
  //       }

  //       request.open(method, url, true);
  //       request.responseType = "json";
  //       request.onreadystatechange = () => {
  //         //指定一个状态变更函数
  //         if (request.readyState === 4 && request.status !== 0) {
  //           // 因为 等于 0 是超时
  //           if (request.status >= 200 && request.status < 300) {
  //             // 说明是正常返回
  //             let response: AxiosResponse<T> = {
  //               data: request.response ? request.response : request.responseText,
  //               status: request.status,
  //               statusText: request.statusText,
  //               // content-type = xx; content-length=42 {content-type:xx,content-length:42}
  //               headers: parseHeaders(request.getAllResponseHeaders()),
  //               config,
  //               request,
  //             };
  //             resolve(response);
  //           } else {
  //             reject(`Error: Request failed with status code ${request.status}`);
  //           }
  //         }
  //       };
  //       if (headers) {
  //         for (let key in headers) {
  //           request.setRequestHeader(key, headers[key]);
  //         }
  //       }
  //       let body: string | null = null;
  //       if (data) {
  //         body = JSON.stringify(data);
  //       }
  //       request.onerror = () => {
  //         reject("net::ERR_INTERNET_DISCONNECTED"); // 链接问题
  //       };
  //       if (timeout) {
  //         request.timeout = timeout;
  //         request.ontimeout = () => {
  //           // eslint-disable-next-line no-template-curly-in-string
  //           reject("Error:timeout of ${timeout}"); //超时问题
  //         };
  //       }
  //       request.send(body);
  //     });
  //   }
}


