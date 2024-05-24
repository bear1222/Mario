const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class login extends cc.Component {

    start () {
        let enterBtn = new cc.Component.EventHandler();
        enterBtn.target = this.node;
        enterBtn.component = "login";
        enterBtn.handler = "clickEnter";

        let xBtn = new cc.Component.EventHandler();
        xBtn.target = this.node;
        xBtn.component = 'login';
        xBtn.handler = 'goBack';

        cc.find("Canvas/Form_background/Enter").getComponent(cc.Button).clickEvents.push(enterBtn);
        cc.find("Canvas/Form_background/GoBack").getComponent(cc.Button).clickEvents.push(xBtn);
    }

    goBack(){
        cc.director.loadScene("menu");
    }

    clickEnter(){
        const email = cc.find("Canvas/Form_background/Email").getComponent(cc.EditBox).string;
        const password = cc.find("Canvas/Form_background/Password").getComponent(cc.EditBox).string;
        console.log("Email:", email);
        console.log("Password:");

        // handle login with firebase 
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCre => {
            const user = userCre.user;
            console.log("user:", user);
            return user.uid;
        })
        .then(uid => {
            alert('Log in successfully!');
            GlobalManager.instance.setUid(uid);
        })
        .catch(err => alert('log in fail, ' + err));

    }

    // update (dt) {}
}
