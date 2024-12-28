/**
 * Controlador de conectividade WebSocket com o servidor
 * 
 */


class NTT_WebSocket {

    // Instancia WebSocket
    _Socket = undefined;

    // Dados do usuário (Sincronizado ao Websocket)
    _Usuario = undefined;

    constructor() {
        console.log("[WebSocket] Inicializando WebSocket");
    }


    /**
     * Realiza a inicialização de comunicação WebSocket e Autentica
     */
    Conectar() {
        // Limpa a instancia antes de tentar reconectar
        if (this._Socket != undefined) {
            try {
                this._Socket.end();
            } catch (err) { }
            this._Socket = undefined;
        }

        /**
         * Inicializa a conectividade com o servidor
         */
        console.log("[WebSocket] conectando");
        this._Socket = io("/");

        /**
         * Ao conectar realiza a autenticação usando o Token
         */
        this._Socket.on('connect', () => {
            console.log("[WebSocket] Conectado ao WebSocket");

            /**
             * realiza a autenticação com Token
             */
            this._Socket.emit("usuarios/logintoken", "WSCore_Autenticador/*", { token: getCookie("WSCore_Auth") },
                (Dados_Usuario) => {
                    if (Dados_Usuario.login == "Erro") {
                        console.log("Erro ao tentar autenticar com o Token", Dados_Usuario, getCookie("WSCore_Auth"));
                    }
                    this._Usuario = Dados_Usuario;
                    //console.log("Retorno dados do usuario:", Dados_Usuario)
                });
        });

        this._Socket.on('disconnect', () => {
            //this.Conectar();
        });
    }
}
