// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { hasImplementedInputControls, IInputControls } from "./IInputControls";

const {ccclass, property} = cc._decorator;

export default abstract class Controller extends cc.Component {

    protected inputSource: IInputControls = null;
    start(): void {
        this.registerInput(<any>this.node.getComponents(cc.Component).find(component => hasImplementedInputControls(<any>component)));
    }
    public registerInput(input: IInputControls) {
        if(input !== null)
            this.inputSource = input;
    }

}
