const {ccclass, property} = cc._decorator;

@ccclass
export default class signup extends cc.Component {

    start () {
        let enterBtn = new cc.Component.EventHandler();
        enterBtn.target = this.node;
        enterBtn.component = "signup";
        enterBtn.handler = "clickEnter";

        cc.find("Canvas/Form_background/Enter").getComponent(cc.Button).clickEvents.push(enterBtn);
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
        })
        .then(() => {
            cc.director.loadScene("level_select");
        })
        .catch(err => console.error(err));

    }

    // update (dt) {}
}
