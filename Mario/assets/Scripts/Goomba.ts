const { ccclass, property } = cc._decorator;
import ActorController from "./ActorController";
import { GameManager } from "./GameManager";

function cmp(a: number, b: number){
    return (Math.abs(a - b) < 1e-3);
}

@ccclass
export default class Goomba extends cc.Component {
    @property(cc.SpriteFrame)
    private dieFrame: cc.SpriteFrame = null;

    private direction: string = 'right';
    private alive: boolean = true;
    private startMove: boolean = false;

    @property(cc.Float)
    moveSpeed = 130;
    
    @property(GameManager)
    gameManager: GameManager = null;
    @property(cc.Prefab)
    addPointsPrefab: cc.Prefab = null;
    @property(cc.Node)
    player: cc.Node = null;

    start(){

    }
    onLoad(){
        this.walk();

    }
    update(dt: number){
        if(!this.startMove && Math.abs(this.player.x - this.node.x) < 650)
            this.startMove = true;
        if(this.startMove && !this.gameManager.isStop())
            this.node.x += this.moveSpeed * dt * (this.direction == 'right' ? 1 : this.direction == 'stop' ? 0 : -1);
    }

    onBeginContact(contact, self, other){
        const normal = contact.getWorldManifold().normal;
        if(!cmp(normal.x, 0) && (other.node.name == 'box_0')){
            this.direction = (this.direction == 'right' ? 'left' : 'right');
        }
        if(other.node.name == 'Player'){
            if(!cmp(normal.y, 0) && other.getComponent(ActorController).isAlive()){
                this.direction = 'stop';
                this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
                this.alive = false;

                this.updatePoints(100, self.node.x, self.node.y + 16);

                this.scheduleOnce(() => {
                    self.destroy();
                }, 0.4);
            }
        }
    }

    walk(){
        this.schedule(() => {
            if(!this.gameManager.isStop())
                this.node.scaleX = (this.node.scaleX == 2 ? -2 : 2);
        }, 0.1);
    }

    updatePoints(dt, x, y){
        this.gameManager.updatePoints(dt);

        let addPoints = cc.instantiate(this.addPointsPrefab);
        addPoints.setPosition(cc.v2(x, y));
        addPoints.setScale(2, 2);
        cc.find("Canvas/MapManager").addChild(addPoints);
        this.scheduleOnce(() => {
            addPoints.destroy();
        }, 1);
    }

    isAlive(){
        return this.alive;
    }
}