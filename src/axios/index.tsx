import Axios from "./Axios";
import { AxiosInstance } from "./types";
// axios 的实力
// 定义一个累的时候，一个类的原型，Axios.prototype 一个类的实例
function createInstance(): AxiosInstance {
  let context: Axios<any> = new Axios(); // this 指针上下文
  // 让request 方法里的this永远指向context也就是new Axios();
  let instance = Axios.prototype.request.bind(context);
  //把Axios的类的实例和类原型上的方法都拷贝到instance上，也就是request方法上
  instance = Object.assign(instance, Axios.prototype, context);
  return instance as AxiosInstance;
}

let axios = createInstance();

export default axios;

export * from "./types";
