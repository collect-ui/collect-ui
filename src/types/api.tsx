export interface BaseApiObject {
  /**
   * API 发送类型
   */
  method?: "get" | "post" | "put" | "delete" | "patch" | "jsonp" | "js"

  /**
   * API 发送目标地址
   */
  url: string

  /**
   * 用来控制携带数据. 当key 为 `&` 值为 `$$` 时, 将所有原始数据打平设置到 data 中. 当值为 $$ 将所有原始数据赋值到对应的 key 中. 当值为 $ 打头时, 将变量值设置到 key 中.
   */
  data?: {
    [propName: string]: any
  }

  /**
   * 默认数据映射中的key如果带点，或者带大括号，会转成对象比如：
   *
   * {
   *   'a.b': '123'
   * }
   *
   * 经过数据映射后变成
   * {
   *  a: {
   *   b: '123
   *  }
   * }
   *
   * 如果想要关闭此功能，请设置 convertKeyToPath 为 false
   */
  convertKeyToPath?: boolean

  /**
   * 用来做接口返回的数据映射。
   */
  responseData?: {
    [propName: string]: any
  }

  /**
   * 如果 method 为 get 的接口，设置了 data 信息。
   * 默认 data 会自动附带在 query 里面发送给后端。
   *
   * 如果想通过 body 发送给后端，那么请把这个配置成 false。
   *
   * 但是，浏览器还不支持啊，设置了只是摆设。除非服务端支持 method-override
   */
  attachDataToQuery?: boolean

  /**
   * 发送体的格式
   */
  dataType?: "json" | "form-data" | "form"

  /**
   * 如果是文件下载接口，请配置这个。
   */
  responseType?: "blob"

  /**
   * 携带 headers，用法和 data 一样，可以用变量。
   */
  headers?: {
    [propName: string]: string | number
  }

  /**
   * 设置发送条件
   */
  sendOn?: string

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean

  /**
   * 是否将两次返回的数据字段，做一个合并。配置返回对象中的字段名，支持配置多个。
   *
   * 比如：同时返回 log 字段，第一次返回 {log: '1'}，第二次返回 {log: '2'}，合并后的结果是 {log: ['1', '2']]}
   * 再比如：同时返回 items 字段，第一次返回 {items: [1, 2]}，第二次返回 {items: [3, 4]}，合并后的结果是 {items: [1, 2, 3, 4]}
   */
  concatDataFields?: string | Array<string>

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   *
   * @default true
   */
  autoRefresh?: boolean

  /**
   * 当开启自动刷新的时候，默认是 api 的 url 来自动跟踪变量变化的。
   * 如果你希望监控 url 外的变量，请配置 trackExpression。
   */
  trackExpression?: string

  /**
   * 如果设置了值，同一个接口，相同参数，指定的时间（单位：ms）内请求将直接走缓存。
   */
  cache?: number

  /**
   * 强制将数据附加在 query，默认只有 api 地址中没有用变量的时候 crud 查询接口才会
   * 自动附加数据到 query 部分，如果想强制附加请设置这个属性。
   * 对于那种临时加了个变量但是又不想全部参数写一遍的时候配置很有用。
   */
  forceAppendDataToQuery?: boolean

  /**
   * qs 配置项
   */
  qsOptions?: {
    arrayFormat?: "indices" | "brackets" | "repeat" | "comma"
    indices?: boolean
    allowDots?: boolean
  }

  /**
   * autoFill 是否显示自动填充错误提示
   */
  silent?: boolean

  /**
   * 提示信息
   */
  messages?: {
    success?: string
    failed?: string
  }
}
export interface PlainObject {
  [propsName: string]: any
}
export interface fetcherResult {
  data?: {
    data: object
    status: number
    msg: string
    msgTimeout?: number
    errors?: {
      [propName: string]: string
    }
    type?: string
    [propName: string]: any // 为了兼容其他返回格式
  }
  status: number
  headers: object
}
export interface ApiObject extends BaseApiObject {
  config?: {
    withCredentials?: boolean
    cancelExecutor?: (cancel: Function) => void
  }
  originUrl?: string // 原始的 url 地址，记录将 data 拼接到 query 之前的地址
  jsonql?: any
  graphql?: string
  operationName?: string
  body?: PlainObject
  data?: PlainObject
  query?: PlainObject
  mockResponse?: PlainObject
  adaptor?: (
    payload: object,
    response: fetcherResult,
    api: ApiObject,
    context: any,
  ) => any
  requestAdaptor?: (
    api: ApiObject,
    context: any,
  ) => ApiObject | Promise<ApiObject>
  /**
   * api 发送上下文，可以用来传递一些数据给 api 的 adaptor
   * @readonly
   */
  context?: any
  /** 是否过滤为空字符串的 query 参数 */
  filterEmptyQuery?: boolean
  downloadFileName?: string
}
export type ApiString = string
export type Api = ApiString | ApiObject


export interface Payload {
  success: boolean
  msg: string
  defaultMsg?: string
  msgTimeout?: number
  data: any
  status: number
  errors?: {
    [propName: string]: string
  }
}

export interface fetchOptions {
  method?: "get" | "post" | "put" | "patch" | "delete" | "jsonp" | "js"
  successMessage?: string
  errorMessage?: string
  autoAppend?: boolean
  beforeSend?: (data: any) => any
  onSuccess?: (json: Payload) => any
  onFailed?: (json: Payload) => any
  silent?: boolean
  [propName: string]: any
}
