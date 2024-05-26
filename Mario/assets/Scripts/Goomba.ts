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

    @property(cc.String)
    private direction: string = 'right';
    private alive: boolean = true;
    private startMove: boolean = false;
    private fallDown: boolean = false;
    private _rigidbody: cc.RigidBody = null;

    @property(cc.Float)
    moveSpeed = 130;
    
    @property(GameManager)
    gameManager: GameManager = null;
    @property(cc.Prefab)
    addPointsPrefab: cc.Prefab = null;
    @property(cc.Node)
    player: cc.Node = null;

    start(){
        this._rigidbody = this.getComponent(cc.RigidBody);
    }
    onLoad(){
        this.walk();

    }
    update(dt: number){
        if(this._rigidbody.linearVelocity.y < -0.0001)
            this.fallDown = true;
        else
            this.fallDown = false;


        if(!this.startMove && Math.abs(this.player.x - this.node.x) < 650)
            this.startMove = true;
        if(!this.fallDown && this.startMove && !this.gameManager.isStop())
            this.node.x += this.moveSpeed * dt * (this.direction == 'right' ? 1 : this.direction == 'stop' ? 0 : -1);
    }

    onBeginContact(contact, self, other){
        const normal = contact.getWorldManifold().normal;
        if(!cmp(normal.x, 0) && (other.node.name == 'box_0') || other.node.name == 'Goomba'){
            this.direction = (this.direction == 'right' ? 'left' : 'right');
        }
    }

    die(){
        this.direction = 'stop';
        this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
        this.alive = false;

        this.updatePoints(100, this.node.x, this.node.y + 16);

        this.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this._rigidbody.linearVelocity = cc.v2(0, -5500);

        this.scheduleOnce(() => {
            this.destroy();
        }, 2);

    }

    walk(){
        this.schedule(() => {
            if(!this.fallDown && !this.gameManager.isStop())
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
        }, 0.5);
    }

    isAlive(){
        return this.alive;
    }
}