/**
 * 与服务器进行通信并返回结果
 * 
 * @class Options
 */
class Options {
  constructor() {
    // 关闭窗口时断开连接
    window.onunload = () => { options.close() }
  }
  /**
   * 回调函数
   * 
   * @private
   * @memberof Options
   */
  private __callback: { [ts: string]: (message: any) => void } = {}
  /**
   * WebSocket客户端
   * 
   * @protected
   * @type {WebSocket}
   * @memberof Options
   */
  protected _ws: WebSocket
  /**
   * 随机16进制数
   * 
   * @readonly
   * @protected
   * @type {string}
   * @memberof Options
   */
  protected get _ts(): string {
    let bufArray = window.crypto.getRandomValues(new Uint32Array(5))
      , random = ''
    bufArray.forEach(value => { random += value.toString(16) })
    return random.slice(0, 32)
  }
  /**
   * 连接到服务器
   * 
   * @param {string} path 
   * @param {string[]} protocols
   * @returns {Promise<boolean>} 
   * @memberof Options
   */
  public connect(path: string, protocols: string[]): Promise<boolean> {
    return new Promise(resolve => {
      try {
        let ws = new WebSocket(path, protocols)
          , removeEvent = () => {
            delete ws.onopen
            delete ws.onerror
          }
        ws.onopen = () => {
          removeEvent()
          this._ws = ws
          this._init()
          resolve(true)
        }
        ws.onerror = () => {
          removeEvent()
          resolve(false)
        }
      } catch (error) {
        resolve(false)
      }
    })
  }
  /**
   * 添加各种EventListener
   * 
   * @protected
   * @memberof Options
   */
  protected _init() {
    this._ws.onerror = data => {
      this.close()
      if (typeof this.onwserror === 'function') this.onwserror(data)
      else console.error(data)
    }
    this._ws.onclose = data => {
      this.close()
      if (typeof this.onwsclose === 'function') this.onwsclose(data)
      else console.error(data)
    }
    this._ws.onmessage = data => {
      let message: message = JSON.parse(data.data)
        , ts = message.ts
      if (ts != null && typeof this.__callback[ts] === 'function') {
        delete message.ts
        this.__callback[ts](message)
        delete this.__callback[ts]
      }
      else if (message.cmd === 'log' && typeof this.onlog === 'function') this.onlog(<string>message.msg)
      else if (typeof this.onerror === 'function') this.onerror(data)
      else console.error(data)
    }
  }
  /**
   * 向服务器发送消息
   * 
   * @protected
   * @template T 
   * @param {message} message 
   * @returns {Promise<T>} 
   * @memberof Options
   */
  protected _send<T>(message: message): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let timeout = setTimeout(() => {
        reject('timeout')
      }, 1e+4) // 10秒
      let ts = this._ts
      message.ts = ts
      this.__callback[ts] = (msg: T) => {
        clearTimeout(timeout)
        resolve(msg)
      }
      let msg = JSON.stringify(message)
      if (this._ws.readyState === WebSocket.OPEN) this._ws.send(msg)
      else reject('closed')
    })
  }
  /**
   * 服务器返回消息错误
   * 
   * @memberof Options
   */
  public onerror: (this: Options, data: MessageEvent) => void
  /**
   * 服务器log
   * 
   * @memberof Options
   */
  public onlog: (this: Options, data: string) => void
  /**
   * WebSocket错误消息
   * 
   * @memberof Options
   */
  public onwserror: (this: Options, data: Event) => void
  /**
   * WebSocket断开消息
   * 
   * @memberof Options
   */
  public onwsclose: (this: Options, data: CloseEvent) => void
  /**
   * 关闭连接
   * 
   * @memberof Options
   */
  public close() {
    this._ws.close()
    this.__callback = {}
  }
  /**
   * 获取Log
   * 
   * @returns {Promise<logMSG>} 
   * @memberof Options
   */
  public getLog(): Promise<logMSG> {
    let message = { cmd: 'getLog' }
    return this._send<logMSG>(message)
  }
  /**
   * 获取设置
   * 
   * @returns {Promise<configMSG>} 
   * @memberof Options
   */
  public getConfig(): Promise<configMSG> {
    let message = { cmd: 'getConfig' }
    return this._send<configMSG>(message)
  }
  /**
   * 保存设置
   * 
   * @param {config} data 
   * @returns {Promise<configMSG>} 
   * @memberof Options
   */
  public setConfig(data: config): Promise<configMSG> {
    let message = { cmd: 'setConfig', data }
    return this._send<configMSG>(message)
  }
  /**
   * 获取设置描述
   * 
   * @returns {Promise<infoMSG>} 
   * @memberof Options
   */
  public getInfo(): Promise<infoMSG> {
    let message = { cmd: 'getInfo' }
    return this._send<infoMSG>(message)
  }
  /**
   * 获取uid
   * 
   * @returns {Promise<userMSG>} 
   * @memberof Options
   */
  public getAllUID(): Promise<userMSG> {
    let message = { cmd: 'getAllUID' }
    return this._send<userMSG>(message)
  }
  /**
   * 获取用户设置
   * 
   * @param {string} uid 
   * @returns {Promise<userDataMSG>} 
   * @memberof Options
   */
  public getUserData(uid: string): Promise<userDataMSG> {
    let message = { cmd: 'getUserData', uid }
    return this._send<userDataMSG>(message)
  }
  /**
   * 保存用户设置
   * 
   * @param {string} uid 
   * @param {userData} data 
   * @param {string} [captcha] 
   * @returns {Promise<userDataMSG>} 
   * @memberof Options
   */
  public setUserData(uid: string, data: userData, captcha?: string): Promise<userDataMSG> {
    let message = { cmd: 'setUserData', uid, data, captcha }
    if (captcha != null) message.captcha = captcha
    return this._send<userDataMSG>(message)
  }
  /**
   * 删除用户
   * 
   * @param {string} uid 
   * @returns {Promise<userDataMSG>} 
   * @memberof Options
   */
  public delUserData(uid: string): Promise<userDataMSG> {
    let message = { cmd: 'delUserData', uid }
    return this._send<userDataMSG>(message)
  }
  /**
   * 设置新用户
   * 
   * @returns {Promise<userDataMSG>} 
   * @memberof Options
   */
  public newUserData(): Promise<userDataMSG> {
    let message = { cmd: 'newUserData' }
    return this._send<userDataMSG>(message)
  }
}