


/**
 * Realiza o carregamento de um novo script e aguarda o Load do mesmo antes
 * de chamar o callback
 * @param {string} nomeScript 
 * @param {function} callback 
 */
function Carregar_Script(nomeScript = "", callback = () => { }) {
    //valida se o script ja foi carregado caso nao adiciona para carregamento
    if (document.getElementById(nomeScript) == undefined) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = nomeScript;
        script.id = nomeScript;

        script.onload = callback;

        document.head.appendChild(script);
    } else {
        callback();
    }
}

/**
 * Realiza o carregamento de um nova folha de estilos e aguarda o Load do mesmo antes
 * de chamar o callback
 * @param {string} nomeScript 
 * @param {function} callback 
 */
function Carregar_CSS(nomeCSS = "", callback = () => { }) {
    //valida se a folha de estilos ja foi carregado caso nao adiciona para carregamento
    if (document.getElementById(nomeCSS) == undefined) {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = nomeCSS;

        link.onload = callback;

        document.head.appendChild(link);
    } else {
        callback();
    }
}