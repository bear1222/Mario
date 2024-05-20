const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class levelSelect extends cc.Component {

    start () {
        let loginBtn = new cc.Component.EventHandler();
        let signupBtn = new cc.Component.EventHandler();
        loginBtn.target = this.node;
        loginBtn.component = "levelSelect";
        loginBtn.handler = "loadLoginScene";
        signupBtn.target = this.node;
        signupBtn.component = "levelSelect";
        signupBtn.handler = "loadSignupScene";


        cc.find("Canvas/Btn1").getComponent(cc.Button).clickEvents.push(loginBtn);
        cc.find("Canvas/Btn2").getComponent(cc.Button).clickEvents.push(signupBtn);

    }

    loadLoginScene(){
        GlobalManager.instance.gameStart(1);
    }
    loadSignupScene(){
        GlobalManager.instance.gameStart(1);
    }

    // update (dt) {}
}