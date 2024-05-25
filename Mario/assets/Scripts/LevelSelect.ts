const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class levelSelect extends cc.Component {
    @property(cc.Node)
    usernameNode: cc.Node = null;

    @property(cc.Node)
    LB1: cc.Node = null;
    @property(cc.Node)
    LB2: cc.Node = null;

    @property(cc.Node)
    YN1: cc.Node = null;
    @property(cc.Node)
    YN2: cc.Node = null;

    private uid: number = -1;
    private username: string = '';
    private lastPlay = null;

    start () {
        GlobalManager.instance.playBGM();
        this.LB1.active = false;
        this.LB2.active = false;
        this.YN1.active = false;
        this.YN2.active = false;
        let Btn1 = new cc.Component.EventHandler();
        let Btn2 = new cc.Component.EventHandler();
        Btn1.target = this.node;
        Btn1.component = "levelSelect";
        Btn1.handler = "loadLevel1Scene";
        Btn2.target = this.node;
        Btn2.component = "levelSelect";
        Btn2.handler = "loadLevel2Scene";

        let leaderBtn = new cc.Component.EventHandler();
        leaderBtn.target = this.node;
        leaderBtn.component = 'levelSelect';
        leaderBtn.handler = "openLeaderBoard";
        let leaderBtn2 = new cc.Component.EventHandler();
        leaderBtn2.target = this.node;
        leaderBtn2.component = 'levelSelect';
        leaderBtn2.handler = "openLeaderBoard2";

        let xBtn = new cc.Component.EventHandler();
        xBtn.target = this.node;
        xBtn.component = 'levelSelect';
        xBtn.handler = "closeLeaderBoard";
        let xBtn2 = new cc.Component.EventHandler();
        xBtn2.target = this.node;
        xBtn2.component = 'levelSelect';
        xBtn2.handler = "closeLeaderBoard2";

        let yes1Btn = new cc.Component.EventHandler();
        yes1Btn.target = this.node;
        yes1Btn.component = 'levelSelect';
        yes1Btn.handler = "readOld1";
        let yes2Btn = new cc.Component.EventHandler();
        yes2Btn.target = this.node;
        yes2Btn.component = 'levelSelect';
        yes2Btn.handler = "readOld2";
        let no1Btn = new cc.Component.EventHandler();
        no1Btn.target = this.node;
        no1Btn.component = 'levelSelect';
        no1Btn.handler = "reStart1";
        let no2Btn = new cc.Component.EventHandler();
        no2Btn.target = this.node;
        no2Btn.component = 'levelSelect';
        no2Btn.handler = "reStart2";


        let logoutBtn = new cc.Component.EventHandler();
        logoutBtn.target = this.node;
        logoutBtn.component = 'levelSelect';
        logoutBtn.handler = "logOut";

        cc.find("Canvas/Btn1").getComponent(cc.Button).clickEvents.push(Btn1);
        cc.find("Canvas/Btn2").getComponent(cc.Button).clickEvents.push(Btn2);
        cc.find("Canvas/LeaderBoardBtn").getComponent(cc.Button).clickEvents.push(leaderBtn);
        cc.find("Canvas/LeaderBoardBtn2").getComponent(cc.Button).clickEvents.push(leaderBtn2);
        cc.find("Canvas/LogOutBtn").getComponent(cc.Button).clickEvents.push(logoutBtn);
        cc.find("Canvas/wrap1/GoBack").getComponent(cc.Button).clickEvents.push(xBtn);
        cc.find("Canvas/wrap2/GoBack").getComponent(cc.Button).clickEvents.push(xBtn2);
        cc.find("Canvas/YN1/YES1").getComponent(cc.Button).clickEvents.push(yes1Btn);
        cc.find("Canvas/YN1/NO1").getComponent(cc.Button).clickEvents.push(no1Btn);
        cc.find("Canvas/YN2/YES2").getComponent(cc.Button).clickEvents.push(yes2Btn);
        cc.find("Canvas/YN2/NO2").getComponent(cc.Button).clickEvents.push(no2Btn);

    }

    update(){
        const info = GlobalManager.instance.getInfo();
        this.uid = info.uid;
        this.lastPlay = info.lastPlay;
        this.username = info.username;
//        console.log('info:', info);
        if(info.finish){
            cc.find("Canvas/Btn2").getComponent(cc.Button).interactable = true;
        }
        this.setHeaderNode();

    }

    loadLevel1Scene(){
        this.YN1.active = true;
    }
    loadLevel2Scene(){
        this.YN2.active = true;
    }
    openLeaderBoard(){
        this.LB1.active = true;
    }
    openLeaderBoard2(){
        this.LB2.active = true;
    }
    closeLeaderBoard(){
        this.LB1.active = false;
    }
    closeLeaderBoard2(){
        this.LB2.active = false;
    }

    readOld1(){
        this.loadOldRecord(1);
    }
    readOld2(){
        this.loadOldRecord(2);
    }
    reStart1(){
        this.restart(1);
    }
    reStart2(){
        this.restart(2);
    }

    logOut(){
        firebase.auth().signOut()
        .then(() => {
            alert('Log out successfully! ByeBye');
            cc.director.loadScene('menu');
        })
        .catch(err => alert('log in fail, ' + err));
    }

    restart(level){
        GlobalManager.instance.gameStart(level);
        const info = {life: 5, time: 300, coin: 0, point: 0};
        GlobalManager.instance.saveGameState(info.life, info.time, info.coin, info.point);

    }
    loadOldRecord(level){
        GlobalManager.instance.gameStart(level);
        const uid = GlobalManager.instance.getUid();
        let userList = firebase.database().ref('userList/' + uid + '/lastPlay' + level);
        userList.once('value')
        .then((snapshot) => {
            const info = snapshot.val() || {life: 5, time: 300, coin: 0, point: 0};
            GlobalManager.instance.saveGameState(info.life, info.time, info.coin, info.point);
        })

    }

    setHeaderNode(){
        const username = this.username;
        this.usernameNode.getComponent(cc.RichText).string = "<outline color=black>" + username + "</outline>";
    }
    // update (dt) {}
}