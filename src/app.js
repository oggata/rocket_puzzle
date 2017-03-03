var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.back = cc.Sprite.create("res/back.png");
        this.back.setAnchorPoint(0,0);
        this.addChild(this.back);

        this.status = "gaming";

        this.score = 0;
        this.visibleScore = 0;

        this.scoreLabel = new cc.LabelTTF(this.visibleScore, "Arial", 60);
        this.scoreLabel.setPosition(100,1050);
        this.addChild(this.scoreLabel, 5);

        this.bestScoreLabel = new cc.LabelTTF("9999", "Arial", 45);
        this.bestScoreLabel.setPosition(80,970);
        this.addChild(this.bestScoreLabel, 5);


        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        // you may modify it.
        // ask the window size
        var size = cc.winSize;


        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        this.isMapMoving = false;

        this.turnCnt = 0;
        this.tmpTurnCnt = -1;
        this.markerSpeed = 30;

        this.messageLabel = cc.LabelTTF.create("XXXXXX", "Arial", 33);
        this.messageLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        this.messageLabel.setPosition(100, 1000);
        //this.messageLabel.setAnchorPoint(0,1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.addChild(this.messageLabel);

        this.baseWidth = 147;
        this.baseHeight = 149;
        this.baseTopHeight = 90;
        this.blockPosY = 550;

        this.baseData = [];
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

        this.tmpMoveDirection = null;
        this.entryData = [];

        //this.addMarker(3, 1, 1);
        //this.addMarker(2, 4, 1);

        this.markers = [];
        for (var i = 0; i < 16; i++) {
            this.marker = cc.Sprite.create("res/base.png");
            //this.marker.setScale(0.2, 0.2);
            this.marker.setAnchorPoint(0.5,0);
            this.marker.setPosition(this.baseData[i].posX, this.baseData[i].posY);
            this.addChild(this.marker);
            //this.marker.setVisible(false);
            this.markers.push(this.marker);
        }

        this.moveRightDown();
        this.moveRightDown();
        //this.moveLeftDown();
        //this.moveLeftDown();

        //this.movePosition();

        this.firstTouchX = 0;
        this.firstTouchY = 0;

        //GetTouchEvent
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

        this.scheduleUpdate();
        return true;
    },

    update: function(dt) {

        if(this.visibleScore < this.score){
            this.visibleScore += 1;
        }
        this.scoreLabel.setString(this.visibleScore);



        for (var i = 0; i < this.entryData.length; i++) {
            this.reorderChild(
                this.entryData[i].sprite,
                Math.floor(999999 - this.entryData[i].sprite.getPosition().y)
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
                this.messageLabel.setString(this.turnCnt);
                this.initNewTurn();
            }
        } else {
            this.tmpTurnCnt = this.turnCnt + 1;
        }

    },

    //新しいターンになった時の処理
    initNewTurn: function() {
        var _baseData = this.seachBlankPosition();
        if(_baseData == null){
            this.status = "gameover";
        }else{
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
            //nextLevelマーカーがあればマーカーを追加する
            for (var i = 0; i < this.entryData.length; i++) {
                if (this.entryData[i].isLevelUp == true) {
                    cc.log("nextLevel:" + this.entryData[i].lv);
                    this.addMarker(this.entryData[i].x, this.entryData[i].y, this.entryData[i].lv + 1);
                    this.score += this.entryData[i].lv * 5;
                }
            }
            //removeマーカーがあれば削除する
            for (var i = 0; i < this.entryData.length; i++) {
                if (this.entryData[i].isRemove == true) {
                    cc.log("remove!!!!!!!!!!!!!!!" + this.entryData[i].x + "/" + this.entryData[i].y);
                    this.removeChild(this.entryData[i].sprite);
                    this.entryData.splice(i, 1);
                }
            }
            //removeマーカーがあれば削除する
            for (var i = 0; i < this.entryData.length; i++) {
                if (this.entryData[i].isRemove == true) {
                    cc.log("remove!!!!!!!!!!!!!!!" + this.entryData[i].x + "/" + this.entryData[i].y);
                    this.removeChild(this.entryData[i].sprite);
                    this.entryData.splice(i, 1);
                }
            }
        }
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
                //return this.baseData[j];
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
            this.img = "res/maker_006.png";
        }
        if (lv == 7) {
            this.img = "res/maker_007.png";
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
        sprite.setScale(this.imgScale,this.imgScale);
        this.addChild(sprite, 99999999);
        test.sprite = sprite;
        this.entryData.push(test);
        var pos = this.getBasePosition(posX, posY);
        test.sprite.setPosition(pos[0], pos[1]);
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
        cc.log("start");
        //cc.log(location);
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
    },

    touchMove: function(location) {
        var roopCnt = 1;
        var dist = Math.sqrt((this.firstTouchX - location.x) * (this.firstTouchX - location.x) + (this.firstTouchY - location.y) * (this.firstTouchY - location.y));
        if (this.isMapMoving == false && dist >= 50) {

            if (this.firstTouchX < location.x && this.firstTouchY < location.y) {
                //右上
                cc.log("右上");

                this.tmpMoveDirection = "rightUp";

                for (var r = 0; r < roopCnt; r++) {
                    this.moveRightUp(1);
                }

                this.isMapMoving = true;
            } else
            if (this.firstTouchX < location.x && this.firstTouchY > location.y) {
                //右下
                cc.log("右下");

                this.tmpMoveDirection = "rightDown";

                for (var r = 0; r < roopCnt; r++) {
                    this.moveRightDown(1);
                }

                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY < location.y) {
                //左上
                cc.log("左上");

                this.tmpMoveDirection = "leftUp";

                for (var r = 0; r < roopCnt; r++) {
                    this.moveLeftUp(1);
                }
                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY > location.y) {
                //左下
                cc.log("左下");

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
        cc.log("finish");
        //cc.log(location);
    },

    getRandNumberFromRange:function(min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});