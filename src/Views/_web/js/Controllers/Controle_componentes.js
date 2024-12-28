/**
 * Arquivo especializado em carregamento de componentes
 * 
 * Adiciona a funcionalidade de controle de componentes e os conceitos
 * de carregamento + inserção de código unificado
 */


/**
 * Retorna o conteudo do componente, e sobrescreve as chaves de dados conforme JSON
 * @param {String} Nome_Componente 
 * @param {JSON} Tags_Componentes
 */
function Install_Componente(Nome_Componente = "", Tags_Componentes = { nome_chave1: "Valor1" }, HTML_Object) {
    fetch('./components/' + Nome_Componente + ".html")
        .then(res => res.text()) // Gets the response and returns it as a blob
        .then(componente => {

            // Insere todas as tags repassadas pelo JSON
            let componente_altered = componente;
            Object.keys(Tags_Componentes).forEach(tag => {
                componente_altered = componente_altered.replace(new RegExp("{" + tag + "}", 'g'), Tags_Componentes[tag]);
            })
            // Aplica o conteudo ja configurado no objeto repassado
            HTML_Object.innerHTML = componente_altered;
        }).catch((err) => {
            console.log("Erro ao carregar componente:", Nome_Componente, err);
        });
}


