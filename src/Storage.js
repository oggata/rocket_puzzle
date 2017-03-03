//
//  Storage.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Storage = cc.Class.extend(
{
    ctor : function () 
    {
        this.clearedStageData = new Object();
        this.playerName = "xxxxx";
        this.totalGameScore = 0;
        this.totalCoinAmount = 0;
        this.maxGameScore = 0;
        this.bgmVolume = 10;
        this.seVolume = 10;
    },

    init : function () { },

    saveClearedDataToStorage : function(stageNum,inputScore,maxGameScore) 
    {
        //totalScoreを足す
        this.totalGameScore+=inputScore;

        //すでにある場合は、設定値の変更
        var savedData = this.clearedStageData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputStageNumber = "st" + stageNum;
                if(savedDataKey == inputStageNumber)
                {
                    //スコアが上だったら、同じハッシュを上書きする
                    var savedDataObj = JSON.parse(savedDataValue);
                    if(savedDataObj['score'] <= inputScore)
                    {
                        var _txt = '{"id":' + stageNum + ',"maxGameScore":' + maxGameScore + ',"score":' + inputScore + ',"bgmVolume":' + this.bgmVolume + ',"seVolume":' + this.seVolume + ',"updated_time":' + 12345 + '}';
                        this.clearedStageData["st" + stageNum] = _txt;
                    }
                    //変更
                    _updateCnt+=1;
                }
            }
        }
        var _updateCnt = 0;
        if(_updateCnt == 0)
        {
            var _txt = '{"id":' + stageNum + ',"maxGameScore":' + maxGameScore + ',"score":' + inputScore + ',"bgmVolume":' + this.bgmVolume + ',"seVolume":' + this.seVolume + ',"updated_time":' + 12345 + '}';
            this.clearedStageData["st" + stageNum] = _txt;
        }

        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("ohedoStorage",_getData);
    },

    saveCurrentData : function()
    {
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("ohedoStorage",_getData);
    },

    getDataFromStorage : function ()
    {
        var _clearedStageData = '';
        var stData = this.clearedStageData;
        var keyCnt = Object.keys(stData).length;
        var incKeyCnt = 1;
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                _clearedStageData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _clearedStageData += ',';
                }
                incKeyCnt++;
            }
        }
        //return '{"saveData" : true, "clearedStageData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}';
        var rtn = '{';
        rtn += '"saveData" : true,';
        rtn += '"clearedStageData":{' + _clearedStageData + '},';
        rtn += '"playerName" :"' + this.playerName + '",';
        rtn += '"totalGameScore" :' + this.totalGameScore + ',';
        rtn += '"maxGameScore" :' + this.maxGameScore + ',';
        rtn += '"bgmVolume" :' + this.bgmVolume + ',';
        rtn += '"seVolume" :' + this.seVolume + ',';
        rtn += '"totalCoinAmount" :' + this.totalCoinAmount + '';
        rtn += '}';
        /*
        cc.log("------------------------>");
        cc.log(rtn);
        cc.log('{"saveData" : true, "clearedStageData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}');
        cc.log("------------------------>");
        */
        return rtn;
    },

    setDataToStorage : function (getData)
    {
        this.clearedStageData = new Object();
        var stData = getData['clearedStageData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.clearedStageData[key] = value;
            }
        }
        this.playerName       = getData["playerName"];
        this.totalGameScore   = getData["totalGameScore"];
        this.totalCoinAmount  = getData["totalCoinAmount"];
        this.maxGameScore        = getData["maxGameScore"];
        this.bgmVolume        = getData["bgmVolume"];
        this.seVolume         = getData["seVolume"];
    },

    initSDK : function() 
    {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            var plugin = sdkbox.PluginShare
            plugin.setListener({
              onShareState: function(response) {
                console.log("PluginShare onSharestate:" + response.state + " error:" + response.error)
                if (response.state == sdkbox.PluginShare.ShareState.ShareStateSuccess) {
                    console.log("post success")
                }
            }
            })
            plugin.init()
            //plugin.logout()
            console.log('Share plugin initialized')
        } else {
            console.log("no plugin init")
        }
    },

    invokeSDK : function() 
    {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            console.log('share post')
            var plugin = sdkbox.PluginShare
            plugin.share( {text : "iPhoneアプリ『ネコダン』でにゃんこ大量発生注意報！! https://itunes.apple.com/us/app/id1058265886"} );
        } else {
            console.log("no plugin invoked")
        }
    },

    invokeSDK2 : function() 
    {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            console.log('share post')
            var plugin = sdkbox.PluginShare;
            if(this.totalGameScore == 0)
            {
                plugin.share( {text : "iPhoneアプリ『ネコダン』を始めたニャ！! https://itunes.apple.com/us/app/id1084127955"} );
            }else{
                plugin.share( {text : "iPhoneアプリ『ネコダン』で" + this.totalGameScore + "匹集めたニャ！! https://itunes.apple.com/us/app/id1084127955"} );
            }
        } else {
            console.log("no plugin invoked")
        }
    }
});

var saveData = function (storage)
{
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    this.storage = new Storage();
    if (platform == 100 || platform == 101)
    {
        var toObjString = storage.getJson();
        var toObj = JSON.parse(toObjString);
        window.localStorage.setItem("ohedoStorage", JSON.stringify(toObj));
    }
};

var changeLoadingImage = function ()
{
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    if (platform == 100 || platform == 101)
    {
        //ローディング画像を変更
        var loaderScene = new cc.LoaderScene();
        loaderScene.init();
        loaderScene._logoTexture.src = "res/loading.png";
        loaderScene._logoTexture.width = 104;
        loaderScene._logoTexture.height = 215;
        cc.LoaderScene._instance = loaderScene;
    }
};