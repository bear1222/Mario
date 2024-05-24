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

    private uid: number = -1;
    private username: string = '';
    private lastPlay = null;

    start () {
        let loginBtn = new cc.Component.EventHandler();
        let signupBtn = new cc.Component.EventHandler();
        loginBtn.target = this.node;
        loginBtn.component = "levelSelect";
        loginBtn.handler = "loadLoginScene";
        signupBtn.target = this.node;
        signupBtn.component = "levelSelect";
        signupBtn.handler = "loadSignupScene";

        let leaderBtn = new cc.Component.EventHandler();
        leaderBtn.target = this.node;
        leaderBtn.component = 'levelSelect';
        leaderBtn.handler = "loadLeaderBoard";
        let leaderBtn2 = new cc.Component.EventHandler();
        leaderBtn2.target = this.node;
        leaderBtn2.component = 'levelSelect';
        leaderBtn2.handler = "loadLeaderBoard2";

        let logoutBtn = new cc.Component.EventHandler();
        logoutBtn.target = this.node;
        logoutBtn.component = 'levelSelect';
        logoutBtn.handler = "logOut";

        cc.find("Canvas/Btn1").getComponent(cc.Button).clickEvents.push(loginBtn);
        cc.find("Canvas/Btn2").getComponent(cc.Button).clickEvents.push(signupBtn);
        cc.find("Canvas/LeaderBoardBtn").getComponent(cc.Button).clickEvents.push(leaderBtn);
        cc.find("Canvas/LeaderBoardBtn2").getComponent(cc.Button).clickEvents.push(leaderBtn2);
        cc.find("Canvas/LogOutBtn").getComponent(cc.Button).clickEvents.push(logoutBtn);

        const info = GlobalManager.instance.getInfo();
        this.uid = info.uid;
        this.lastPlay = info.lastPlay;
        this.username = info.username;
        console.log('info:', info);
        if(info.finish){
            cc.find("Canvas/Btn2").getComponent(cc.Button).interactable = true;
        }

        this.setHeaderNode();
    }

    loadLoginScene(){
        GlobalManager.instance.gameStart(1);
    }
    loadSignupScene(){
        GlobalManager.instance.gameStart(1);
    }
    loadLeaderBoard(){
        cc.director.loadScene('leaderBoard');
    }
    loadLeaderBoard2(){
        cc.director.loadScene('leaderBoard2');
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
        while(point.length < 6)
            point = '0' + point;
        console.log('username:', username);
        console.log('levevl:', level);
        console.log('life:', life);

        this.usernameNode.getComponent(cc.RichText).string = "<outline color=black>" + username + "</outline>";
        this.levelNode.getComponent(cc.Label).string = level;
        this.lifeNode.getComponent(cc.Label).string = life;
        this.timeNode.getComponent(cc.Label).string = time;
        this.coinNode.getComponent(cc.Label).string = coin;
        this.pointNode.getComponent(cc.Label).string = point;
    }
    // update (dt) {}
}