const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {
    @property(cc.SpriteFrame)
    private dieFrame: cc.SpriteFrame = null;

    private direction: string = 'right';

    @property(cc.Float)
    moveSpeed = 65;
    
    start(){
        this.walk();

    }
    update(dt: number){
        this.node.x += this.moveSpeed * dt * (this.direction == 'right' ? 1 : this.direction == 'stop' ? 0 : -1);
    }

    onBeginContact(contact, self, other){
        const normal = contact.getWorldManifold().normal;
        if(normal.x != 0 && (other.node.name == 'ground' || other.node.name == 'box_0')){
            console.log('change dir');
            this.direction = (this.direction == 'right' ? 'left' : 'right');
        }
        if(other.node.name == 'Player'){
            if(normal.y != 0){
                this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
                this.direction = 'stop';

                this.scheduleOnce(() => {
                    self.destroy();
                }, 0.4);
            }
        }
    }

    walk(){
        this.schedule(() => {
            this.node.scaleX = (this.node.scaleX == 1 ? -1 : 1);
        }, 0.1);
    }
}