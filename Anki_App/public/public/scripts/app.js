"use strict";

import home from "./views/home.js"
import card from "./views/card.js"
import collection from "./views/collection.js"
import collections from "./views/collections.js"
import play from "./views/play.js"
import registration from "./views/registration.js"
import cards from "./views/cards.js"
import utils from "./services/utils.js"
import error404 from "./views/error404.js"
import header from "./views/header.js"
import login from "./views/login.js"
import logout from "./views/logout.js"
import notAuthorisedHeader from "./views/notAuthorisedHeader.js";
import cardDelete from "./views/cardDelete.js";
import collectionDelete from "./views/collectionDelete.js";


const routes = {
    '/'                         : home,
    '/cards'                    : cards,
    '/collections'              : collections,
    '/card/:id/edit'            : card,
    '/collection/:id/edit'      : collection,
    '/collection/:id/play'      : play,
    '/login'                    : login,
    '/registration'             : registration,
    '/logout'                   : logout,
    '/create-card'              : card,
    '/create-collection'        : collection,
    '/card/:id/delete'          : cardDelete,
    '/collection/:id/delete'    : collectionDelete,
};

// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Lazy load view element:
    const headerCont = null || document.getElementById('header');
    const content = null || document.getElementById('main');
    

    // Get the parsed URl from the addressbar
    let request = utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    if (isUserAuthorised()) {
        headerCont.innerHTML = await header.render();
        await header.after_render();
    }else{
        headerCont.innerHTML = await notAuthorisedHeader.render();
        await notAuthorisedHeader.after_render();
    }
    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead

    let page;
    if (isUserAuthorised() || request.resource == 'login' || request.resource == 'registration'){ 
        page = routes[parsedURL] ? routes[parsedURL] : error404;
    }else{
        page = login;
        window.location.replace('#/login');
    }

    content.innerHTML = await page.render();
    await page.after_render();

}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

function isUserAuthorised(){
    return localStorage.getItem('uid') != null;
}