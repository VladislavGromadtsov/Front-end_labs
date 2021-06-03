let header = {
    render : async () => {
        let view =  
        `<div>
            <a class="home_btn" href="#/">Anki</a>
         </div>
         <nav class="navbar">
            <a href="#/collections">Collections</a>
            <a href="#/cards">Cards</a>
            <a href="#/logout">LogOut</a>
        </nav>`

        return view
    }
    , after_render: async () => {
    }
}

export default header;