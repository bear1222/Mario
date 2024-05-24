const { ccclass, property } = cc._decorator;
import ActorController from "./ActorController";
import { GameManager } from "./GameManager";

function cmp(a: number, b: number){
    return (Math.abs(a - b) < 1e-3);
}

@ccclass
export default class Flower extends cc.Component {
    private anim: cc.Animation = null;
    private startWalk: boolean = false;

    start(){
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("flower");
        this.walk();

    }
    onLoad(){
    }
    update(dt: number){
        if(!this.anim.getAnimationState('flower').isPlaying)
            this.anim.play('flower');
    }

    walk(){
        this.startWalk = true;
        let moveDown = cc.moveBy(1.5, 0, -70);
        let moveUp = cc.moveBy(1.5, 0, 70);
        let delayTime = cc.delayTime(2);
        let delay2 = cc.delayTime(0.4);
        let sequence = cc.sequence(moveDown, delayTime, moveUp, delay2);
        this.node.runAction(cc.repeatForever(sequence));
    }

}