const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class leaderBoard extends cc.Component {
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


    @property(cc.Node) name1: cc.Node = null;
    @property(cc.Node) name2: cc.Node = null;
    @property(cc.Node) name3: cc.Node = null;
    @property(cc.Node) name4: cc.Node = null;
    @property(cc.Node) name5: cc.Node = null;
    @property(cc.Node) score1: cc.Node = null;
    @property(cc.Node) score2: cc.Node = null;
    @property(cc.Node) score3: cc.Node = null;
    @property(cc.Node) score4: cc.Node = null;
    @property(cc.Node) score5: cc.Node = null;

    @property(cc.Integer)
    level: number = 1;

    private records = null;


    start () {
        let xBtn = new cc.Component.EventHandler();
        xBtn.target = this.node;
        xBtn.component = 'leaderBoard';
        xBtn.handler = 'goBack';


        cc.find("Canvas/wrap/GoBack").getComponent(cc.Button).clickEvents.push(xBtn);

        const info = GlobalManager.instance.getInfo();
        this.uid = info.uid;
        this.lastPlay = info.lastPlay;
        this.username = info.username;
        if(this.level == 1)
            this.records = info.records1;
        else
            this.records = info.records2;
        while(this.records.length < 5)
            this.records.push({username: '- - - -', score: '000000'});
        this.setHeaderNode();
        this.setNode();
    }

    goBack(){
        console.log("load back to levelSelect");
        cc.director.loadScene("levelSelect");
    }

    setNode(){
        console.log('setNode');
        this.name1.getComponent(cc.RichText).string = "<outline color=black>" + this.records[0].username + " </outline>";
        this.name2.getComponent(cc.RichText).string = "<outline color=black>" + this.records[1].username + " </outline>";
        this.name3.getComponent(cc.RichText).string = "<outline color=black>" + this.records[2].username + " </outline>";
        this.name4.getComponent(cc.RichText).string = "<outline color=black>" + this.records[3].username + " </outline>";
        this.name5.getComponent(cc.RichText).string = "<outline color=black>" + this.records[4].username + " </outline>";

        this.score1.getComponent(cc.Label).string = this.records[0].score;
        this.score2.getComponent(cc.Label).string = this.records[1].score;
        this.score3.getComponent(cc.Label).string = this.records[2].score;
        this.score4.getComponent(cc.Label).string = this.records[3].score;
        this.score5.getComponent(cc.Label).string = this.records[4].score;
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