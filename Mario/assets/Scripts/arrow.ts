const { ccclass, property } = cc._decorator;
import Controller from "./input/Controller";
import { IInputControls } from "./input/IInputControls";
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class ArrowController extends Controller {

    private quit: boolean = false;

    onLoad(){
    }
    
    start(){
        super.start();
    }
    update(){
        if(this.inputSource){
            if(this.inputSource.enterPressed){
                if(this.quit)
                    this.quitGame();
                else
                    this.continueGame();
            }

            if(!this.quit && this.inputSource.downPressed)
                this.quit = true;
            if(this.quit && this.inputSource.jumpPressed)
                this.quit = false;
        }
        if(this.quit)
            this.node.setPosition(cc.v2(-336.118, -126.006));
        else
            this.node.setPosition(cc.v2(-336.118, 0.994));
    }

    quitGame(){
        const level = GlobalManager.instance.getLevel();
        const state = GlobalManager.instance.restoreGameState();
        const lifeCnt = state.lifeCnt;
        const timeCnt = state.timeCnt;
        const coinCnt = state.coinCnt;
        const pointsCnt = state.pointsCnt;
        this.recordState(level, lifeCnt, timeCnt, coinCnt, pointsCnt);
        cc.director.loadScene('levelSelect');

    }
    continueGame(){
        const level = GlobalManager.instance.getLevel();
        const scene = 'game' + level;
        GlobalManager.instance.loadSceneWithDelay(scene, 3);
        
        cc.director.loadScene("game_start");

    }

    recordState(level: number, life: number, time: number, coin: number, point: number){
        console.log("record:", life, time, coin, point);
        const uid = GlobalManager.instance.getUid();
        let userList = firebase.database().ref('userList/' + uid + '/lastPlay' + level);
        userList.update({level: level, life: life, time: time, coin: coin, point: point});
    }

}