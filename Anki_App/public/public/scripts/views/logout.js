let logout = {
    render : async () => {
        let view = `
        `
        return view
    }
    , after_render: async () => {
        firebase.auth().signOut();
        localStorage.removeItem('uid');
        window.location.replace('#/')  
    }
}

export default logout;