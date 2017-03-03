//
//  Sound.js
//  Yamataikoku
//
//  Created by Fumitoshi Ogata on 01/02/16.
//  Copyright (c) 2016 http://oggata.github.io All rights reserved.
//

var playBGM = function(storage){
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic(res.BGM_001_mp3,true); //BGM
    }
};

var playClearBGM = function(storage){
    //BGM_clear_mp3
    if(storage.bgmVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.stopMusic();
        audioEngine.playMusic(res.BGM_clear_mp3,false); //BGM
    }
};

var stopBGM = function(storage){
    var audioEngine = cc.audioEngine;
    audioEngine.stopMusic();
};

var playSE_Button = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.SE_001_mp3,false);
    }
};

var playSE_Rotate = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.SE_Rotate_mp3,false);
    }
};

var playSE_Complete = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.SE_Complete_mp3,false);
    }
};

var playSE_Launch = function(storage){
    if(storage.seVolume != 0)
    {
        var audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.SE_Launch_mp3,false);
    }
};