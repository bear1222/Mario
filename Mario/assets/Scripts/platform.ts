
const { ccclass, property } = cc._decorator;


@ccclass 
export default class platform extends cc.Component{

    checkCollide(contact){
        const normal = contact.getWorldManifold().normal;
        if(normal.y != 1){
            contact.disabled = true;
        }
    }
    onBeginContact(contact, self, other){
        this.checkCollide(contact);
    }
    onEndContact(contact, self, other){
        this.checkCollide(contact);
    }
    onPreSolve(contact, self, other){
        this.checkCollide(contact);
    }
    onPostSolve(contact, self, other){
        this.checkCollide(contact);
    }
}