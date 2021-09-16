import axios, { AxiosRequestConfig, AxiosResponse } from "./axios";

// const baseURL = "http://192.168.3.70:10000";

interface ParamsType {
  email: string;
  code: string;
}

let user: ParamsType = {
  email: "111@qq.com",
  code: "8888",
};
// fetch("http://example.com/movies.json")
//   .then(function (response) {
//     console.log("fethc-=--", response);

//     return response.json();
//   })
//   .then(function (myJson) {
//     console.log(myJson);
//   });
const interceptors1 =axios.interceptors.request.use((config: AxiosRequestConfig):AxiosRequestConfig => {
  config.headers!.name += "1";
  return config;
},error =>Promise.reject());
axios.interceptors.request.use((config: AxiosRequestConfig):AxiosRequestConfig => {
  config.headers!.name += "2";
  return config;
});
axios.interceptors.request.use((config: AxiosRequestConfig):AxiosRequestConfig => {
  config.headers!.name += "3";
  return config;
});

axios.interceptors.response.use((response:AxiosResponse)=>{
  response.data.name +='1';
  return response;
});

axios.interceptors.response.use((response:AxiosResponse)=>{
  response.data.name +='2';
  return response;
});

axios.interceptors.response.use((response:AxiosResponse)=>{
  response.data.name +='4';
  return response;
});

// 弹出 功能
axios.interceptors.request.eject(interceptors1);

axios.interceptors.request.use((config):AxiosRequestConfig | Promise<AxiosRequestConfig>=>{
  return new Promise<AxiosRequestConfig>((resolve, reject) => {
     setTimeout(()=>{
       config.headers!.name +="4";
       resolve(config)
     },2000)
  })
  // return Promise.reject('发送失败。。。')
})

axios({
  method: "post",
  url: "http://www.baidu.com",
  params: user,
  // data: user,
  headers: {
    "content-type": "application/json",
  },
})
  .then((Response) => {
    console.log("response===", Response);
    return Response.data;
  })
  .catch((error: any) => {
    console.log(error);
  });
