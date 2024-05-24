const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class leaderBoard extends cc.Component {
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
        const info = GlobalManager.instance.getInfo();
        this.uid = info.uid;
        this.lastPlay = info.lastPlay;
        this.username = info.username;
        if(this.level == 1)
            this.records = info.records1;
        else
            this.records = info.records2;
        while(this.records.length < 5)
            this.records.push({username: '- - - -', score: '00000'});
        this.setNode();
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
    // update (dt) {}
}