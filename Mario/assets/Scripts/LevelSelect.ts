const {ccclass, property} = cc._decorator;

@ccclass
export default class level_select extends cc.Component {

    start () {
        let level1 = new cc.Component.EventHandler();
        let level2 = new cc.Component.EventHandler();
        level1.target = this.node;
        level1.component = "level_select";
        level1.handler = "level1";
        level2.target = this.node;
        level2.component = "level_select";
        level2.handler = "level2";


        cc.find("Canvas/level1").getComponent(cc.Button).clickEvents.push(level1);
        cc.find("Canvas/level2").getComponent(cc.Button).clickEvents.push(level2);
    }

    level1(){
        cc.director.loadScene("game1");
    }
    level2(){
        cc.director.loadScene("game1");
    }


    // update (dt) {}
}
