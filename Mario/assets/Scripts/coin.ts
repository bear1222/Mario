const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {
    private anim: cc.Animation = null;
    
    start(){
        this.anim = this.getComponent(cc.Animation);
//        this.anim.play("coin").repeatCount = Infinity;
        let action = cc.Action;
        let easeRate:number = 0.5;
//        let sequence = cc.sequence(cc.moveBy(1, 0, 100).easing(cc.easeInOut(easeRate)), cc.moveBy(1, 0, -100).easing(cc.easeInOut(easeRate)));
        let sequence = cc.sequence(cc.moveBy(1, 0, 100).easing(cc.easeCubicActionOut()), cc.moveBy(1, 0, -100).easing(cc.easeCubicActionIn()));
        action = sequence;
        this.scheduleOnce(() => {
            this.node.runAction(action);
        }, 0);

    }
    update(){
        if(!this.anim.getAnimationState("coin").isPlaying)
            this.anim.play("coin");
    }
}