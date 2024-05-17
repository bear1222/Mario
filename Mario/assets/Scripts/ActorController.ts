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

@ccclass
export default class ActorController extends Controller {
    @property({ type: cc.Enum(FacingDirection) })
    initialFacingDirection = FacingDirection.Right;

    private _animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;
    private _rigidbody: cc.RigidBody = null;
    private physicManager: cc.PhysicsManager = null;
    private physicsboxCollider: cc.PhysicsBoxCollider = null;
    private small: boolean = true;
    @property(cc.Integer)
    jumpVel: number = 0;
    @property(cc.SpriteFrame)
    smallFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bigFrame: cc.SpriteFrame = null;

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
        if(this.inputSource && this.inputSource.jumpPressed){
            this.playerJump(this.jumpVel);
        }

        this.playAnimiation();

    }

    reset(){
        this.node.setPosition(cc.v2(70, 40));
        this.becomeBig(false);
    }

    playerJump(vel: number){
        if(!this.fallDown){
            this._rigidbody.linearVelocity = cc.v2(0, vel);
        }
    }

    onBeginContact(contact, self, other){
        const type = other.node.name;
        const normal = contact.getWorldManifold().normal;
        console.log("type:", type, normal.x);
        if(type == "ground"){
            console.log(other.getComponent(cc.RigidBody).type);
        }
        if(type == "mushroom"){
            other.node.destroy();
            this.becomeBig(true);
        }
        if(type == "Goomba"){
            contact.disabled = true;
            if(normal.x != 0){
                console.log("player die");
                if(this.small){
                    // lose one life
                }else{
                    this.becomeBig(false);
                }
            }else{
                this._rigidbody.linearVelocity = cc.v2(0, this.jumpVel);
            }
        }
    }

    playAnimiation(){
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
            console.log("become big");
        }else{
            this.small = true;
            this.physicsboxCollider.size.height = 16;
            this.physicsboxCollider.apply();
        }
    }
}