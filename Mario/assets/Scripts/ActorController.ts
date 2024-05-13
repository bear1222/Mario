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
export default class ActorController extends Controller {
    @property({ type: cc.Enum(FacingDirection) })
    initialFacingDirection = FacingDirection.Right;

    private _animation: cc.Animation = null;
    private _animState: cc.AnimationState = null;
    private _rigidbody: cc.RigidBody = null;
    @property(cc.String)
    idleAnimationName: string = "";
    @property(cc.String)
    moveAnimationName: string = "";
    private _idleAnimState: cc.AnimationState = null;
    private _moveAnimState: cc.AnimationState = null;

    @property(cc.Float)
    moveSpeed = 130;
    public moveAxisX = 0;
    public moveAxisY = 0;
    public get moveAxis2D() {
        return new cc.Vec2(this.moveAxisX, this.moveAxisY);
    }

    private _isJumping: boolean = false;
    private _jumpStep: number = 0;
    private _jumpTime: number = 0.5;
    private _curJumpTime: number = 0;
    private _curJumpSpeed: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        if (!this._animation) console.warn(`ActorController: Component cc.Animation missing on node ${this.node.name}`);
        this._rigidbody = this.node.getComponent(cc.RigidBody);
        if (!this._rigidbody) console.warn(`ActorController: Component cc.Rigidbody missing on node ${this.node.name}`);
        cc.director.getPhysicsManager().enabled = true;
        this._rigidbody.gravityScale = 50;
    }

    start() {
        super.start();
        this._idleAnimState = this._animation.getAnimationState(this.idleAnimationName);
        this._moveAnimState = this._animation.getAnimationState(this.moveAnimationName);
        this._animState = this._animation.play(this.idleAnimationName);

    }


    update(dt) {
        // Receive external input if available.
        if (this.inputSource) {
            this.moveAxisX = this.inputSource.horizontalAxis;
            this.moveAxisY = this.inputSource.verticalAxis;
            if(this.inputSource.jumpPressed && !this._isJumping){
                console.log("jumping!");
        console.log("mass:", this.node.getComponent(cc.RigidBody).getMass());
                this._isJumping = true;
                this._jumpStep = JUMPSTEP;
                this._curJumpTime = 0;
                this._curJumpSpeed = 0;
            }
        }

        this._rigidbody.linearVelocity = this.moveAxis2D.mul(this.moveSpeed * dt);
        if (!this._rigidbody.linearVelocity.fuzzyEquals(cc.Vec2.ZERO, 0.01)) {
            if (this._animState != this._moveAnimState) {
                this._animState = this._animation.play(this.moveAnimationName);
            }
            if (this.moveAxisX != 0) {
                this.node.setScale(new cc.Vec2(
                    // X
                    this.initialFacingDirection == FacingDirection.Right ?
                        sign(this.moveAxisX) :
                        -sign(this.moveAxisX)
                    ,
                    // Y
                    1
                    )
                );
                
            }

        }
        else {
            if (this._animState != this._idleAnimState) {
                this._animState = this._animation.play(this.idleAnimationName);
            }
            
        }
        const newPosition2D = new cc.Vec2(this.node.position.x, this.node.position.y).add(this._rigidbody.linearVelocity);
        this.node.setPosition(newPosition2D);

        if (this._isJumping) {
            // Update current jump time
            this._curJumpTime += dt;
            if (this._curJumpTime < this._jumpTime) {
                //TODO: make player jump
//                this._rigidbody.applyLinearImpulse(new cc.Vec2(0, JUMPSTEP), this._rigidbody.getWorldCenter(), true);
                this._curJumpSpeed = (1 - (this._curJumpTime / this._jumpTime)) * JUMPSTEP;
                this._rigidbody.applyForceToCenter(new cc.Vec2(0, this._curJumpSpeed), true);

            } else {
                // Jump duration exceeded, end jump
                this._isJumping = false;
            }
        }

    }

    
}