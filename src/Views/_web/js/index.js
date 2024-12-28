/**
 * Declaração de Instancias de controle;
 */

// Instancia da Classe Notificações
let _Notificacoes;

// Instancia de comunicação WebSocket
let _WebSocket;


window.onload = () => {
    /**
     * Inicializações de Controladores
     */

    // Inicializa Notificações
    _Notificacoes = new NTT_Notificacoes();

    // Inicializa o WebSocket
    _WebSocket = new NTT_WebSocket();
    _WebSocket.Conectar();





    /**
     * Carregamento dos dados / informações
     */

    // Carrega as Notificacoes
    Load_Notificacoes();

    // Carrega Abas
    Load_Favoritos();
}




/**
 * FUNÇÃO TEMPORARIA SOMENTE PARA GERAR ABAS DE TEMPLATE
 * TODO: Apartar Funcionamento de carregamento de abas favoritadas
 */
function Load_Favoritos() {

    /**
     * Cria Todas as Abas
     * TODO: Listar Abas favoritas e abrir todas elas;
     */
    // for (let i = 0; i < 200; i++) {
    //     Adicionar_Aba_Superior("id" + i, "Aba " + i, "evento/aba" + i, {});
    // }
}


/**
 * FUNÇÃO TEMPORARIA SOMENTE PARA GERAR NOTIFICACOES DE TEMPLATE
 * TODO: Apartar Funcionamento de carregamento de NOTIFICACOES
 */
function Load_Notificacoes() {
    _Notificacoes.Limpar();

    // setTimeout(() => {
    //     for (let i = 0; i < 200; i++) {
    //         setTimeout(() => {
    //             //Cria uma notificaçao de exemplo
    //             _Notificacoes.Adicionar_Notificacao(i, "Notificacao Teste " + i, undefined, "notificacao/add", {});
    //         }, 10 * i);
    //     }

    //     setTimeout(() => {

    //         for (let i = 0; i < 10; i++) {
    //             setTimeout(() => {
    //                 //Cria uma notificaçao de exemplo
    //                 _Notificacoes.Ler_Notificacao(i);
    //             }, 10 * i);
    //         }
    //     }, 3000)
    // }, 3000)
}


/**
 * Função Responsavel pelo Logout e limpeza dos cookies
 */
function Logout() {
    eraseCookie("WSCore_Auth");
    window.location.pathname = '/login.html';
}



/**
 * Armazena o cookie especificado com data limite de expiração
 * @param {String} name Nome do Cookie
 * @param {String} value Valor do Cookie
 * @param {Number} timestamp_limite Timestamp limite para manter o cookie salvo
 */
function setCookie(name, value, timestamp_limite = new Date().getTime() + (24 * 3600 * 1000)) {
    let expires = "";
    let date = new Date(timestamp_limite);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Retorna o valor do cookie especificado
 * @param {String} name Nome do Cookie
 */
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Apaga o Cookie armazenado
 * @param {String} name Nome do Cookie
 */
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}