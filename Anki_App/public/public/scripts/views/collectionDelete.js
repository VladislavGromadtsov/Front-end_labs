import utils from "../services/utils.js";

let collectionDelete = {
    render : async () => {
        let view = `
        
        `
        return view
    }
    , after_render: async () => {
        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');

        const request = utils.parseRequestURL();

        cardsRef.on('value', function(snapshot) {
            const snap = snapshot.val();
            console.log(snap);
            for (let item in snap){
                console.log(snap[item]['collectionId']);
                if (snap[item]['collectionId'] == request.id){
                    cardsRef.child(item).update({
                        collectionId: null,
                    })
                } 
            }
        });

        collectionsRef.child(request.id).remove();
        history.back();
    }

}

export default collectionDelete;