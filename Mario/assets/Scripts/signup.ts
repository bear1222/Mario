const {ccclass, property} = cc._decorator;
import { GlobalManager } from "./GlobalManager";

@ccclass
export default class signup extends cc.Component {

    start () {
        let enterBtn = new cc.Component.EventHandler();
        enterBtn.target = this.node;
        enterBtn.component = "signup";
        enterBtn.handler = "clickEnter";

        let xBtn = new cc.Component.EventHandler();
        xBtn.target = this.node;
        xBtn.component = 'signup';
        xBtn.handler = 'goBack';

        cc.find("Canvas/Form_background/Enter").getComponent(cc.Button).clickEvents.push(enterBtn);
        cc.find("Canvas/Form_background/GoBack").getComponent(cc.Button).clickEvents.push(xBtn);
    }

    goBack(){
        cc.director.loadScene("menu");
    }

    clickEnter(){
        console.log("hi");
        const username = cc.find("Canvas/Form_background/Username").getComponent(cc.EditBox).string;
        const email = cc.find("Canvas/Form_background/Email").getComponent(cc.EditBox).string;
        const password = cc.find("Canvas/Form_background/Password").getComponent(cc.EditBox).string;
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);

        // handle signup with firebase 
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCre => {
            const user = userCre.user;
            console.log("user:", user);

            return user.uid;
        })
        .then(uid => {
            let userList = firebase.database().ref('userList/' + uid);
            userList.update({username: username, email: email});
            GlobalManager.instance.setUid(uid);
            GlobalManager.instance.setUsername(username);
        })
        .then((uid) => {
            alert('Sign up successfully!');
        })
        .catch(err => alert('log in fail, ' + err));

    }

    // update (dt) {}
}
