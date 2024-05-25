const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class levelSelect extends cc.Component {
    @property(cc.Node)
    usernameNode: cc.Node = null;
    @property(cc.Node)
    levelNode: cc.Node = null;
    @property(cc.Node)
    lifeNode: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Node)
    coinNode: cc.Node = null;
    @property(cc.Node)
    pointNode: cc.Node = null;

    @property(cc.Node)
    LB1: cc.Node = null;
    @property(cc.Node)
    LB2: cc.Node = null;

    private uid: number = -1;
    private username: string = '';
    private lastPlay = null;

    start () {
        this.LB1.active = false;
        this.LB2.active = false;
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
        GlobalManager.instance.gameStart(1);
        const uid = GlobalManager.instance.getUid();
        let userList = firebase.database().ref('userList/' + uid + '/lastPlay1');
        userList.once('value')
        .then((snapshot) => {
            const info = snapshot.val() || {life: 5, time: 300, coin: 0, point: 0};
            GlobalManager.instance.saveGameState(info.life, info.time, info.coin, info.point);
        })
    }
    loadLevel2Scene(){
        GlobalManager.instance.gameStart(2);
        const uid = GlobalManager.instance.getUid();
        let userList = firebase.database().ref('userList/' + uid + '/lastPlay2');
        userList.once('value')
        .then((snapshot) => {
            const info = snapshot.val() || {life: 5, time: 300, coin: 0, point: 0};
            GlobalManager.instance.saveGameState(info.life, info.time, info.coin, info.point);
        })
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
    logOut(){
        firebase.auth().signOut()
        .then(() => {
            alert('Log out successfully! ByeBye');
            cc.director.loadScene('menu');
        })
        .catch(err => alert('log in fail, ' + err));
    }

    setHeaderNode(){
        const username = this.username;
        const level = this.lastPlay.level;
        const life = this.lastPlay.life;
        let time = this.lastPlay.time.toString();
        const coin = this.lastPlay.coin;
        let point = this.lastPlay.point.toString();
        while(time.length < 3)
            time = '0' + time;
        while(point.length < 5)
            point = '0' + point;
//        console.log('username:', username);
//        console.log('levevl:', level);
//        console.log('life:', life);

        this.usernameNode.getComponent(cc.RichText).string = "<outline color=black>" + username + "</outline>";
        this.levelNode.getComponent(cc.Label).string = level;
        this.lifeNode.getComponent(cc.Label).string = life;
        this.timeNode.getComponent(cc.Label).string = time;
        this.coinNode.getComponent(cc.Label).string = coin;
        this.pointNode.getComponent(cc.Label).string = point;
    }
    // update (dt) {}
}