const { ccclass, property } = cc._decorator;

@ccclass
export default class GameFinish extends cc.Component {
    @property(cc.Node)
    remainTimeNode: cc.Node = null;
    @property(cc.Node)
    addPointNode: cc.Node = null;

    onLoad(){
        this.node.active = false;
    }
    
    start(){

    }
    update(){
    }

    show(ti: number, poi: number){
        console.log('hi from game finish');
        this.node.zIndex = 1000;
        this.node.active = true;
        this.remainTimeNode.getComponent(cc.Label).string = ti.toString();
        this.addPointNode.getComponent(cc.Label).string = poi.toString();
    }

    recordScore(level: number, life: number, time: number, coin: number, point: number){
        console.log("record:", life, time, coin, point);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid);
                const uid = user.uid;
                let userList = firebase.database().ref('userList/' + uid + '/lastPlay');
                userList.update({level: level, life: life, time: time, coin: coin, point: point});
                firebase.database().ref('userList/' + uid).update({finish: 1});

                let usernameList = firebase.database().ref('userList/' + uid + '/username')
                usernameList.once('value')
                .then(snapshot => {
                    const username = snapshot.val();
                    console.log('username:', username);
                    const str = 'bestScoreList' + level + '/';
                    let bestScoreList = firebase.database().ref(str);
                    bestScoreList.once('value')
                    .then((snapshot) => {
                        let scores = snapshot.val() || [];
                        console.log('scores:', scores);
                        scores.push({username: username, score: point});
                        scores.sort((a, b) => b.score - a.score);
                        if(scores.length > 5){
                            scores = scores.slice(0, 5);
                        }
                        bestScoreList.set(scores, err => {
                            if(err)
                                console.error('error:', err);
                            else
                                console.log('update bestScore success');
                        })
                    })
                })
                .catch(err => {
                    console.error('error:', err);
                })


            } else {
                console.log("didn't log in");
            }
        });
    }
    recordState(level: number, life: number, time: number, coin: number, point: number){
        console.log("record:", life, time, coin, point);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid);
                const uid = user.uid;
                let userList = firebase.database().ref('userList/' + uid + '/lastPlay' + level);
                userList.update({level: level, life: life, time: time, coin: coin, point: point});
            } else {
                console.log("didn't log in");
            }
        });
    }

}