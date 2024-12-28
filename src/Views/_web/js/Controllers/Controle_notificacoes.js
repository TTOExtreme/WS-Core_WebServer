/**
 * Arquivo destinado a todas as operações sobre as notificações
 */


class NTT_Notificacoes {


    // instancia de lista de notificações locais
    _lista_notificacoes = [];

    // template de notificação para ser adicionado a lista
    template_notificacao = {
        id: 0,
        Titulo: "Notificação Exemplo",
        Tag: { Titulo: "Aguardando", Cor: "orange", Background: "yellow" },
        Evento: "notificacao/abc",
        Dados: {},
        Lida: false
    };

    // inicialização da instancia
    constructor() {

        //Valida se ja existe o elemento de PopUp de notificações
        if (document.getElementById('NTT_Notificacoes_Tela_Simples') == undefined) {
            // cria o elemento primario
            let holderNotificacoes = document.createElement('div');
            holderNotificacoes.setAttribute('id', "NTT_Notificacoes_Tela_Simples");
            holderNotificacoes.setAttribute('class', "NTT_Notificacoes_Tela_Simples");

            Install_Componente("notificacoes_tela", {}, holderNotificacoes);

            document.body.appendChild(holderNotificacoes);
        }
        console.log("[Notificações] Iniciado sistema de Notificações")
    }

    /**
     * Adiciona uma notificação a Fila de notificações
     * Toda nova notificação é adicionada com a caracteristica de não Lida.
     * @param {number} id Id da notificação 
     * @param {String} Titulo Titulo da Notificação
     * @param {JSON} Tag Estrutura da tag de Notificação
     * @param {String} Evento Evento para emitir ao Clicar na notificação 
     * @param {JSON} Dados Dados para serem enviados ao Evento ao clicar 
     */
    Adicionar_Notificacao(id = 1, Titulo = "Exemplo Notificação", Tag = { Titulo: "Aguardando", Cor: "orange", Background: "yellow" }, Evento = "notificacao/add", Dados = {}) {
        let new_not = Object.assign({}, this.template_notificacao);
        new_not.id = id;
        new_not.Titulo = Titulo;
        new_not.Tag = Tag;
        new_not.Evento = Evento;
        new_not.Dados = Dados;

        // Adiciona a lista de notificacoes
        this._lista_notificacoes.push(new_not);

        // Adiciona notificação a tela de notificacoes
        let tabelaNotificacoes = document.getElementById('Notificacao_Table');
        if (tabelaNotificacoes != undefined) {
            let tr = document.createElement('tr');
            tr.setAttribute('id', "notificacao_item_id_" + id);
            tr.onclick = () => {
                this.Ler_Notificacao(id);
                /**
                 * TODO: ADICIONAR EVENT EMITTER
                 */
            }
            // Instala o componente
            Install_Componente("notificacoes_item",
                {
                    tag_color: Tag.Cor,
                    notificacao_tag_name: Tag.Titulo,
                    notificacao_titulo: Titulo
                }, tr);


            // Adiciona a notificação a tela
            tabelaNotificacoes.appendChild(tr);
        } else {
            console.log("[Notificações] erro ao realizar o carregamento da tela de notificações")
        }

        // Adiciona o listener para quando clicar no botao de notificacao abrir a tela simples de notificacoes
        document.getElementById('notificacao_botao').onclick = () => {
            this.Open_Tela();
        }

        // Atualiza o contador de notificacoes
        this.update_counter();
    }


    /**
     * registra a confirmação de leitura de uma notificação
     * @param {number} id 
     */
    Ler_Notificacao(id) {
        for (let i = 0; i < this._lista_notificacoes.length; i++) {
            if (this._lista_notificacoes[i].id == id) {
                this._lista_notificacoes[i].Lida = true;
            }
        }

        //Remove Notificações Lidas da Listagem
        let notificacao = document.getElementById("notificacao_item_id_" + id);
        if (notificacao != null) {
            notificacao.remove();
        }
        this.update_counter();
    }


    /**
     * Realiza a limpeza de todas as notificações existentes em memória
     */
    Limpar() {
        this._lista_notificacoes = [];
        this.update_counter();
    }

    /**
     * Realiza a atualização de quantidade de notificações não lidas
     */
    update_counter() {

        let qnt = this._lista_notificacoes.filter(notificacao => { return !notificacao.Lida; }).length;

        // Limita contador para somente 99
        if (qnt > 99) { qnt = 99 };

        // remove a visualização caso o contador for 0
        if (qnt <= 0) {
            document.getElementById('notificacoes_quantidades').style.opacity = 0;
        } else {
            document.getElementById('notificacoes_quantidades').style.opacity = 1;
        }
        document.getElementById('notificacoes_quantidades').children[0].innerText = qnt;
    }

    /**
     * Realiza o fechamento da tela de notificacoes
     */
    Close_Tela() {
        document.getElementById('NTT_Notificacoes_Tela_Simples').classList.remove('notificacao_tela_simples_show');
    }

    /**
     * Realiza a abertura da tela de notificacoes
     */
    Open_Tela() {
        document.getElementById('NTT_Notificacoes_Tela_Simples').classList.add('notificacao_tela_simples_show');
        document.getElementById('NTT_Notificacoes_Tela_Simples').style.opacity = 1;
    }

    /**
     * Abre a aba contendo mais detalhamento de Notificacoes
     */
    Open_Aba() {
        console.log("[Notificações] Falta Implementação de abertura de Aba")
    }
}