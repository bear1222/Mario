import Controller from "./input/Controller";
import { IInputControls } from "./input/IInputControls";

const { ccclass, property } = cc._decorator;

enum FacingDirection{
    Right,
    Left
}

function sign(x: number) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

const JUMPSTEP: number = 5500000;
/**
 * A component that implements movement and actions for each actor.
 * Toggle "Use Player Input" to read from player input.
 */
@ccclass
export default class MarioSmall extends Controller {
    @property({ type: cc.Enum(FacingDirection) })
    initialFacingDirection = FacingDirection.Right;

    private _animation: cc.Animation = null;
    private _rigidbody: cc.RigidBody = null;
    private physicManager: cc.PhysicsManager = null;
    private idleFrame: cc.SpriteFrame = null;
    @property(cc.Integer)
    jumpVel: number = 0;

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
//        this.physicManager.gravity = cc.v2 (0, -200);
    }

    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        super.start();
    }

    update(dt) {
        // Receive external input if available.
        if(this.node.y < 0)
            this.reset();
        if (this.inputSource) {
            this.moveAxisX = this.inputSource.horizontalAxis;
            this.moveAxisY = this.inputSource.verticalAxis;
        }
        if(this._rigidbody.linearVelocity.y != 0)
            this.fallDown = true;
        else
            this.fallDown = false;


        if(this.moveAxisX != 0){
            this.node.x += this.moveSpeed * dt * this.moveAxisX;
            this.node.scaleX = this.moveAxisX;
        }
//        if (!this._rigidbody.linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)) {
//            if (this._animState != this._moveAnimState) {
//                this._animState = this._animation.play(this.moveAnimationName);
//            }
//        }
//        else {
//            if (this._animState != this._idleAnimState) {
//                this._animState = this._animation.play(this.idleAnimationName);
//            }
//            
//        }
        if(this.inputSource && this.inputSource.jumpPressed){
            this.playerJump(this.jumpVel);
        }

        this.playAnimiation();
//        const newPosition2D = new cc.Vec2(this.node.position.x, this.node.position.y).add(this._rigidbody.linearVelocity);
//        this.node.setPosition(newPosition2D);

    }

    reset(){
        this.node.setPosition(cc.v2(70, 40));
    }

    playerJump(vel: number){
        if(!this.fallDown){
            this._rigidbody.linearVelocity = cc.v2(0, vel);
        }
    }

    onBeginContact(contact, self, other){
        const type = other.node.name;
        console.log("type:", type);
        if(type == "ground"){
            console.log(other.getComponent(cc.RigidBody).type);
        }
        if(type == "mushroom"){
            other.node.destroy();
        }
    }

    playAnimiation(){
        if(!this._rigidbody.linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)){
            if(!this._animation.getAnimationState("jump_small").isPlaying){
                this._animation.play("jump_small");
            }
        }else{
            if(this.moveAxisX == 0){
                this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                this._animation.stop();
            }else if(!this._animation.getAnimationState("run_small").isPlaying){
                this._animation.play("run_small");
            }
        }
    }
}