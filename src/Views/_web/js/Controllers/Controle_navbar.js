

/**
 * Controle de seleção da barra de navegação superior
 * nas operações de onclick realiza a troca de estado, 
 * e emite o evento correspondente
 * @param {HTML_Object} objeto_barra Objeto onde ocorreu a ação de click
 * @param {String} evento Nome do evento a ser emitido  
 * @param {JSON} dados Dados a serem enviados junto ao evento
 */
function navbar_top_click(objeto_barra, evento = "aba/click", dados = {}) {
    // Itera entre todas as abas e remove a classe de Selecionada
    for (let i = 0; i < objeto_barra.parentElement.children.length; i++) {
        console.log(objeto_barra.parentElement.children[i].children[0], objeto_barra.parentElement.children[0])
        if (objeto_barra.parentElement.children[i].children[0] != objeto_barra) {
            //Caso seja outra aba sem ser a que foi clicada remove a classe de selecionado
            objeto_barra.parentElement.children[i].children[0].classList.remove("navbar_aba_div_selecionada")
        }
    }

    // Realiza a adição da classe somente se o objeto nao conter
    if (!objeto_barra.children[0].classList.contains("navbar_aba_div_selecionada")) {
        objeto_barra.children[0].classList.add("navbar_aba_div_selecionada");
    }
}


/**
 * Realiza a adição de uma nova aba na barra de navegação Superior
 * @param {String} id da aba para referencias futuras
 * @param {String} titulo Titulo / texto na aba
 * @param {String} evento Evento a ser emitido quando a aba for selecionada
 * @param {JSON} dados Dados a serem emitidos quando selecionar a Aba
 */
function Adicionar_Aba_Superior(id = "", titulo = "", evento = "aba/click", dados = {}) {
    let barra_superior = document.getElementById('ntt_navbar_top_abas');

    // Set se a Aba esta como Favorito ou não
    let aba_favoritada = false;

    // Cria o objeto novo da aba e carrega o componente nela
    let nova_aba = document.createElement('td');
    Install_Componente('navbar_aba_div',
        {
            // Passe da chave de titulo da aba
            aba_titulo: titulo,
            // Passe de estado do icone Favorito da aba
            aba_favoritada: (aba_favoritada ? "navbar_aba_div_favoritada" : "")
        }, nova_aba);

    // Adiciona o atribuito ID a aba, para registro de operações futuras
    nova_aba.setAttribute('id', id);

    // Adiciona o listener no caso de click
    nova_aba.onclick = (ev) => {
        navbar_top_click(nova_aba, evento, dados);
    }

    // Adiciona aba na barra de navegação superior
    barra_superior.appendChild(nova_aba);
}