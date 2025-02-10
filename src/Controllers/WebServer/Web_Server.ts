import * as Http from 'http';
import * as Https from 'https';
import express from 'express';
import { Logger } from '../Lib/Logger';
import * as fs from "fs";
import { Config_WebServer } from '../../Models/Modelo_Configuracao';
import { Web_Socket } from './Web_Socket';
import { Socket_Client } from '../Modulos/Socket_Client';



/**
 * Classe responsavel pelo controle de requests HTTP/HTTPs
 */
export class Web_Server {

    // instancia do servidor socket
    private socketServer!: Web_Socket;

    // Instancia do Logger
    private _Logger: Logger;

    // Modo de operação do WebServer
    private _Config: Config_WebServer;

    // Servidor Express, mantendo os Route e Midlewares
    private ExpressServer: express.Application;

    // Instancia de listening HTTPS
    private Https_Server!: Https.Server;

    // Instancia de listening HTTP
    private Http_Server!: Http.Server;

    private _Conexao_Core: Socket_Client;


    /**
     * Inicializador 
     * @param port numero da porta para o listener
     */
    constructor(config: Config_WebServer, core_conection: Socket_Client) {

        // Inicializa a Instancia do Logger        
        this._Logger = new Logger();

        // Armazena a configuração vindo do arquivo principal de config
        this._Config = config;

        // Inicializa uma instância do Express.
        this.ExpressServer = express();

        // Armazena a instancia da conexão com o core
        this._Conexao_Core = core_conection;
    }

    getcookie(req: any, cookie_name: string) {
        var cookies: string = req.headers.cookie;

        if (cookies != undefined) {
            let crequest = cookies.split('; ').find((value) => { return value.indexOf(cookie_name) > -1; })
            if (crequest != undefined) {
                return crequest.replace(cookie_name + "=", "");
            } else {
                return "";
            }
        }
        return "";
    }

    InicializarWebServer() {

        this._Logger.System("[WebServer] Iniciando o WebServer");
        /**
         * Para geração de certificados usando o lets encrypt segue o comando usando o certbot para geração
         *      # sudo certbot certonly --standalone --preferred-challenges http -d <DOMINIO> --agree-tos -m <EMAIL> --non-interactive --config-dir ./ --work-dir ./ --logs-dir ./  --rsa-key-size 8192
         * O comando acima ira gerar diversas pastas no local onde for executar, após finalização de geração (podendo ser acompanhado pelo comando:)
         *      # tail -f ./letsencrypt.log
         * O mesmo ira armazenar os certificados na seguinte pasta
         * 
         * Certificado: ./live/<DOMINIO>/fullchain.pem
         * Chave: ./live/<DOMINIO>/privkey.pem
         * 
         * podendo ser Mapeado no arquivo de config esses mesmos ou copialos para a raiz
         * OBS: Mantendo as pastas geradas, a renovação do certificado se torna mais facil e toda vez nao será necessario gerar um novo
         */

        // Definição da Rota Raiz para abrir o index.html
        this.ExpressServer.get('/', (req, res) => {
            let token = this.getcookie(req, "WSCore_Auth");
            if (token != "") {
                this._Logger.Info("Request do / com token <" + token + ">");
                this._Conexao_Core.emit("usuarios/logintoken", "WSCore_Autenticador/*", token, {}, (Dados_Usuario: any) => {
                    // this._Logger.Info("Usuario com token valido", Dados_Usuario)
                    if (Dados_Usuario.login == "OK") {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync(this._Config.Pasta_Arquivos_Html + '/index.html').toString());
                    } else {
                        res.redirect(req.protocol + "://" + req.hostname + ":" + (req.protocol == "https" ? this._Config.Porta_Https : this._Config.Porta) + "/login")
                    }
                })
            } else {
                res.redirect(req.protocol + "://" + req.hostname + ":" + (req.protocol == "https" ? this._Config.Porta_Https : this._Config.Porta) + "/login")
            }
        });

        // Definição da Rota Raiz para abrir o Login.html
        this.ExpressServer.get('/login', (req, res) => {
            let token = this.getcookie(req, "WSCore_Auth");
            if (token != "") {
                this._Conexao_Core.emit("usuarios/logintoken", "WSCore_Autenticador", token, {}, (Dados_Usuario: any) => {
                    if (Dados_Usuario.login == "OK") {
                        res.redirect(req.protocol + "://" + req.hostname + ":" + (req.protocol == "https" ? this._Config.Porta_Https : this._Config.Porta) + "/")
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(fs.readFileSync(this._Config.Pasta_Arquivos_Html + '/login.html').toString());
                    }
                })
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(fs.readFileSync(this._Config.Pasta_Arquivos_Html + '/login.html').toString());
            }
        });

        // Força o usuário a usar o /login ao invez do nome do arquivo
        this.ExpressServer.get('/login.html', (req, res) => {
            res.redirect(req.protocol + "://" + req.hostname + ":" + (req.protocol == "https" ? this._Config.Porta_Https : this._Config.Porta) + "/login")
        });


        // Habilita a conversão do conteudo do body para json
        this.ExpressServer.use(express.json())

        // Definição da Rota Raiz para abrir o index.html
        this.ExpressServer.post('/login', (req, res) => {
            /**
             * TODO: Verificar cookie e auto logar / redirecionar ao Login
             */


            // Realiza a validação do user e senha indefinido ou vazio antes de contatar o banco de dados
            if (req.body == undefined) { return; }
            if (req.body.Usuario == undefined) { return; }
            if (req.body.Usuario == '') { return; }
            if (req.body.Senha == undefined) { return; }
            if (req.body.Senha == '0eab42de4c3ceb9235fc91acffe746b29c29a8c366b7c60e4e67c466f36a4304c00fa9caf9d87976ba469bcbe06713b435f091ef2769fb160cdab33d3670680e') { return; }

            // Debug do conteudo do login
            // this._Logger.Log("Tentativa de login: ", req.body);





            this._Conexao_Core.emit("usuarios/login", "WSCore_Autenticador", "", req.body, (Dados_Usuario: any) => {
                // this._Logger.Log("Retorno de login: ", Dados_Usuario);
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end(JSON.stringify(Dados_Usuario));
            })

            // res.redirect(req.protocol + "://" + req.headers.host + "/");
            // res.writeHead(200, { 'Content-Type': 'text/html' });
            // res.end(fs.readFileSync(this._Config.Pasta_Arquivos_Html + '/index.html').toString());
        });


        // Definição das Rotas estaticas para chamar os arquivos da pasta principal
        this.ExpressServer.use('/', express.static(this._Config.Pasta_Arquivos_Html));

        /**
         * Verifica caso seja necessario um servidor HTTP para redirecionar para HTTPS
         */
        if (this._Config.Https_enable && this._Config.Http_redireciona_Https) {
            // Inicia um servidor HTTP independente 
            const httpApp = express();

            // Redireciona todo request http para https com o restante do path
            httpApp.get("*", (req, res, next) => {
                res.redirect("https://" + req.headers.host + ":" + this._Config.Porta_Https + req.path);
            });

            // Instancia a rota unica do Express para o listener http
            this.Http_Server = Http.createServer(httpApp);

            // Força a transformação em Number, conversão do Valor para number
            const httpport: number = parseInt((this._Config.Porta) + "");

            // Inicializa o Listener
            this.Http_Server.listen(httpport, this._Config.Host, () => {
                this._Logger.System("[WebServer] Iniciado servidor HTTP para redirecionamento para HTTPS:", this._Config.Host + ":" + this._Config.Porta);
            });
        }

        /**
         * Inicializa um servidor HTTPS
         */
        if (this._Config.Https_enable) {
            // Carrega o certificado gerado para o HTTPS
            const httpsOptions = {
                //certificado generico gerado para rodar o HTTPS corretamente
                key: fs.readFileSync(this._Config.Https_Chave),
                cert: fs.readFileSync(this._Config.Https_Certificado)
            };


            this.Https_Server = Https.createServer(httpsOptions, this.ExpressServer);

            /**
             * Inicio da instancia de WebSocket em base do HTTPS
             */
            this.socketServer = new Web_Socket(this.Https_Server, this._Conexao_Core);

            // Força a transformação em Number, conversão do Valor para number
            const httpsport: number = parseInt((this._Config.Porta_Https) + "");

            this.Https_Server.listen(httpsport, this._Config.Host, () => {
                // Mensagem de retorno para saber se foi feito a conexão do webserver
                this._Logger.System("[WebServer] Iniciado servidor HTTPS:", this._Config.Host + ":" + this._Config.Porta_Https);
            });
        } else {
            /**
             * Inicializa um servidor HTTP
             */
            this.Http_Server = Https.createServer(this.ExpressServer);

            /**
             * Inicio da instancia de WebSocket em base do HTTPS
             */
            this.socketServer = new Web_Socket(this.Http_Server, this._Conexao_Core);

            // Força a transformação em Number, conversão do Valor para number
            const httpport: number = parseInt((this._Config.Porta_Https) + "");

            //  Servidor HTTP configurado para rodar na porta 8080
            this.Http_Server.listen(httpport, this._Config.Host, () => {
                // Mensagem de retorno para saber se foi feito a conexão do webserver
                this._Logger.System("[WebServer] Iniciado servidor HTTP:", this._Config.Host + ":" + this._Config.Porta);
            });

        }
    }
}