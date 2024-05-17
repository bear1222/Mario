const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {
    private anim: cc.Animation = null;
    
    start(){
        this.anim = this.getComponent(cc.Animation);
//        this.anim.play("coin").repeatCount = Infinity;
        let sequence = cc.sequence(cc.moveBy(1, 0, 100).easing(cc.easeCubicActionOut()), cc.moveBy(0.8, 0, -100).easing(cc.easeCubicActionIn()));
        this.scheduleOnce(() => {
            this.node.runAction(sequence);
        }, 0);

    }
    update(){
        if(!this.anim.getAnimationState("coin").isPlaying)
            this.anim.play("coin");
    }
}