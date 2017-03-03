var item001Cnt = 0;
var isCancelAd = false;
var isFailedAd = false;

var GameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function(storage) {
        this._super();
        this.viewSize = cc.director.getVisibleSize();

        item001Cnt = 0;
        isCancelAd = false;
        isFailedAd = false;

        this.storage = storage;

        playBGM(this.storage);
        var size = cc.winSize;
        this.isMapMoving = false;

        this.maxTurnCnt = 50;
        this.visibleTurnCnt = this.maxTurnCnt;
        this.turnCnt = 0;
        this.tmpTurnCnt = -1;

        this.markerSpeed = 50;
        this.updateCnt = 0;
        this.isAdAvailable = false;
        this.status = "gaming";
        this.score = 0;
        this.visibleScore = 0;
        this.tmpMoveDirection = null;
        this.entryData = [];
        this.baseWidth = 147;
        this.baseHeight = 149;
        this.baseTopHeight = 90;
        this.blockPosY = 450;
        this.retryCnt = 0;

        this.launchedMarkers = [];

        this.back = cc.Sprite.create("res/back.png");
        this.back.setAnchorPoint(0,0);
        this.addChild(this.back);

        this.scoreBack = cc.Sprite.create("res/score_back.png");
        this.scoreBack.setAnchorPoint(0,0);
        this.scoreBack.setPosition(10,this.viewSize.height-176);
        this.addChild(this.scoreBack);

        this.footerAdCnt = 0;

        //infoad
        this.infoad = cc.Sprite.create("res/info_ad.png");
        this.infoad.setPosition(320,600);
        this.addChild(this.infoad,99999999);
        this.infoad.setVisible(false);

        var okButton = new cc.MenuItemImage("res/button_watch_movie.png", "res/button_watch_movie.png", function() {
            this.status = "watch_ad";
            //gameover時に出力するadを表示
            if ('undefined' == typeof(sdkbox)) {
                cc.log('sdkbox is undefined');
                return;
            } else {
                if (sdkbox.PluginAdMob.isAvailable("gameover")) {
                    sdkbox.PluginAdMob.show("gameover");
                } else {
                    cc.log('adMob: admob interstitial ad is not ready');
                }
            }

        }, this);
        okButton.setPosition(320-237/2-80,-70);

        var cancelButton = new cc.MenuItemImage("res/button_watch_movie_cancel.png", "res/button_watch_movie_cancel.png", function() {
            this.status = "gameover";
            this.infoad.setVisible(false);
            this.gameover.setVisible(true);
        }, this);
        cancelButton.setPosition(320-237/2-80 + 240,-70);

        var menu001 = new cc.Menu(okButton,cancelButton);
        menu001.setPosition(0,0);
        this.infoad.addChild(menu001);

        //gameover
        this.gameover = cc.Sprite.create("res/gameover.png");
        this.gameover.setPosition(320,this.viewSize.height/2);
        this.addChild(this.gameover,99999999);
        this.gameover.setVisible(false);

        this.homeButton = new cc.MenuItemImage("res/button_return_to_top.png", "res/button_return_to_top.png", function() {
            if (sdkbox.PluginAdMob.isAvailable("gameover")) {
                sdkbox.PluginAdMob.show("gameover");
            } else {
                cc.log('adMob: admob interstitial footer ad is not ready');
            }
            this.goToTopLayer();
        }, this);
        this.homeButton.setPosition(500,65);
        this.menu002 = new cc.Menu(this.homeButton);
        this.menu002.setPosition(0,0);
        this.gameover.addChild(this.menu002,999999999);

        //give item
        this.infoad2 = new cc.MenuItemImage("res/info_ad2.png", "res/info_ad2.png", function() {
            this.infoad.setVisible(false);
            this.infoad2.setVisible(false);
            this.mixRandMarkers();
        }, this);
        this.infoad2.setPosition(320,600);
        this.infoad2.setVisible(false);
        this.menu003 = new cc.Menu(this.infoad2);
        this.menu003.setPosition(0,0);
        this.addChild(this.menu003,999999999);

        this.scoreLabel = new cc.LabelTTF(this.visibleScore, "Arial", 50);
        this.scoreLabel.setFontFillColor(new cc.Color(255, 191, 0, 255));
        this.scoreLabel.setAnchorPoint(1,0);
        this.scoreLabel.setPosition(255,this.viewSize.height-106);
        this.addChild(this.scoreLabel, 5);

        this.bestScoreLabel = new cc.LabelTTF(this.storage.maxGameScore, "Arial", 28);
        this.bestScoreLabel.setFontFillColor(new cc.Color(255, 191, 0, 255));
        this.bestScoreLabel.setAnchorPoint(1,0);
        this.bestScoreLabel.setPosition(185,this.viewSize.height-166);
        this.addChild(this.bestScoreLabel, 5);

        this.baseData = [];
        this.setBasedata();

        var tutorialButton = new cc.MenuItemImage("res/button_howto.png", "res/button_howto.png", function() {
            if(this.tutorial.isVisible() == true){
                this.tutorial.setVisible(false);
            }else{
                this.tutorial.setVisible(true);
            }
        }, this);
        tutorialButton.setPosition(590,1060);

        var menu005 = new cc.Menu(tutorialButton);
        menu005.setPosition(0,0);
        this.addChild(menu005,9999999999);

        this.tutorial = cc.Sprite.create("res/tutorial001.png");
        this.tutorial.setAnchorPoint(0,0);
        this.tutorial.setPosition(0,0);
        this.addChild(this.tutorial,99999999);
        this.tutorial.setVisible(false);

        this.markers = [];
        for (var i = 0; i < 16; i++) {
            this.marker = cc.Sprite.create("res/base.png");
            this.marker.setAnchorPoint(0.5,0);
            this.marker.setPosition(this.baseData[i].posX, this.baseData[i].posY);
            this.marker.baseData = this.baseData[i];
            this.addChild(this.marker);
            this.markers.push(this.marker);
        }

        //touch
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchStart(touches[0].getLocation());
            },
            onTouchesMoved: function(touches, event) {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchMove(touches[0].getLocation());
            },
            onTouchesEnded: function(touches, event) {
                event.getCurrentTarget().touchFinish(touches[0].getLocation());
            }
        }), this);

        this.admobInit();
        this.scheduleUpdate();

        return true;
    },

    update: function(dt) {

/*
        if ('undefined' == typeof(sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginSdkboxPlay)) {
            this.showInfo('sdkbox.PluginSdkboxPlay is undefined')
            return;
        }
*/

        //footerのadを表示する
        this.footerAdCnt++;
        if(this.footerAdCnt == 30 * 5){
            this.footerAdCnt = 30 * 999;
            if (sdkbox.PluginAdMob.isAvailable("footer")) {
                sdkbox.PluginAdMob.show("footer");
            } else {
                cc.log('adMob: admob interstitial footer ad is not ready');
            }
        }

        //Ad cancel
        if(isCancelAd == true && isFailedAd == false){
            isCancelAd = false;
            this.infoad.setVisible(true);
        }

        //アイテムを付与しました.
        if(item001Cnt == 1){
            item001Cnt = 0;
            this.infoad.setVisible(false);
            this.infoad2.setVisible(true);
            this.retryCnt += 1;
            isCancelAd = false;
        }
 
        //スコア表示
        if(this.visibleScore < this.score){
            this.visibleScore += 1;
        }
        this.scoreLabel.setString(this.visibleScore);
        this.bestScoreLabel.setString(this.storage.maxGameScore);

        //発射後のロケットの制御
        for (var i = 0; i < this.launchedMarkers.length; i++) {
            this.launchedMarkers[i].y += 4;
            this.reorderChild(
                this.launchedMarkers[i],
                Math.floor(99999999 + this.launchedMarkers[i].posX + this.launchedMarkers[i].posY)
            );
        }

        //sort
        for (var i = 0; i < this.markers.length; i++) {
            this.reorderChild(
                this.markers[i],
                Math.floor(999999 + this.markers[i].baseData.x + this.markers[i].baseData.y)
            );
        }

        for (var i = 0; i < this.entryData.length; i++) {
            this.reorderChild(
                this.entryData[i].sprite,
                Math.floor(999999 + this.entryData[i].x + this.entryData[i].y)
            );
        }

        for (var i = 0; i < this.entryData.length; i++) {
            this.entryData[i].startCnt+=1;
            if(0 <= this.entryData[i].startCnt && this.entryData[i].startCnt <= 4){
                this.entryData[i].imgScale += 0.125;
            }else{
                this.entryData[i].imgScale -= 0.125;
            }
            if(this.entryData[i].imgScale < 1){
                this.entryData[i].imgScale = 1;
            }
            if(this.entryData[i].imgScale > 2){
                this.entryData[i].imgScale = 2;
            }
            this.entryData[i].sprite.setScale(this.entryData[i].imgScale,this.entryData[i].imgScale);
        }

        this.movePosition();
    },

    setMoveMarkerPosition: function(_nextPosX, _nextPosY, entryData, pattern) {
        if (_nextPosX >= 1 && _nextPosX <= 4 && _nextPosY >= 1 && _nextPosY <= 4) {
            var _isExisMarker = false;
            for (var j = 0; j < this.entryData.length; j++) {

                //移動先に誰かいた場合
                if (_nextPosX == this.entryData[j].x && _nextPosY == this.entryData[j].y) {
                    //lvが違えば存在しているとなり移動はできない
                    if (entryData.lv != this.entryData[j].lv) {
                        _isExisMarker = true;
                    }

                    //lvが同じであれば移動する方と元の方合わせてremoveして新規追加する
                    if (entryData.lv == this.entryData[j].lv) {
                        this.entryData[j].isRemove = true;
                        this.entryData[j].isLevelUp = true;
                        entryData.isRemove = true;
                    }
                }
            }
            if (_isExisMarker == false) {
                entryData.x = _nextPosX;
                entryData.y = _nextPosY;
            }
        }
    },

    moveRightDown: function(pattern) {
        //右下を指定した場合は、xが4->1の方向に処理していく
        this.entryData.sort(function(a, b) {
            return (a.x > b.x) ? -1 : 1;
        });

        // x + 1
        for (var i = 0; i < this.entryData.length; i++) {
            var _nextPosX = this.entryData[i].x + 1;
            var _nextPosY = this.entryData[i].y;
            this.setMoveMarkerPosition(_nextPosX, _nextPosY, this.entryData[i], pattern);
        }
    },

    moveLeftDown: function(pattern) {
        //左下を指定した場合は、yが4->1の順で処理していく
        this.entryData.sort(function(a, b) {
            return (a.y > b.y) ? -1 : 1;
        });

        // y + 1
        for (var i = 0; i < this.entryData.length; i++) {
            var _nextPosX = this.entryData[i].x;
            var _nextPosY = this.entryData[i].y + 1;
            this.setMoveMarkerPosition(_nextPosX, _nextPosY, this.entryData[i], pattern);
        }
    },

    moveRightUp: function(pattern) {
        //右下を指定した場合は、yが1->4の方向に処理していく
        this.entryData.sort(function(a, b) {
            return (a.y < b.y) ? -1 : 1;
        });

        // y - 1
        for (var i = 0; i < this.entryData.length; i++) {
            var _nextPosX = this.entryData[i].x;
            var _nextPosY = this.entryData[i].y - 1;
            this.setMoveMarkerPosition(_nextPosX, _nextPosY, this.entryData[i], pattern);
        }
    },

    moveLeftUp: function(pattern) {
        //左上を指定した場合は、yが1->4の方向に処理していく
        this.entryData.sort(function(a, b) {
            return (a.x < b.x) ? -1 : 1;
        });

        // x - 1
        for (var i = 0; i < this.entryData.length; i++) {
            var _nextPosX = this.entryData[i].x - 1;
            var _nextPosY = this.entryData[i].y;
            this.setMoveMarkerPosition(_nextPosX, _nextPosY, this.entryData[i], pattern);
        }
    },

    mixRandMarkers:function() {
        //シャッフルして
        this.entryData.sort(this.shuffle);
        this.entryData.sort(this.shuffle);
        this.entryData.sort(this.shuffle);

        for (var i = 0; i < this.entryData.length; i++) {
            //baseObj
            var _nextPosX = this.entryData[i].x = this.baseData[i].x;
            var _nextPosY = this.entryData[i].y = this.baseData[i].y;
            //this.setMoveMarkerPosition(_nextPosX, _nextPosY, this.entryData[i], pattern);
        }
    },

    movePosition: function() {
        this.markerMoving = false;
        for (var i = 0; i < this.entryData.length; i++) {
            var pos = this.getBasePosition(this.entryData[i].x, this.entryData[i].y);
            var _movePosX = pos[0];
            var _movePosY = pos[1];

            var _currentPosX = this.entryData[i].sprite.getPosition().x;
            var _currentPosY = this.entryData[i].sprite.getPosition().y;

            var mvPosX = _currentPosX;
            var mvPosY = _currentPosY;

            if (_currentPosX < _movePosX) {
                mvPosX = _currentPosX + 1;
                this.markerMoving = true;
            }
            if (_currentPosX > _movePosX) {
                mvPosX = _currentPosX - 1;
                this.markerMoving = true;
            }
            if (_currentPosY < _movePosY) {
                mvPosY = _currentPosY + 1;
                this.markerMoving = true;
            }
            if (_currentPosY > _movePosY) {
                mvPosY = _currentPosY - 1;
                this.markerMoving = true;
            }

            var _dist = Math.sqrt((_movePosX - _currentPosX) * (_movePosX - _currentPosX) + (_movePosY - _currentPosY) * (_movePosY - _currentPosY));
            if (_dist <= 30) {
                this.entryData[i].sprite.setPosition(
                    _movePosX, _movePosY
                );
            } else {
                var dX = _movePosX - _currentPosX;
                var dY = _movePosY - _currentPosY;
                var rad = Math.atan2(dX, dY);
                var speedX = this.markerSpeed * Math.sin(rad);
                var speedY = this.markerSpeed * Math.cos(rad);
                this.entryData[i].sprite.setPosition(
                    this.entryData[i].sprite.getPosition().x + speedX,
                    this.entryData[i].sprite.getPosition().y + speedY
                );
            }
        }

        //ターン数を増やす
        if (this.markerMoving == false) {
            if (this.turnCnt != this.tmpTurnCnt) {
                this.turnCnt = this.tmpTurnCnt;
                this.initNewTurn();

                playSE_Rotate(this.storage);

                //次に動かせる猶予があるか確認する
                var _cnt = this.getMovablePositionCnt();
                var _baseData = this.seachBlankPosition();

                //cc.log(_cnt + "/" + _baseData);
                //4x4=16マス埋まっている && 縦横に動かせるコマがない
                if(_cnt == 0 && _baseData == null){
                    this.setGameOver();
                }
            }
        } else {
            this.tmpTurnCnt = this.turnCnt + 1;
        }

    },

    setGameOver:function(){
        //ad(広告)によるretryがまだされていなければリトライ
        if(this.retryCnt == 0 && isFailedAd == false){
            this.status = "info_ad";
            this.infoad.setVisible(true);
        }else{
            this.status = "gameover";
            this.infoad.setVisible(false);
            this.gameover.setVisible(true);
            if(this.storage.maxGameScore <= this.score){
                this.storage.maxGameScore = this.score;
            }
            this.storage.saveCurrentData();
        }
    },

    //動けるマスがいくつあるか数える
    getMovablePositionCnt : function(){
        var _posCnt = 0;
        for (var i = 0; i < this.entryData.length; i++) {
            var _posX = this.entryData[i].x;
            var _posY = this.entryData[i].y;
            var _level = this.entryData[i].lv;
            for (var j = 0; j < this.entryData.length; j++) {
                if(this.entryData[j].x == _posX + 1 && this.entryData[j].y == _posY && this.entryData[j].lv == _level){
                    _posCnt++;
                }
                if(this.entryData[j].x == _posX && this.entryData[j].y == _posY + 1 && this.entryData[j].lv == _level){
                    _posCnt++;
                }
            }
        }
        return _posCnt;
    },

    //新しいターンになった時の処理
    initNewTurn: function() {
        var _baseData = this.seachBlankPosition();
        if(_baseData == null) return;
        var _markerLevel = 1;
        var _rand = this.getRandNumberFromRange(1,6);
        if(_rand == 2){
            _markerLevel = 2;
        }else if(_rand == 3){
            _markerLevel = 3;
        }
        if (_baseData != null) {
            this.addMarker(_baseData.x, _baseData.y, _markerLevel);
        }

        var _blankCnt = this.seachBlankCnt();
        if(_blankCnt >= 5){
            var _baseData = this.seachBlankPosition();
            if(_baseData != null) {
                this.addMarker(_baseData.x, _baseData.y, _markerLevel);
            }
        }

        for (var i = 0; i < this.entryData.length; i++) {
            if (this.entryData[i].isLevelUp == true) {
                this.addMarker(this.entryData[i].x, this.entryData[i].y, this.entryData[i].lv + 1);
                this.score += this.entryData[i].lv * 5;
            }
        }
        for (var i = 0; i < this.entryData.length; i++) {
            if (this.entryData[i].isRemove == true) {
                this.removeChild(this.entryData[i].sprite);
                this.entryData.splice(i, 1);
            }
        }
        for (var i = 0; i < this.entryData.length; i++) {
            if (this.entryData[i].isRemove == true) {
                this.removeChild(this.entryData[i].sprite);
                this.entryData.splice(i, 1);
            }
        }
    },

    seachBlankCnt: function() {
        var _blankEntryData = [];
        for (var j = 0; j < this.baseData.length; j++) {
            var _isSetMarker = false;
            for (var i = 0; i < this.entryData.length; i++) {
                if (this.baseData[j].x == this.entryData[i].x && this.baseData[j].y == this.entryData[i].y) {
                    _isSetMarker = true;
                }
            }
            if (_isSetMarker == false) {
                _blankEntryData.push(this.baseData[j]);
            }
        }
        return _blankEntryData.length;
    },

    seachBlankPosition: function() {
        var _blankEntryData = [];
        for (var j = 0; j < this.baseData.length; j++) {
            var _isSetMarker = false;
            for (var i = 0; i < this.entryData.length; i++) {
                if (this.baseData[j].x == this.entryData[i].x && this.baseData[j].y == this.entryData[i].y) {
                    _isSetMarker = true;
                }
            }
            if (_isSetMarker == false) {
                _blankEntryData.push(this.baseData[j]);
            }
        }
        if(_blankEntryData.length > 0){
            //sortランダム
            _blankEntryData.sort(this.shuffle);
            _blankEntryData.sort(this.shuffle);
            _blankEntryData.sort(this.shuffle);
            return _blankEntryData[0];
        }else{
            return null;
        }
    },

    shuffle : function () 
    {
        return Math.random() - .5 ;
    },

    addMarker: function(posX, posY, lv) {
        if (lv == 1) {
            this.img = "res/maker_001.png";
        }
        if (lv == 2) {
            this.img = "res/maker_002.png";
        }
        if (lv == 3) {
            this.img = "res/maker_003.png";
        }
        if (lv == 4) {
            this.img = "res/maker_004.png";
        }
        if (lv == 5) {
            this.img = "res/maker_005.png";
        }
        if (lv == 6) {
            this.img = "res/maker_001.png";

            lv = 1;

            var pos = this.getBasePosition(posX, posY);
            var sprite = cc.Sprite.create("res/maker_009.png");
            sprite.setAnchorPoint(0.5,0);
            sprite.setPosition(pos[0], pos[1]);
            sprite.posX = posX;
            sprite.posY = posY;
            this.addChild(sprite, 999999999);
            this.launchedMarkers.push(sprite);

            this.fireSprite = cc.ParticleFire.create();
            this.fireSprite.setPosition(80,80);
            sprite.addChild(this.fireSprite);

            //SE
            playSE_Launch(this.storage);
        }

        var test = {
            x: posX,
            y: posY,
            lv: lv,
            img: 'res/test.png',
            isRemove: false,
            isLevelUp: false,
            imgScale:0.5,
            startCnt:0,
        };
        var sprite = cc.Sprite.create(this.img);
        sprite.setAnchorPoint(0.5,0);
        sprite.setScale(0.5,0.5);
        this.addChild(sprite, 99999999);
        test.sprite = sprite;
        this.entryData.push(test);
        var pos = this.getBasePosition(posX, posY);
        test.sprite.setPosition(pos[0], pos[1]);

/*
        this.fireSprite = cc.ParticleFire.create();
        sprite.addChild(this.fireSprite);
*/
    },

    getBasePosition: function(x, y) {
        for (var j = 0; j < this.baseData.length; j++) {
            if (this.baseData[j].x == x && this.baseData[j].y == y) {
                return [this.baseData[j].posX, this.baseData[j].posY];
            }
        }
        return [0, 0];
    },

    touchStart: function(location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
    },

    touchMove: function(location) {
        var roopCnt = 1;
        var dist = Math.sqrt((this.firstTouchX - location.x) * (this.firstTouchX - location.x) + (this.firstTouchY - location.y) * (this.firstTouchY - location.y));
        if (this.isMapMoving == false && dist >= 50) {

            if (this.firstTouchX < location.x && this.firstTouchY < location.y) {
                //右上
                //cc.log("右上");
                this.tmpMoveDirection = "rightUp";
                for (var r = 0; r < roopCnt; r++) {
                    this.moveRightUp(1);
                }
                this.isMapMoving = true;
            } else
            if (this.firstTouchX < location.x && this.firstTouchY > location.y) {
                //右下
                //cc.log("右下");
                this.tmpMoveDirection = "rightDown";
                for (var r = 0; r < roopCnt; r++) {
                    this.moveRightDown(1);
                }
                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY < location.y) {
                //左上
                //cc.log("左上");
                this.tmpMoveDirection = "leftUp";
                for (var r = 0; r < roopCnt; r++) {
                    this.moveLeftUp(1);
                }
                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY > location.y) {
                //左下
                //cc.log("左下");
                this.tmpMoveDirection = "leftDown";
                for (var r = 0; r < roopCnt; r++) {
                    this.moveLeftDown(1);
                }
                this.isMapMoving = true;
            } else {

            }
        }
    },
    touchFinish: function(location) {
        this.isMapMoving = false;
    },

    getRandNumberFromRange:function(min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },

    //シーンの切り替え----->
    goToTopLayer : function (pSender) 
    {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(TopLayer.create(this.storage));
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
            isFailedAd = true;
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof(sdkbox.PluginAdMob)) {
            isFailedAd = true;
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
                isCancelAd = true;
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function(name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function(name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
                if(name == "gameover"){
                    //sdkbox.PluginAdMob.hide("gameover");
                    item001Cnt = 1;
                }
            }
        });
        sdkbox.PluginAdMob.init();

        // just for test
        var plugin = sdkbox.PluginAdMob;
        if ("undefined" != typeof(plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    },

    setBasedata:function(){
        //1
        var baseObj = {
            x: 1,
            y: 1,
            posX: 320,
            posY: this.blockPosY,
            img: 'res/test2.png'
        };
        this.baseData.push(baseObj);
        //2
        var baseObj = {
            x: 1,
            y: 2,
            posX: 320-this.baseWidth/2,
            posY: this.blockPosY-this.baseTopHeight/2,
            img: 'res/test2.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 2,
            y: 1,
            posX: 320+this.baseWidth/2,
            posY: this.blockPosY-this.baseTopHeight/2,
            img: 'res/test2.png'
        };
        this.baseData.push(baseObj);
        //3
        var baseObj = {
            x: 1,
            y: 3,
            posX: 320-this.baseWidth/2*2,
            posY: this.blockPosY-this.baseTopHeight/2*2,
            img: 'res/test2.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 2,
            y: 2,
            posX: 320,
            posY: this.blockPosY-this.baseTopHeight/2*2,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 3,
            y: 1,
            posX: 320+this.baseWidth/2*2,
            posY: this.blockPosY-this.baseTopHeight/2*2,
            img: 'res/base.png'
        };
        //4
        this.baseData.push(baseObj);
        var baseObj = {
            x: 1,
            y: 4,
            posX: 320-this.baseWidth/2*3,
            posY: this.blockPosY-this.baseTopHeight/2*3,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 2,
            y: 3,
            posX: 320-this.baseWidth/2*1,
            posY: this.blockPosY-this.baseTopHeight/2*3,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 3,
            y: 2,
            posX: 320+this.baseWidth/2*1,
            posY: this.blockPosY-this.baseTopHeight/2*3,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 4,
            y: 1,
            posX: 320+this.baseWidth/2*3,
            posY: this.blockPosY-this.baseTopHeight/2*3,
            img: 'res/base.png'
        };
        //3
        this.baseData.push(baseObj);
        var baseObj = {
            x: 2,
            y: 4,
            posX: 320-this.baseWidth/2*2,
            posY: this.blockPosY-this.baseTopHeight/2*4,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 3,
            y: 3,
            posX: 320,
            posY: this.blockPosY-this.baseTopHeight/2*4,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 4,
            y: 2,
            posX: 320+this.baseWidth/2*2,
            posY: this.blockPosY-this.baseTopHeight/2*4,
            img: 'res/base.png'
        };
        //2
        this.baseData.push(baseObj);
        var baseObj = {
            x: 3,
            y: 4,
            posX: 320-this.baseWidth/2,
            posY: this.blockPosY-this.baseTopHeight/2*5,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
        var baseObj = {
            x: 4,
            y: 3,
            posX: 320+this.baseWidth/2,
            posY: this.blockPosY-this.baseTopHeight/2*5,
            img: 'res/base.png'
        };
        //1
        this.baseData.push(baseObj);
        var baseObj = {
            x: 4,
            y: 4,
            posX: 320,
            posY: this.blockPosY-this.baseTopHeight/2*6,
            img: 'res/base.png'
        };
        this.baseData.push(baseObj);
    },
});

GameLayer.create = function (storage) 
{
    return new GameLayer(storage);
};

var GameLayerScene = cc.Scene.extend({
    onEnter: function(storage) {
        this._super();
        var layer = new GameLayer(storage);
        this.addChild(layer);
    }
});