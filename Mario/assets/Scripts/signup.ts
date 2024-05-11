const {ccclass, property} = cc._decorator;

@ccclass
export default class login extends cc.Component {

    start () {
        let enterBtn = new cc.Component.EventHandler();
        enterBtn.target = this.node;
        enterBtn.component = "login";
        enterBtn.handler = "clickEnter";

        cc.find("Canvas/Form_background/Enter").getComponent(cc.Button).clickEvents.push(enterBtn);
    }

    clickEnter(){
        const username = cc.find("Canvas/Form_background/Username").getComponent(cc.EditBox).string;
        const email = cc.find("Canvas/Form_background/Email").getComponent(cc.EditBox).string;
        const password = cc.find("Canvas/Form_background/Password").getComponent(cc.EditBox).string;
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);

        // handle login with firebase 

        cc.director.loadScene("level_select");
    }

    // update (dt) {}
}
