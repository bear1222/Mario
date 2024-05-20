const { ccclass, property } = cc._decorator;

@ccclass
export default class GameFinish extends cc.Component {
    @property(cc.Node)
    remainTimeNode: cc.Node = null;
    @property(cc.Node)
    addPointNode: cc.Node = null;

    onLoad(){
        this.node.active = false;
    }
    
    start(){

    }
    update(){
    }

    show(ti: number, poi: number){
        console.log('hi from game finish');
        this.node.zIndex = 1000;
        this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
        this.node.active = true;
        this.remainTimeNode.getComponent(cc.Label).string = ti.toString();
        this.addPointNode.getComponent(cc.Label).string = poi.toString();
    }

}