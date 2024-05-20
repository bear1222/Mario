const {ccclass, property} = cc._decorator;

@ccclass
export class GlobalManager extends cc.Component {
    static instance: GlobalManager = null;

    lifeCnt: number = 5;
    timeCnt: number = 300;
    coinCnt: number = 0;
    pointsCnt: number = 0;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    onLoad() {
        if (GlobalManager.instance === null) {
            GlobalManager.instance = this;
            cc.game.addPersistRootNode(this.node);
            this.playBGM();
        } else {
            this.node.destroy();
        }
    }

    gameStart(lv){
        let scene = 'game' + lv;
        this.stopBGM();
        cc.director.loadScene('game_start');
        this.loadSceneWithDelay(scene, 2);
    }
    gameOver(){
        cc.director.loadScene('game_over');
        this.loadSceneWithDelay('levelSelect', 4);
        this.scheduleOnce(() => {
            this.playBGM();
        }, 5);
        this.resetState();
    }
    gameFinish(){
        console.log('gameFinish in GlobalManager');
        this.scheduleOnce(() => {
            this.playBGM();
        }, 5);
        this.loadSceneWithDelay('levelSelect', 4);
        this.resetState();
    }


    resetState(){
        this.lifeCnt = 5;
        this.timeCnt = 300;
        this.coinCnt = 0;
        this.pointsCnt = 0;
    }

    loadSceneWithDelay(sceneName: string, delay: number) {
        this.scheduleOnce(() => {
            cc.director.loadScene(sceneName);
        }, delay);
    }

    saveGameState(life, time, coin, points) {
        this.lifeCnt = life;
        this.timeCnt = time;
        this.coinCnt = coin;
        this.pointsCnt = points;
    }

    restoreGameState() {
        return {
            lifeCnt: this.lifeCnt,
            timeCnt: this.timeCnt,
            coinCnt: this.coinCnt,
            pointsCnt: this.pointsCnt
        };
    }

    playBGM(){
        cc.audioEngine.playMusic(this.bgm, true);
    }
    stopBGM(){
        cc.audioEngine.stopMusic();
    }
}