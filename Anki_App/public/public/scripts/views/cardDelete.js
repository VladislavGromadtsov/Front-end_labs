import utils from "../services/utils.js";

let cardDelete = {
    render : async () => {
        let view = `
        
        `
        return view
    }
    , after_render: async () => {
        const ref = firebase.database().ref();
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');
        const request = utils.parseRequestURL();

        cardsRef.child(request.id).remove();
        history.back();
    }

}

export default cardDelete;