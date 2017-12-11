interface Window {
  Options: Options
}
// WebSocket消息
interface message {
  cmd: string
  msg?: string
  ts?: string
  uid?: string
  data?: config | optionsInfo | string[] | userData
}
interface logMSG extends message {
  data: string[]
}
interface configMSG extends message {
  data: config
}
interface infoMSG extends message {
  data: optionsInfo
}
interface userMSG extends message {
  data: string[]
}
interface userDataMSG extends message {
  uid: string
  data: userData
}
// 应用设置
interface config {
  [index: string]: number | string | number[]
  defaultUserID: number
  defaultRoomID: number
  apiOrigin: string
  apiKey: string
  eventRooms: number[]
  beatStormBlackList: number[]
}
interface userData {
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
interface optionsInfo {
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
interface configInfoData {
  description: string
  tip: string
  type: string
}