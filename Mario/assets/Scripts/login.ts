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
            let userList = firebase.database().ref('userList/' + uid + '/username');
            userList.once('value', snapshot => {
                console.log("username:", snapshot.val());
            })
        })
        .then(() => {
            cc.director.loadScene("levelSelect");
        })
        .catch(err => console.error(err));

    }

    // update (dt) {}
}
