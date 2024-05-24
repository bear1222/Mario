
const { ccclass, property } = cc._decorator;


@ccclass 
export default class platform extends cc.Component{

    checkCollide(contact, self, other){
        const normal = contact.getWorldManifold().normal;
        const playerBoundingBox = other.getAABB();
        const platformBoundingBox = self.getAABB();
        const ymin1 = playerBoundingBox.yMin + 5;
        const ymax2 = platformBoundingBox.yMax;
        if(normal.y != 1){
            contact.disabled = true;
        }else if(other.node.name == 'Player' && ymin1 < ymax2){
            contact.disabled = true;
        }else
    }
    onBeginContact(contact, self, other){
        const colliderA = contact.colliderA;
        const colliderB = contact.colliderB;
        this.checkCollide(contact, colliderA, colliderB);
    }
    onEndContact(contact, self, other){
        const colliderA = contact.colliderA;
        const colliderB = contact.colliderB;
        this.checkCollide(contact, colliderA, colliderB);
    }
    onPreSolve(contact, self, other){
        const colliderA = contact.colliderA;
        const colliderB = contact.colliderB;
        this.checkCollide(contact, colliderA, colliderB);
    }
    onPostSolve(contact, self, other){
        const colliderA = contact.colliderA;
        const colliderB = contact.colliderB;
        this.checkCollide(contact, colliderA, colliderB);
    }
}