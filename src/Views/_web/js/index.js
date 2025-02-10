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
    _WebSocket = new WSCore_WebSocket();
    _WebSocket.Conectar();





    /**
     * Carregamento dos dados / informações
     */

    // Carrega as Notificacoes
    Load_Notificacoes();

    // Carrega Abas
    Load_Favoritos();

    // Carrega os menus vindo do Servidor
    Load_Menus();



    /**
     * REMOVER UTILIZADO APENAS PARA DEBUG
     */
    let Menu_Lateral_Esquerdo = document.getElementById('ntt_navbar_left');
    Menu_Lateral_Esquerdo.style.width = "360px";

    /**
     * REMOVER UTILIZADO APENAS PARA DEBUG
     */
}



function Load_Menus() {
    _WebSocket.Emit("menus/Listar", "WSCore_Autenticador/*", {},
        (Lista_Menus) => {
            console.log("Retorno dados dos menus:", Lista_Menus);

            Lista_Menus.forEach(menu => {
                Adicionar_Menu(menu);
            });
        });

    /**
     * Inicializa as funcionalidades do Menu Lateral
     */

    // Abertura e fechamento do Menu
    let Menu_Lateral_Esquerdo_Open = document.getElementById('Menu_Lateral_Esquerdo_Open');
    Menu_Lateral_Esquerdo_Open.onclick = () => { Click_MenuLateral() };
}




/**
 * FUNÇÃO TEMPORARIA SOMENTE PARA GERAR ABAS DE TEMPLATE
 * TODO: Apartar Funcionamento de carregamento de abas favoritadas
 */
function Load_Favoritos() {


    /**
     * Teste de criação de telas
     */
    // Carregar_Script('./js/Controllers/Controle_tela.js', () => {
    //     Carregar_Script('./modulo/Autenticador/js/Usuarios.js', () => {
    //         let tela1 = new NTT_Core_Usuarios("Tela_teste_tela1", "Tela 1");
    //         Adicionar_Aba_Superior("teste_tela1", "Tela 1", false, () => {
    //             tela1.Criar_Tela("tela_tabela");
    //             tela1.Abrir_Tela();
    //         });


    //         let tela2 = new NTT_Core_Usuarios("Tela_teste_tela2", "Tela 2");
    //         Adicionar_Aba_Superior("teste_tela2", "Tela 2", false, () => {
    //             tela2.Criar_Tela("tela_tabela");
    //             tela2.Abrir_Tela();
    //         });
    //     })
    // })
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



function _GeraString() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}