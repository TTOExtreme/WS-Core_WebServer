/**
 * Superclasse de Tela
 * Responsavel por todas as operações basicas da tela
 */

class Controle_Tela {

    // Id da Tela
    id_tela;

    titulo_tela;

    // Instancia do objeto da tela
    instancia_tela;



    /**
     * 
     * @param {String} id_tela Id da tela  
     * @param {String} titulo Nome no cabeçalho da tela 
     */
    constructor(id_tela = null, titulo = "Titulo Não Informado") {
        if (window.TabelaID == undefined) { window.TabelaID = 0; }

        this.titulo_tela = titulo;

        /**
         * Caso de chamadas de novas instancias pode ser repassado um ID
         * onde essa instancia terá controle sobre uma tela existente
         */
        if (id_tela == null) {
            this.id_tela = "Tela_" + _GeraString();
        } else {
            this.id_tela = id_tela;
            this.instancia_tela = document.getElementById(this.id_tela);
        }
    }

    /**
     * Cria a tela e adiciona ao front
     */
    Criar_Tela(tipo_tela = "tela_tabela", callback = () => { }) {
        // valida se a tela ja existe (segundo o ID, evita criar dois componentes com mesmo ID)
        if (document.getElementById(this.id_tela) == undefined) {
            this.instancia_tela = document.createElement('div');
            this.instancia_tela.setAttribute('id', this.id_tela);
            this.instancia_tela.setAttribute('class', 'ntt_tela_holder hide');

            document.body.appendChild(this.instancia_tela);

            Install_Componente(tipo_tela,
                {
                    id_tela: this.id_tela,
                    titulo_tela: this.titulo_tela
                }
                , this.instancia_tela).then(() => {
                    callback();
                    this.Abrir_Tela();
                })
        } else {
            this.Abrir_Tela();
        }
    }

    /**
     * Fecha a tela e remove a mesma retornando a home
     */
    Fechar_Tela() {
        document.body.removeChild(this.instancia_tela);
        Remover_Aba_Superior(this.id_tela.replace("Tela_", ""));
    }

    /**
     * Caso a tela ja exista, coloca a mesma em primeiro plano
     */
    Abrir_Tela() {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].classList.contains("ntt_tela_holder") == 1) {

                if (document.body.children[i] != this.instancia_tela) {
                    //Caso seja outra tela sem ser a referente atual
                    document.body.children[i].classList.add("hide");
                }
            }
        }
        this.instancia_tela.classList.remove('hide');
    }

}