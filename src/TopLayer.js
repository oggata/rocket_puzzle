var TopLayer = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        //cc.sys.localStorage.clear();
        //////////////////////////////
        // 1. super init first
        this._super();

        this.sdkboxPlayInit();

        this.back = cc.Sprite.create("res/top.png");
        this.back.setAnchorPoint(0,0);
        this.addChild(this.back);

        this.storage = new Storage();
        try 
        {
            var _data = cc.sys.localStorage.getItem("ohedoStorage");
            if (_data == null) 
            {
                cc.log("dataはnullなので新たに作成します.");
                var _getData = this.storage.getDataFromStorage();
                cc.sys.localStorage.setItem("ohedoStorage", _getData);
                var _acceptData = cc.sys.localStorage.getItem("ohedoStorage");
                this.storage.setDataToStorage(JSON.parse(_acceptData));
            }
            if (_data != null) 
            {
                var storageData = JSON.parse(cc.sys.localStorage.getItem("ohedoStorage"));
                if (storageData["saveData"] == true) 
                {
                    cc.log("保存されたデータがあります");
                    var _acceptData = cc.sys.localStorage.getItem("ohedoStorage");
                    cc.log(_acceptData);
                    this.storage.setDataToStorage(JSON.parse(_acceptData));

                    if(this.storage.maxGameScore != 0){
                        this.sendScoreToGameCenter(this.storage.maxGameScore);
                    }
                }
                else 
                {
                    cc.log("保存されたデータはありません");
                    var _getData = this.storage.getDataFromStorage();
                    cc.sys.localStorage.setItem("ohedoStorage", _getData);
                    var _acceptData = cc.sys.localStorage.getItem("ohedoStorage");
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
            }
        }
        catch (e) {
            cc.log("例外..");
            cc.sys.localStorage.clear();
        }

        var startButton = new cc.MenuItemImage("res/button_start.png", "res/button_start_on.png", function() {
            this.goToStageLayer();
        }, this);
        startButton.setPosition(320,350);

        var scoreButton = new cc.MenuItemImage("res/button_score.png", "res/button_score_on.png", function() {
            this.showGameCenterLeaderboard();
        }, this);
        scoreButton.setPosition(320,240);

        var menu001 = new cc.Menu(startButton,scoreButton);
        menu001.setPosition(0,0);
        this.addChild(menu001);

        this.scheduleUpdate();
        return true;
    },

    update: function(dt) {

    },

    //シーンの切り替え----->
    goToStageLayer : function (pSender) 
    {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },

    showInfo: function(text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },

    admobInit: function() {
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginAdMob)) {
            this.showInfo('sdkbox.PluginAdMob is undefined')
            return;
        }

        var self = this
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            },
            adViewWillPresentScreen: function(name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function(name) {
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function(name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function(name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
            }
        });
        sdkbox.PluginAdMob.init();

        // just for test
        var plugin = sdkbox.PluginAdMob
        if ("undefined" != typeof(plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    },

    //GameCenter
    sdkboxPlayInit: function() {
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginSdkboxPlay)) {
            this.showInfo('sdkbox.PluginSdkboxPlay is undefined')
            return;
        }
        if ("undefined" != typeof(sdkbox.PluginSdkboxPlay)) {
            var plugin = sdkbox.PluginSdkboxPlay
            plugin.setListener({
                onScoreSubmitted: function(leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                    cc.log("on score " + score + " submitted to leaderboard: " + leaderboard_name);
                    cc.log("all time hi " + maxScoreAllTime ? 1 : 0);
                    cc.log("weekly hi " + maxScoreWeek ? 1 : 0);
                    cc.log("daily hi " + maxScoreToday ? 1 : 0);
                },
                onIncrementalAchievementUnlocked: function(achievement_name) {
                    cc.log("incremental achievement " + achievement_name + " unlocked.");
                },
                onIncrementalAchievementStep: function(achievement_name, step) {
                    cc.log("incremental achievent " + achievement_name + " step: " + step);
                },
                onAchievementUnlocked: function(achievement_name, newlyUnlocked) {
                    cc.log("achievement " + achievement_name + " unlocked (new " + newlyUnlocked ? 1 : 0 + ")");
                },
                onConnectionStatusChanged: function(connection_status) {
                    cc.log("connection status change: " + connection_status + " connection_status");
                }
            });
            plugin.init();

        } else {
            printf("no plugin init")
        }
    },

    showGameCenterLeaderboard: function() {
        cc.log("call showGameCenterLeaderboard");
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginSdkboxPlay)) {
            this.showInfo('sdkbox.PluginSdkboxPlay is undefined')
            return;
        }
        sdkbox.PluginSdkboxPlay.signin();
        sdkbox.PluginSdkboxPlay.showLeaderboard("ohedo_score_ranking");
        sdkbox.PluginSdkboxPlay.showAchievements();
    },

    sendScoreToGameCenter: function(score) {
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginSdkboxPlay)) {
            this.showInfo('sdkbox.PluginSdkboxPlay is undefined')
            return;
        }
        sdkbox.PluginSdkboxPlay.submitScore("ohedo_score_ranking", score);
    },
});

TopLayer.create = function () 
{
    return new TopLayer();
};

var TopLayerScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new TopLayer();
        this.addChild(layer);
    }
});