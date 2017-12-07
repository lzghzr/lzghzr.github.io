"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/// <reference path="options.ts" />
var App;
(function (App) {
    var options = new App.Options(), optionsInfo, template = document.querySelector('#template');
    /**
     * 显示登录界面
     *
     */
    function showLogin() {
        var _this = this;
        var loginDiv = document.querySelector('#login'), pathInput = loginDiv.querySelector('#path input'), protocolInput = loginDiv.querySelector('#protocol input'), connectInput = loginDiv.querySelector('#connect input'), connectSpan = loginDiv.querySelector('#connect span');
        connectInput.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            var connected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, options.connect(pathInput.value, protocolInput.value)];
                    case 1:
                        connected = _a.sent();
                        if (connected) {
                            pathInput.value = '';
                            protocolInput.value = '';
                            loginDiv.classList.add('hide');
                            login();
                        }
                        else
                            connectSpan.innerText = '连接失败';
                        return [2 /*return*/];
                }
            });
        }); };
        loginDiv.classList.remove('hide');
    }
    /**
     * 登录成功
     *
     */
    function login() {
        return __awaiter(this, void 0, void 0, function () {
            var optionDiv, infoMSG;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionDiv = document.querySelector('#option');
                        return [4 /*yield*/, options.getInfo()];
                    case 1:
                        infoMSG = _a.sent();
                        optionsInfo = infoMSG.data;
                        // 处理错误信息
                        options.onerror = function (event) {
                            alert(event.data);
                        };
                        options.onwserror = function () {
                            document.body.innerText = 'connection error';
                        };
                        options.onwsclose = function (event) {
                            try {
                                var msg = JSON.parse(event.reason);
                                document.body.innerText = msg.msg;
                            }
                            catch (error) {
                                document.body.innerText = 'connection closed';
                            }
                        };
                        return [4 /*yield*/, showConfig()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, showUser()];
                    case 3:
                        _a.sent();
                        optionDiv.classList.remove('hide');
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 加载全局设置
     *
     */
    function showConfig() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var configDiv, saveConfigInput, configMSG, config, configDF, logDiv, logMSG, logs, logDF;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configDiv = document.querySelector('#config'), saveConfigInput = document.querySelector('#saveConfig');
                        return [4 /*yield*/, options.getConfig()];
                    case 1:
                        configMSG = _a.sent(), config = configMSG.data, configDF = getConfigTemplate(config);
                        // 保存全局设置
                        saveConfigInput.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                            var configMSG, configDF_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, options.setConfig(config)];
                                    case 1:
                                        configMSG = _a.sent();
                                        if (configMSG.msg != null)
                                            alert(configMSG.msg);
                                        else {
                                            alert('保存成功');
                                            config = configMSG.data;
                                            configDF_1 = getConfigTemplate(config);
                                            configDiv.innerText = '';
                                            configDiv.appendChild(configDF_1);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        configDiv.appendChild(configDF);
                        logDiv = document.querySelector('#log');
                        return [4 /*yield*/, options.getLog()];
                    case 2:
                        logMSG = _a.sent(), logs = logMSG.data, logDF = document.createDocumentFragment();
                        logs.forEach(function (log) {
                            var div = document.createElement('div');
                            div.innerText = log;
                            logDF.appendChild(div);
                        });
                        options.onlog = function (data) {
                            var div = document.createElement('div');
                            div.innerText = data;
                            logDiv.appendChild(div);
                        };
                        logDiv.appendChild(logDF);
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 加载用户设置
     *
     */
    function showUser() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var userDiv, addUserDiv, userMSG, uidArray, df, _i, uidArray_1, uid, userDataMSG, userData, userDF;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userDiv = document.querySelector('#user'), addUserDiv = document.querySelector('#addUser');
                        return [4 /*yield*/, options.getAllUID()];
                    case 1:
                        userMSG = _a.sent(), uidArray = userMSG.data, df = document.createDocumentFragment();
                        _i = 0, uidArray_1 = uidArray;
                        _a.label = 2;
                    case 2:
                        if (!(_i < uidArray_1.length)) return [3 /*break*/, 5];
                        uid = uidArray_1[_i];
                        return [4 /*yield*/, options.getUserData(uid)];
                    case 3:
                        userDataMSG = _a.sent(), userData = userDataMSG.data, userDF = getUserDF(uid, userData);
                        df.appendChild(userDF);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // 添加新用户
                        addUserDiv.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                            var userDataMSG, uid, userData, userDF;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, options.newUserData()];
                                    case 1:
                                        userDataMSG = _a.sent(), uid = userDataMSG.uid, userData = userDataMSG.data, userDF = getUserDF(uid, userData);
                                        userDiv.appendChild(userDF);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        userDiv.appendChild(df);
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 新建用户模板
     *
     * @param {string} uid
     * @param {userData} userData
     * @returns {DocumentFragment}
     */
    function getUserDF(uid, userData) {
        var _this = this;
        var userTemplate = template.querySelector('#userTemplate'), clone = document.importNode(userTemplate.content, true), userDataDiv = clone.querySelector('.userData'), userConfigDiv = clone.querySelector('.userConfig'), saveUserInput = clone.querySelector('.saveUser'), deleteUserInput = clone.querySelector('.deleteUser'), userConfigDF = getConfigTemplate(userData);
        userConfigDiv.appendChild(userConfigDF);
        // 保存用户设置
        saveUserInput.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            var userDataMSG, userConfigDF_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, options.setUserData(uid, userData)];
                    case 1:
                        userDataMSG = _a.sent();
                        if (userDataMSG.msg != null)
                            alert(userDataMSG.msg);
                        else {
                            alert('保存成功');
                            userData = userDataMSG.data;
                            userConfigDF_1 = getConfigTemplate(userData);
                            userConfigDiv.innerText = '';
                            userConfigDiv.appendChild(userConfigDF_1);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        // 删除用户设置
        deleteUserInput.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            var userDataMSG;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, options.delUserData(uid)];
                    case 1:
                        userDataMSG = _a.sent();
                        if (userDataMSG.msg != null)
                            alert(userDataMSG.msg);
                        else {
                            alert('删除成功');
                            userDataDiv.remove();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        return clone;
    }
    /**
     * 设置模板
     *
     * @param {(config | userData)} config
     * @returns {DocumentFragment}
     */
    function getConfigTemplate(config) {
        var df = document.createDocumentFragment();
        var _loop_1 = function (key) {
            var info = optionsInfo[key] || {}, configValue = config[key], configTemplate = template.querySelector('#configTemplate'), clone = document.importNode(configTemplate.content, true), descriptionDiv = clone.querySelector('.description'), tipDiv = clone.querySelector('.tip'), inputInput = clone.querySelector('input');
            switch (info.type) {
                case 'number':
                    inputInput.type = 'text';
                    inputInput.value = configValue.toString();
                    inputInput.oninput = function () {
                        config[key] = parseInt(inputInput.value);
                    };
                    break;
                case 'numberArray':
                    inputInput.type = 'text';
                    inputInput.value = configValue.join(',');
                    inputInput.oninput = function () {
                        config[key] = inputInput.value.split(',').map(function (value) { return parseInt(value); });
                    };
                    break;
                case 'string':
                    inputInput.type = 'text';
                    inputInput.value = configValue;
                    inputInput.oninput = function () {
                        config[key] = inputInput.value;
                    };
                    break;
                case 'boolean':
                    inputInput.type = 'checkbox';
                    inputInput.checked = configValue;
                    inputInput.onchange = function () {
                        config[key] = inputInput.checked;
                    };
                    break;
                default:
                    break;
            }
            descriptionDiv.innerText = info.description;
            tipDiv.innerText = info.tip;
            df.appendChild(clone);
        };
        for (var key in config) {
            _loop_1(key);
        }
        return df;
    }
    showLogin();
})(App || (App = {}));
//# sourceMappingURL=script.js.map