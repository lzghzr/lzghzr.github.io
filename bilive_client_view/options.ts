namespace App {
  /**
   * 与服务器进行通信并返回结果
   * 
   * @export
   * @class Options
   */
  export class Options {
    constructor() {
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
     * @param {string} [protocol=''] 
     * @returns {Promise<boolean>} 
     * @memberof Options
     */
    public connect(path: string, protocol = ''): Promise<boolean> {
      return new Promise(resolve => {
        try {
          let ws = new WebSocket(path, protocol)
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
      this._ws.onerror = (data) => {
        this.close()
        if (typeof this.onwserror === 'function') this.onwserror(data)
        else console.error(data)
      }
      this._ws.onclose = (data) => {
        this.close()
        if (typeof this.onwsclose === 'function') this.onwsclose(data)
        else console.error(data)
      }
      this._ws.onmessage = (data) => {
        let message: message = JSON.parse(data.data)
          , ts = message.ts
        if (ts != null && typeof this.__callback[ts] === 'function') {
          delete message.ts
          this.__callback[ts](message)
          delete this.__callback[ts]
        }
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
        }, 3e+4) // 30秒
        let ts = this._ts
        message.ts = ts
        this.__callback[ts] = (msg: T) => {
          clearTimeout(timeout)
          resolve(msg)
        }
        let msg = JSON.stringify(message)
        if (this._ws.readyState === this._ws.OPEN) this._ws.send(msg)
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
     * @returns {Promise<userDataMSG>} 
     * @memberof Options
     */
    public setUserData(uid: string, data: userData): Promise<userDataMSG> {
      let message = { cmd: 'setUserData', uid, data }
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
  // WebSocket消息
  export interface message {
    cmd: string
    msg?: string
    ts?: string
    uid?: string
    data?: config | optionsInfo | string[] | userData
  }
  export interface configMSG extends message {
    data: config
  }
  export interface infoMSG extends message {
    data: optionsInfo
  }
  export interface userMSG extends message {
    data: string[]
  }
  export interface userDataMSG extends message {
    uid: string
    data: userData
  }
  // 应用设置
  export interface config {
    [index: string]: number | string | number[]
    defaultUserID: number
    defaultRoomID: number
    apiOrigin: string
    apiKey: string
    eventRooms: number[]
    beatStormBlackList: number[]
  }
  export interface userData {
    [index: string]: string | boolean
    nickname: string
    userName: string
    passWord: string
    accessToken: string
    cookie: string
    status: boolean
    doSign: boolean
    treasureBox: boolean
    eventRoom: boolean
    smallTV: boolean
    raffle: boolean
    beatStorm: boolean
    debug: boolean
  }
  export interface optionsInfo {
    [index: string]: configInfoData
    defaultUserID: configInfoData
    defaultRoomID: configInfoData
    apiOrigin: configInfoData
    apiKey: configInfoData
    eventRooms: configInfoData
    beatStormBlackList: configInfoData
    beatStormLiveTop: configInfoData
    nickname: configInfoData
    userName: configInfoData
    passWord: configInfoData
    accessToken: configInfoData
    cookie: configInfoData
    status: configInfoData
    doSign: configInfoData
    treasureBox: configInfoData
    eventRoom: configInfoData
    smallTV: configInfoData
    raffle: configInfoData
    beatStorm: configInfoData
    debug: configInfoData
  }
  export interface configInfoData {
    description: string
    tip: string
    type: string
  }
}