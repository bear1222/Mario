const {ccclass, property} = cc._decorator;

@ccclass
export class GlobalManager extends cc.Component {
    static instance: GlobalManager = null;

    lifeCnt: number = 5;
    timeCnt: number = 300;
    coinCnt: number = 0;
    pointsCnt: number = 0;

    private uid: number = -1;
    private finish: boolean = 0;
    private username: string = '';
    private lastPlay = null;
    private records1 = null;
    private records2 = null;

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

    setUid(uid){
        this.uid = uid;
        Promise.all([this.getUsername(this.uid), this.getFinish(uid), this.getLastPlay(this.uid), this.getRecord()])
        .then(() => {
            cc.director.loadScene('levelSelect');
        })
        .catch(err => console.error('error:', err));
    }
    getUid(){
        return this.uid;
    }
    getFinish(uid){
        return new Promise((resolve, reject) => {
            if (uid === '') {
                reject('UID is empty');
                return;
            }
            let userList = firebase.database().ref('userList/' + uid + '/finish');
            userList.on('value', snapshot => {
                this.finish = snapshot.val();
                if(this.finish == null)
                    this.finish = false;
                resolve();
            })
        });
    }
    getUsername(uid){
        console.log("uid:", uid);
        return new Promise((resolve, reject) => {
            if (uid === '') {
                reject('UID is empty');
                return;
            }
            let userList = firebase.database().ref('userList/' + uid + '/username');
            userList.on('value', snapshot => {
                this.username = snapshot.val();
                console.log('username:', this.username);
                resolve();
            })
        });
    }
    getLastPlay(uid){
        return new Promise((resolve, reject) => {
            if (uid === '') {
                reject('UID is empty');
                return;
            }
            let userList = firebase.database().ref('userList/' + uid + '/lastPlay');
            userList.on('value', snapshot => {
                this.lastPlay = snapshot.val() || {level: 1, life: 5, time: 300, coin: 0, point: 0};
                console.log('lastplay:', this.lastPlay);
                resolve();
            })
        });
    }
    getRecord(){
        let bestScoreList1 = firebase.database().ref('bestScoreList1/');
        let bestScoreList2 = firebase.database().ref('bestScoreList2/');

        let promise1 = new Promise((resolve1, reject1) => {
            bestScoreList1.on('value', snapshot => {
                this.records1 = snapshot.val() || [];
                console.log('records1:', this.records1);
                resolve1();
            }, err => {
                console.error('Error fetching bestScoreList1:', err);
                reject1(err);
            });
        });

        let promise2 = new Promise((resolve2, reject2) => {
            bestScoreList2.on('value', snapshot => {
                this.records2 = snapshot.val() || [];
                console.log('records2:', this.records2);
                resolve2();
            }, err => {
                console.error('Error fetching bestScoreList2:', err);
                reject2(err);
            });
        });

        Promise.all([promise1, promise2])
        .then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    }
    getInfo() {
        return {
            uid: this.uid, 
            username: this.username, 
            lastPlay: this.lastPlay, 
            records1: this.records1, 
            records2: this.records2,
            finish: this.finish
        };
    }
}