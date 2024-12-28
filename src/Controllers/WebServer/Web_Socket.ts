import * as SocketIO from 'socket.io';
import * as Http from 'http';
import * as Https from 'https';
import { Logger } from '../Lib/Logger';
import { Conexao_Cliente } from '../../Models/WebSocket/Modelo_Conexao_Cliente';
import { Socket_Client } from '../Modulos/Socket_Client';
import { Pacotes_Socket } from '../../Models/Modulos/Pacotes_Socket';

export class Web_Socket {

    // Instancia do Logger
    private _Logger: Logger;

    // Instancia do Servidor Socket
    private _SocketServer: SocketIO.Server;

    // Lista de Conexoes WebSocket
    private _List_Conexoes: Array<Conexao_Cliente>;

    // Conexão com o Socket do Core
    private _Conexao_Core: Socket_Client;

    constructor(Http_Https_Server: Http.Server | Https.Server, conexao_core: Socket_Client) {

        // Armazena a instancia de socket com o Core
        this._Conexao_Core = conexao_core;

        // Inicializa a conexão Socket.IO com o Servidor Http/Https dependendo da configuração
        this._SocketServer = new SocketIO.Server(Http_Https_Server);

        // Inicializa a instancia do Logger
        this._Logger = new Logger();

        // Inicializa o Array de conexoes WebSocket
        this._List_Conexoes = new Array<Conexao_Cliente>();
        this.StartServer();
    }


    /**
     * Inicia as rotas de Listening dos eventos do WebSocket
     */
    StartServer() {
        return new Promise<void>((resolv, reject) => {
            // Cria todos os listeners do servidor
            //this._SocketServer = new SocketIO.Server();

            /**
             * quando uma nova conexão inicia, é iniciado o listening para inicialização de um módulo novo, 
             * somente adicionando na listagem geral quando a inicialização é completada.
             */
            this._SocketServer.on("connection", (clisocket) => {

                /**
                 * Instancia nova conexao do cliente e adiciona na lista de conexoes
                 */
                let Cliente_Conectado: Conexao_Cliente = new Conexao_Cliente();
                Cliente_Conectado.Socket = clisocket;
                this._List_Conexoes.push(Cliente_Conectado);

                this._Logger.Info("[WebSocket] Novo Cliente conectado")


                /**
                 * Repasse do evento de conexão
                 */
                Cliente_Conectado.Socket.on("usuarios/logintoken", (destino: string, dados: { token: string }, callback = (...retorno_callback: any) => { }) => {
                    this._Logger.Info("[WebSocket] Evento de login: ", dados.token);
                    this._Conexao_Core.emit("usuarios/logintoken", destino, dados, (Dados_Usuario) => {
                        Cliente_Conectado._Usuario = Dados_Usuario;
                        Cliente_Conectado.Conexao_ID = Dados_Usuario.token;
                        callback(Dados_Usuario);
                    });
                })

                /**
                 * Repasse de eventos Genericos
                 */
                Cliente_Conectado.Socket.onAny((evento: string, destino: string, dados: Object, callback = (...retorno_callback: any) => { }) => {
                    if (evento == "usuarios/logintoken") { return; }
                    this._Logger.Info("[WebSocket] Emitindo Evento", evento, destino);

                    /**
                     * 
                     */
                    this._Conexao_Core.emit(evento, destino, { token: Cliente_Conectado.Conexao_ID, dados: dados }, callback);
                })

                /**
                 * Caso cliente venha a desconectar realiza a remoção do mesmo da fila
                 */
                Cliente_Conectado.Socket.on('disconnect', () => {
                    this._Logger.Info("Conexão WebSocket Finalizada");

                    // Remove a instancia do módulo conectado caso haja desconexão
                    let indexMod = this._List_Conexoes.indexOf(Cliente_Conectado);
                    if (indexMod > -1) {
                        this._List_Conexoes.splice(indexMod, 1);
                    }
                })

                //this._List_Conexoes.push(Cliente_Conectado);
            });

            // Inicia o servidor Socket
            /**
             * Socket IO somente suporta conexão de qualquer interface, para conexões em interfaces especificas
             * será necessario subir a instancia do socketio para baixo de outro listener (http, https, express ...)
             */
            this._Logger.System("[WebSocket] Inicializado servidor WebSocket Junto com instancia do WebServer")
            resolv();
        });
    }

}