function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, ' '));//here first replace '+' with  ' '
            //after decode that data so if 'lotr fans+' are there then  after fans the '+' sign ' still not changed 
        }
    }
    return undefined;
}    

