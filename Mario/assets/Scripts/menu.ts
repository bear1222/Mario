const {ccclass, property} = cc._decorator;

@ccclass
export default class menu extends cc.Component {

    start () {
        let loginBtn = new cc.Component.EventHandler();
        let signupBtn = new cc.Component.EventHandler();
        loginBtn.target = this.node;
        loginBtn.component = "menu";
        loginBtn.handler = "loadLoginScene";
        signupBtn.target = this.node;
        signupBtn.component = "menu";
        signupBtn.handler = "loadSignupScene";


        cc.find("Canvas/loginBtn").getComponent(cc.Button).clickEvents.push(loginBtn);
        cc.find("Canvas/signupBtn").getComponent(cc.Button).clickEvents.push(signupBtn);
    }

    loadLoginScene(){
        cc.director.loadScene("login");
    }
    loadSignupScene(){
        cc.director.loadScene("signup");
    }

    // update (dt) {}
}
