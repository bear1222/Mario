import { GameManager } from "./GameManager";
import Controller from "./input/Controller";
import { IInputControls } from "./input/IInputControls";
import question_box from "./question_box";
import Goomba from "./Goomba";

const { ccclass, property } = cc._decorator;

enum FacingDirection{
    Right,
    Left
}

function sign(x: number) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
function cmp(a: number, b: number){
    return (Math.abs(a - b) < 1e-3);
}

@ccclass
export default class ActorController extends Controller {
    @property({ type: cc.Enum(FacingDirection) })
    initialFacingDirection = FacingDirection.Right;

    private _animation: cc.Animation = null;
    private _rigidbody: cc.RigidBody = null;
    private physicManager: cc.PhysicsManager = null;
    private physicsboxCollider: cc.PhysicsBoxCollider = null;
    private small: boolean = true;
    private alive: boolean = true;
    private preJumpPressed: boolean = false;
    private noHurt: boolean = false;

    @property(GameManager)
    gameManager: GameManager = null;

    @property(cc.SpriteFrame)
    smallFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bigFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    dieFrame: cc.SpriteFrame = null;
    @property(cc.Prefab)
    addPointsPrefab: cc.Prefab = null;

    @property(cc.Integer)
    jumpVel: number = 700;
    @property(cc.Float)
    moveSpeed = 130;

    public moveAxisX = 0;
    public moveAxisY = 0;
    public get moveAxis2D() {
        return new cc.Vec2(this.moveAxisX, this.moveAxisY);
    }

    private fallDown: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        if (!this._animation) console.warn(`ActorController: Component cc.Animation missing on node ${this.node.name}`);
        this._rigidbody = this.node.getComponent(cc.RigidBody);
        if (!this._rigidbody) console.warn(`ActorController: Component cc.Rigidbody missing on node ${this.node.name}`);
        cc.director.getPhysicsManager().enabled = true;
        this._rigidbody.gravityScale = 5;
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicsboxCollider = this.getComponent(cc.PhysicsBoxCollider);
//        this.physicManager.gravity = cc.v2 (0, -200);
    }

    start() {
        super.start();
    }

    update(dt) {
        // Receive external input if available.
        if(!this.isAlive()){
            this.moveAxisX = this.moveAxisY = 0;
        }
        if(this.node.y < 0 && this.alive){
            this.alive = false;
            this.gameManager.playDieSE();
            this.scheduleOnce(() => {
                this.gameManager.die();
                this.reset();
            }, 2);
        }

        if (this.inputSource && this.alive) {
            this.moveAxisX = this.inputSource.horizontalAxis;
            this.moveAxisY = this.inputSource.verticalAxis;
        }
        if(this.gameManager.isStop())
            this.moveAxisX = this.moveAxisY = 0;
        
        if(this._rigidbody.linearVelocity.y != 0)
            this.fallDown = true;
        else
            this.fallDown = false;


        if(this.moveAxisX != 0){
            this.node.x += this.moveSpeed * dt * this.moveAxisX;
            this.node.scaleX = this.moveAxisX * 2;
        }
        if(!this.preJumpPressed && this.inputSource && this.inputSource.jumpPressed && this.alive && !this.gameManager.isStop()){
            this.playerJump(this.jumpVel);
        }
        this.preJumpPressed = this.inputSource.jumpPressed;

        this.playAnimiation();

    }

    reset(){
        this.node.setPosition(cc.v2(70, 40));
        this.small = true;
//        this.becomeBig(false);
    }

    playerJump(vel: number){
        if(!this.fallDown){
            this._rigidbody.linearVelocity = cc.v2(0, vel);
            this.gameManager.playJumpSE();
        }
    }

    onBeginContact(contact, self, other){
        const type = other.node.name;
        const normal = contact.getWorldManifold().normal;
        console.log("type:", type, normal.x);
        if(!this.alive){
            contact.disabled = true;
            return;
        }
        if(type == "mushroom"){
            other.node.destroy();
            this.becomeBig(true);
            this.updatePoints(100, other.node.x, other.node.y + 16);
        }
        if(type == "Goomba"){
            contact.disabled = true;
            if(this.noHurt)
                return;
            if(!cmp(normal.x, 0) && other.getComponent(Goomba).isAlive()){
                if(this.small){
                    // lose one life
                    this.alive = false;
                    this.moveAxisX = 0;

                    this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
                    

                    this.gameManager.playDieSE();
                    this.scheduleOnce(() => {
                        if(!this.fallDown)
                            this._rigidbody.linearVelocity = cc.v2(0, this.jumpVel);
                        this.scheduleOnce(() => {
                            this.gameManager.die();
                        }, 1.5);
                    }, 0.5);
                }else{
                    this.noHurt = true;
                    this.scheduleOnce(() => {
                        this.noHurt = false;
                    }, 3);
                    this.becomeBig(false);
                }
            }else{
                this._rigidbody.linearVelocity = cc.v2(0, this.jumpVel);
//                this.updatePoints(100, other.node.x, other.node.y + 32);
                this.gameManager.playStompSE();
            }
        }
        if(type == "Flag"){
            contact.disabled = true;
            this.gameManager.playGameFinish();
        }
    }

    playAnimiation(){
        if(!this.isAlive()){
            this._animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.dieFrame;
            return;
        }
        if(this.small){
            if(!this._rigidbody.linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)){
                if(!this._animation.getAnimationState("jump_small").isPlaying){
                    this._animation.play("jump_small");
                }
            }else{
                if(this.moveAxisX == 0){
                    this.getComponent(cc.Sprite).spriteFrame = this.smallFrame;
                    this._animation.stop();
                }else if(!this._animation.getAnimationState("run_small").isPlaying){
                    this._animation.play("run_small");
                }
            }
        }else{
            if(!this._rigidbody.linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)){
                if(!this._animation.getAnimationState("jump_big").isPlaying){
                    this._animation.play("jump_big");
                }
            }else{
                if(this.moveAxisX == 0){
                    this.getComponent(cc.Sprite).spriteFrame = this.bigFrame;
                    this._animation.stop();
                }else if(!this._animation.getAnimationState("run_big").isPlaying){
                    this._animation.play("run_big");
                }
            }

        }
    }

    becomeBig(becomeBig: boolean){
        if(becomeBig){
            this.small = false;
            this.physicsboxCollider.size.height = 26;
            this.physicsboxCollider.apply();
            this.blanking();
            this.gameManager.playBecomeBigSE();
        }else{
            this.small = true;
            this.physicsboxCollider.size.height = 16;
            this.physicsboxCollider.apply();
            this.blanking();
            this.gameManager.playBecomeSmallSE();
        }
    }

    blanking(){
        let action = cc.blink(1, 10);
        this.node.runAction(action);
    }

    updatePoints(dt, x, y){
        this.gameManager.updatePoints(dt);

        let addPoints = cc.instantiate(this.addPointsPrefab);
        addPoints.setPosition(cc.v2(x, y));
        cc.find("Canvas/MapManager").addChild(addPoints);
        this.scheduleOnce(() => {
            addPoints.destroy();
        }, 1);
    }

    isAlive(){
        return this.alive;
    }
}