let options = new Options()
  , optionsInfo: optionsInfo
  , dDiv = <HTMLDivElement>document.querySelector('#ddd')
  , loginDiv = <HTMLDivElement>document.querySelector('#login')
  , optionDiv = <HTMLDivElement>document.querySelector('#option')
  , configDiv = <HTMLDivElement>document.querySelector('#config')
  , userDiv = <HTMLDivElement>document.querySelector('#user')
  , logDiv = <HTMLDivElement>document.querySelector('#log')
  , returnButton = <HTMLElement>document.querySelector('#logreturn')
  , modalDiv = <HTMLDivElement>document.querySelector('.modal')
  , template = <HTMLDivElement>document.querySelector('#template')
  // 3D效果
  , current: 'login' | 'option' | 'log' = 'login'
function danimation(name: string) {
  if (current === 'login') {
    optionDiv.classList.remove('d-none')
    logDiv.classList.remove('d-none')
  }
  else if (current === 'option') {
    loginDiv.classList.remove('d-none')
    logDiv.classList.remove('d-none')
  }
  else if (current === 'log') {
    loginDiv.classList.remove('d-none')
    optionDiv.classList.remove('d-none')
    returnButton.classList.add('d-none')
  }
  switch (name) {
    case 'login_to_option':
      loginDiv.style.cssText = ''
      break
    case 'option_to_log':
      optionDiv.style.cssText = ''
      break
    case 'log_to_option':
      logDiv.style.cssText = ''
      break
    case 'option_to_login':
      optionDiv.style.cssText = ''
      break
    case 'log_to_login':
      logDiv.style.cssText = ''
      break
    default:
      break
  }
  dDiv.className = name
}
dDiv.addEventListener('animationend', event => {
  switch ((<any>event).animationName) {
    case 'login_to_option':
      optionDiv.style.cssText = 'transform: rotateY(90deg);'
      current = 'option'
      break
    case 'option_to_log':
      logDiv.style.cssText = 'transform: rotateY(180deg);'
      current = 'log'
      break
    case 'log_to_option':
      optionDiv.style.cssText = 'transform: rotateY(90deg);'
      current = 'option'
      break
    case 'option_to_login':
      loginDiv.style.cssText = 'transform: rotateY(0deg);'
      current = 'login'
      break
    case 'log_to_login':
      loginDiv.style.cssText = 'transform: rotateY(0deg);'
      current = 'login'
      break
    default:
      break
  }
  if (current === 'login') {
    optionDiv.classList.add('d-none')
    logDiv.classList.add('d-none')
  }
  else if (current === 'option') {
    loginDiv.classList.add('d-none')
    logDiv.classList.add('d-none')
  }
  else if (current === 'log') {
    loginDiv.classList.add('d-none')
    optionDiv.classList.add('d-none')
    returnButton.classList.remove('d-none')
  }
})
/**
 * 显示登录界面
 * 
 */
function showLogin() {
  let pathInput = <HTMLInputElement>loginDiv.querySelector('#path input')
    , protocolInput = <HTMLInputElement>loginDiv.querySelector('#protocol input[type="text"]')
    , keepInput = <HTMLInputElement>loginDiv.querySelector('#protocol input[type="checkbox"]')
    , connectButton = <HTMLElement>loginDiv.querySelector('#connect button')
    , connectSpan = <HTMLSpanElement>loginDiv.querySelector('#connect span')
  connectButton.onclick = async () => {
    let protocols = [protocolInput.value]
    if (keepInput.checked) protocols.push('keep')
    let connected = await options.connect(pathInput.value, protocols)
    if (connected) login()
    else connectSpan.innerText = '连接失败'
  }
  loginDiv.style.cssText = 'transform: rotateY(0deg);'
  loginDiv.classList.remove('d-none')
}
/**
 * 登录成功
 * 
 */
async function login() {
  let infoMSG = await options.getInfo()
  optionsInfo = infoMSG.data
  // 处理错误信息
  options.onerror = (event) => {
    modal({ body: event.data })
  }
  options.onwserror = () => wsClose('连接发生错误')
  options.onwsclose = (event) => {
    try {
      let msg: message = JSON.parse(event.reason)
      wsClose('连接已关闭 ' + msg.msg)
    } catch (error) {
      wsClose('连接已关闭')
    }
  }
  danimation('login_to_option')
  await showConfig()
  await showUser()
  showLog()
}
/**
 * 加载全局设置
 * 
 */
async function showConfig() {
  let saveConfigButton = <HTMLElement>document.querySelector('#saveConfig')
    , addUserButton = <HTMLElement>document.querySelector('#addUser')
    , showLogButton = <HTMLElement>document.querySelector('#showLog')
    , configMSG = await options.getConfig()
    , config = configMSG.data
    , configDF = getConfigTemplate(config)
  // 保存全局设置
  saveConfigButton.onclick = async () => {
    modal()
    let configMSG = await options.setConfig(config)
    if (configMSG.msg != null) modal({ body: configMSG.msg })
    else {
      config = configMSG.data
      let configDF = getConfigTemplate(config)
      configDiv.innerText = ''
      configDiv.appendChild(configDF)
      modal({ body: '保存成功' })
    }
  }
  // 添加新用户
  addUserButton.onclick = async () => {
    modal()
    let userDataMSG = await options.newUserData()
      , uid = userDataMSG.uid
      , userData = userDataMSG.data
      , userDF = getUserDF(uid, userData)
    userDiv.appendChild(userDF)
    modal({ body: '添加成功' })
  }
  // 显示日志
  showLogButton.onclick = () => {
    danimation('option_to_log')
  }
  configDiv.appendChild(configDF)
}
/**
 * 加载Log
 * 
 */
async function showLog() {
  let logMSG = await options.getLog()
    , logs = logMSG.data
    , logDF = document.createDocumentFragment()
  logs.forEach(log => {
    let div = document.createElement('div')
    div.innerText = log
    logDF.appendChild(div)
  })
  options.onlog = data => {
    let div = document.createElement('div')
    div.innerText = data
    logDiv.appendChild(div)
    if (logDiv.scrollHeight - logDiv.clientHeight - logDiv.scrollTop < 2 * div.offsetHeight) logDiv.scrollTop = logDiv.scrollHeight
  }
  returnButton.onclick = () => {
    danimation('log_to_option')
  }
  logDiv.appendChild(logDF)
}
/**
 * 加载用户设置
 * 
 */
async function showUser() {
  let userMSG = await options.getAllUID()
    , uidArray = userMSG.data
    , df = document.createDocumentFragment()
  for (let uid of uidArray) {
    let userDataMSG = await options.getUserData(uid)
      , userData = userDataMSG.data
      , userDF = getUserDF(uid, userData)
    df.appendChild(userDF)
  }
  userDiv.appendChild(df)
}
/**
 * 新建用户模板
 * 
 * @param {string} uid 
 * @param {userData} userData 
 * @returns {DocumentFragment} 
 */
function getUserDF(uid: string, userData: userData): DocumentFragment {
  let userTemplate = <HTMLTemplateElement>template.querySelector('#userTemplate')
    , clone = document.importNode(userTemplate.content, true)
    , userDataDiv = <HTMLDivElement>clone.querySelector('.userData')
    , userConfigDiv = <HTMLDivElement>clone.querySelector('.userConfig')
    , saveUserButton = <HTMLElement>clone.querySelector('.saveUser')
    , deleteUserButton = <HTMLElement>clone.querySelector('.deleteUser')
    , userConfigDF = getConfigTemplate(userData)
  userConfigDiv.appendChild(userConfigDF)
  // 保存用户设置
  let captcha: string | undefined = undefined
  saveUserButton.onclick = async () => {
    modal()
    let userDataMSG = await options.setUserData(uid, userData, captcha)
    captcha = undefined
    if (userDataMSG.msg == null) {
      modal({ body: '保存成功' })
      userData = userDataMSG.data
      let userConfigDF = getConfigTemplate(userData)
      userConfigDiv.innerText = ''
      userConfigDiv.appendChild(userConfigDF)
    }
    else if (userDataMSG.msg === 'captcha' && userDataMSG.captcha != null) {
      let captchaTemplate = <HTMLTemplateElement>template.querySelector('#captchaTemplate')
        , clone = document.importNode(captchaTemplate.content, true)
        , captchaImg = <HTMLImageElement>clone.querySelector('img')
        , captchaInput = <HTMLInputElement>clone.querySelector('input')
      captchaImg.src = userDataMSG.captcha
      modal({
        body: clone,
        showOK: true,
        onOK: () => {
          captcha = captchaInput.value
          saveUserButton.click()
        }
      })
    }
    else modal({ body: userDataMSG.msg })
  }
  // 删除用户设置
  deleteUserButton.onclick = async () => {
    modal()
    let userDataMSG = await options.delUserData(uid)
    if (userDataMSG.msg != null) modal({ body: userDataMSG.msg })
    else {
      modal({ body: '删除成功' })
      userDataDiv.remove()
    }
  }
  return clone
}
/**
 * 设置模板
 * 
 * @param {(config | userData)} config 
 * @returns {DocumentFragment} 
 */
function getConfigTemplate(config: config | userData): DocumentFragment {
  let df = document.createDocumentFragment()
  for (let key in config) {
    let info = optionsInfo[key]
    if (info == null) continue
    let configValue = config[key]
      , configTemplate: HTMLTemplateElement
    if (info.type === 'boolean') configTemplate = <HTMLTemplateElement>template.querySelector('#configCheckboxTemplate')
    else configTemplate = <HTMLTemplateElement>template.querySelector('#configTextTemplate')
    let clone = document.importNode(configTemplate.content, true)
      , descriptionDiv = <HTMLDivElement>clone.querySelector('._description')
      , inputInput = <HTMLInputElement>clone.querySelector('input')
    switch (info.type) {
      case 'number':
        inputInput.value = (<number>configValue).toString()
        inputInput.oninput = () => config[key] = parseInt(inputInput.value)
        break
      case 'numberArray':
        inputInput.value = (<number[]>configValue).join(',')
        inputInput.oninput = () => config[key] = inputInput.value.split(',').map(value => { return parseInt(value) })
        break
      case 'string':
        inputInput.value = (<string>configValue)
        inputInput.oninput = () => config[key] = inputInput.value
        break
      case 'boolean':
        inputInput.type = 'checkbox'
        inputInput.checked = <boolean>configValue
        inputInput.onchange = () => config[key] = inputInput.checked
        break
      default:
        break
    }
    descriptionDiv.innerText = info.description
    descriptionDiv.title = info.tip
    $(descriptionDiv).tooltip()
    df.appendChild(clone)
  }
  return df
}
/**
 * 处理连接中断
 * 
 * @param {string} data 
 */
function wsClose(data: string) {
  let connectSpan = <HTMLSpanElement>loginDiv.querySelector('#connect span')
  configDiv.innerText = ''
  logDiv.innerText = ''
  userDiv.innerText = ''
  connectSpan.innerText = data
  if (current === 'option') danimation('option_to_login')
  else danimation('log_to_login')
}
/**
 * 弹窗提示
 * 无参数时只显示遮罩
 * 
 * @param {modalOPtions} [options] 
 */
function modal(options?: modalOPtions) {
  if (options != null) {
    let modalDialogDiv = <HTMLDivElement>modalDiv.querySelector('.modal-dialog')
      , modalTemplate = <HTMLTemplateElement>template.querySelector('#modalContentTemplate')
      , clone = document.importNode(modalTemplate.content, true)
      , headerTitle = <HTMLHeadingElement>clone.querySelector('.modal-header .modal-title')
      , headerClose = <HTMLElement>clone.querySelector('.modal-header .close')
      , modalBody = <HTMLDivElement>clone.querySelector('.modal-body')
      , footerClose = <HTMLElement>clone.querySelector('.modal-footer .btn-secondary')
      , footerOK = <HTMLElement>clone.querySelector('.modal-footer .btn-primary')
    headerClose.onclick = footerClose.onclick = () => {
      $(modalDiv).one('hidden.bs.modal', () => {
        modalDialogDiv.innerText = ''
        if (typeof options.onClose === 'function') options.onClose(options.body)
      })
      $(modalDiv).modal('hide')
    }
    footerOK.onclick = () => {
      $(modalDiv).one('hidden.bs.modal', () => {
        modalDialogDiv.innerText = ''
        if (typeof options.onOK === 'function') options.onOK(options.body)
      })
      $(modalDiv).modal('hide')
    }
    if (options.body instanceof DocumentFragment) modalBody.appendChild(options.body)
    else modalBody.innerText = options.body
    if (options.title != null) headerTitle.innerText = options.title
    if (options.close != null) footerClose.innerText = options.close
    if (options.ok != null) footerOK.innerText = options.ok
    if (options.showOK) footerOK.classList.remove('d-none')
    modalDialogDiv.appendChild(clone)
  }
  $(modalDiv).modal({ backdrop: 'static', keyboard: false })
}
showLogin()