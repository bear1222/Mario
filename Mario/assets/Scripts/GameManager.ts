const {ccclass, property} = cc._decorator;
import GameFinish from "./GameFinish";
import { GlobalManager } from "./GlobalManager";

@ccclass
export class GameManager extends cc.Component {
    @property(cc.Integer)
    level: number = 1;
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    @property(cc.AudioClip)
    jumpSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    stompSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    dieSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    coinSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    becomeBigSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    becomeSmallSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    gameoverSE: cc.AudioClip = null;
    @property(cc.AudioClip)
    gameFinishSE: cc.AudioClip = null;

    @property(cc.Node)
    life: cc.Node = null;
    private lifeCnt: number = 5;
    @property(cc.Node)
    time: cc.Node = null;
    private timeCnt: number = 300;
    private updateTimer: boolean = true;
    @property(cc.Node)
    coin: cc.Node = null;
    private coinCnt: number = 0;
    @property(cc.Node)
    points: cc.Node = null;
    private pointsCnt: number = 0;

    @property(cc.Node)
    private gameFinish: cc.Node = null;

    private stopAll: boolean = false;

    start() {
        console.log('start gameManager');
        if (GlobalManager.instance) {
            const state = GlobalManager.instance.restoreGameState();
            this.lifeCnt = state.lifeCnt;
            this.timeCnt = state.timeCnt;
            this.coinCnt = state.coinCnt;
            this.pointsCnt = state.pointsCnt;
        }
        this.updateUI();

        this.playBGM();
        this.schedule(() => {
            if(this.updateTimer)
                this.updateTime();
        }, 1);
        this.stopAll = false;
    }

    update(){
        if(this.timeCnt == 0){
            GlobalManager.instance.gameOver();
        }
    }

    updateUI() {
        this.life.getComponent(cc.Label).string = this.lifeCnt.toString();
        this.time.getComponent(cc.Label).string = this.timeCnt.toString();
        this.coin.getComponent(cc.Label).string = this.coinCnt.toString();
        let s = this.pointsCnt.toString();
        while (s.length < 5) s = '0' + s;
        this.points.getComponent(cc.Label).string = s;
    }

    playBGM(){
        cc.audioEngine.playMusic(this.bgm, true);
    }
    stopBGM(){
        cc.audioEngine.stopMusic();
    }
    playJumpSE(){
        cc.audioEngine.playEffect(this.jumpSE, false);
    }
    playStompSE(){
        cc.audioEngine.playEffect(this.stompSE, false);
    }
    playDieSE(){
        this.stopBGM();
        cc.audioEngine.playEffect(this.dieSE, false);
    }
    playCoinSE(){
        cc.audioEngine.playEffect(this.coinSE, false);
    }
    playBecomeBigSE(){
        cc.audioEngine.playEffect(this.becomeBigSE, false);
    }
    playBecomeSmallSE(){
        cc.audioEngine.playEffect(this.becomeSmallSE, false);
    }
    playGameoverSE(){
        cc.audioEngine.playEffect(this.gameoverSE, false);
    }
    playGameFinishSE(){
        cc.audioEngine.playEffect(this.gameFinishSE, false);
    }

    playGameStart(){
        GlobalManager.instance.setLevel(this.level);
        GlobalManager.instance.saveGameState(this.lifeCnt, this.timeCnt, this.coinCnt, this.pointsCnt);
        cc.director.loadScene('stop');
    }
    playGameOver(){
        this.playGameoverSE();
        GlobalManager.instance.gameOver();
        this.gameFinish.getComponent(GameFinish).recordState(this.level, 5, 300, 0, 0);
    }
    playGameFinish(){
        console.log('playGameFinish');
        this.updateTimer = false;
        this.stopBGM();
        this.playGameFinishSE();
        this.scheduleOnce(() => {
            this.stopAll = true;
            const gameFinishComponent = this.gameFinish.getComponent(GameFinish);
            if (gameFinishComponent) {
                gameFinishComponent.show(this.timeCnt, this.timeCnt * 50);
            } else {
                console.error("GameFinish component not found on gameFinish node");
            }
//            this.gameFinish.getComponent(GameFinish).show(this.timeCnt, this.timeCnt * 50);
            this.updatePoints(this.timeCnt * 50);
            gameFinishComponent.recordScore(this.level, this.lifeCnt, this.timeCnt, this.coinCnt, this.pointsCnt);
            gameFinishComponent.recordState(this.level, 5, 300, 0, 0);
        }, 0.5);
        GlobalManager.instance.gameFinish();
    }

    die(){
        this.updateLife();
        if(this.lifeCnt == 0)
            this.playGameOver();
        else
            this.playGameStart();
    }

    updateLife(){
        this.lifeCnt--;
        this.life.getComponent(cc.Label).string = this.lifeCnt.toString();
    }
    updateTime(){
        this.timeCnt--;
        this.time.getComponent(cc.Label).string = this.timeCnt.toString();
    }
    updateCoin(dt){
        this.coinCnt += dt;
        this.coin.getComponent(cc.Label).string = this.coinCnt.toString();
    }
    updatePoints(dt){
        this.pointsCnt += dt;
        let s = this.pointsCnt.toString();
        while(s.length < 5) s = '0' + s;
        this.points.getComponent(cc.Label).string = s;
    }

    isStop(){
        return this.stopAll;
    }
}