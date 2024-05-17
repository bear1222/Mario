const { ccclass, property } = cc._decorator;


@ccclass 
export default class question_box extends cc.Component{
    private touched: boolean = false;

    private anim: cc.Animation = null;
    @property(cc.Boolean)
    private coinBox: boolean = true;
    @property(cc.Prefab)
    private coinPrefab: cc.Prefab = null;
    @property(cc.SpriteFrame)
    private endFrame: cc.SpriteFrame = null;
    @property(cc.Prefab)
    private mushroomPrefab: cc.Prefab = null;

    start(){
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("question_box").repeatCount = Infinity;
        console.log("play:", this.anim.getAnimationState("question_box").isPlaying);
    }

    onLoad(){
    }

    onBeginContact(contact, self, other){
        const normal = contact.getWorldManifold().normal;
        if(!this.touched && other.node.name == "Player" && normal.y == -1){
            this.touched = true;
            this.anim.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.endFrame;
            if(!this.coinBox){
                let mushroom = cc.instantiate(this.mushroomPrefab);
                mushroom.setPosition(cc.v2(self.node.x, self.node.y + 32));
                cc.find("Canvas/MapManager").addChild(mushroom);
            }else{
                let coin = cc.instantiate(this.coinPrefab);
                coin.setPosition(cc.v2(self.node.x, self.node.y + 32));
                cc.find("Canvas/MapManager").addChild(coin);
                this.scheduleOnce(() => {
                    coin.destroy();
                }, 2.3);
            }
        }
    }
}