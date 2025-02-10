/**
 * ======================================================================================================
 * Aba superior
 * ======================================================================================================
 */

/**
 * Controle de seleção da barra de navegação superior
 * nas operações de onclick realiza a troca de estado, 
 * e emite o evento correspondente
 * @param {HTML_Object} objeto_barra Objeto onde ocorreu a ação de click
 * @param {String} evento Nome do evento a ser emitido  
 * @param {JSON} dados Dados a serem enviados junto ao evento
 */
function navbar_top_click(id, objeto_barra, callbackOnclick = () => { }) {
    // Itera entre todas as abas e remove a classe de Selecionada
    for (let i = 0; i < objeto_barra.parentElement.children.length; i++) {
        // console.log(objeto_barra.parentElement.children[i].children[0], objeto_barra.parentElement.children[0])
        if (objeto_barra.parentElement.children[i].children[0] != objeto_barra) {
            //Caso seja outra aba sem ser a que foi clicada remove a classe de selecionado
            objeto_barra.parentElement.children[i].children[0].classList.remove("navbar_aba_div_selecionada")
        }
    }

    // Realiza a adição da classe somente se o objeto nao conter
    if (!objeto_barra.children[0].classList.contains("navbar_aba_div_selecionada")) {
        objeto_barra.children[0].classList.add("navbar_aba_div_selecionada");
    }

    // Realiza a Abertura da Tela ao clicar na Aba
    callbackOnclick();
}

function Selecionar_Aba(id = "", callback = () => { }) {
    navbar_top_click(id, document.getElementById("navbar_" + id), callback);;
}


/**
 * Realiza a adição de uma nova aba na barra de navegação Superior
 * @param {String} id da aba para referencias futuras
 * @param {String} titulo Titulo / texto na aba
 * @param {String} evento Evento a ser emitido quando a aba for selecionada
 * @param {JSON} dados Dados a serem emitidos quando selecionar a Aba
 */
function Adicionar_Aba_Superior(id = "", titulo = "", aba_favoritada = false, callbackOnclick = () => { }) {
    let barra_superior = document.getElementById('ntt_navbar_top_abas');

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
    nova_aba.setAttribute('id', "navbar_" + id);

    // Adiciona o listener no caso de click
    nova_aba.onclick = (ev) => {
        navbar_top_click(id, nova_aba, () => {
            /**
             * TODO: Adicionar emissao de eventos conforme a aba for criada
             */
            callbackOnclick();
        });
    }

    // Adiciona aba na barra de navegação superior
    barra_superior.appendChild(nova_aba);
}

/**
 * Realiza a adição de uma nova aba na barra de navegação Superior
 * @param {String} id da aba para referencias futuras
 * @param {String} titulo Titulo / texto na aba
 * @param {String} evento Evento a ser emitido quando a aba for selecionada
 * @param {JSON} dados Dados a serem emitidos quando selecionar a Aba
 */
function Remover_Aba_Superior(id = "") {
    // seleciona a aba que queremos fechar
    let nova_aba = document.getElementById("navbar_" + id);
    // lista todas as abas
    let barra_superior = document.getElementById('ntt_navbar_top_abas');
    // encontra o indice da aba anterior, -2 caso não exista nenhuma aba
    let index_aba = Array.from(barra_superior.children).indexOf(nova_aba) - 1;

    // caso a aba anterior exista seleciona a mesma
    if (index_aba > -1) {
        // Aciona o Click do objeto HTML para que seja aberto a Aba
        barra_superior.children[index_aba].click();
    }
    // Adiciona aba na barra de navegação superior
    barra_superior.removeChild(nova_aba);
}


/**
 * ======================================================================================================
 * Aba Lateral Esquerda
 * ======================================================================================================
 */

function Adicionar_Menu(Dados_Menu) {
    /**
  {
    "id": 4,
    "codigo": "menu/cadastros/perfis",
    "nome": "Perfis",
    "descricao": "Controle de Perfis de Usuários",
    "menu_pai": "menu/cadastros",
    "versao": "0.0.1",
    "permissao": "tela/cadastros/perfis",
    "modulo": "WSCore_Autenticador",
    "evento": "open/menu/cadastros/usuarios",
    "load_dependencia": "./modulo/Autenticador/js/Perfis.js",
    "configuracao": "{}",
    "ativo": 1,
    "excluido": 0
  }
     */

    const ID_Menu = "Menu_" + Dados_Menu.codigo;
    const ID_Menu_Pai = "Menu_" + Dados_Menu.menu_pai;


    const Menu_Holder = document.getElementById('Menu_Lateral_Esquerdo_Holder');
    const Aba_Lateral = document.getElementById("ntt_navbar_left");
    const Menu_Tabela = document.getElementById('Menu_Lateral_Esquerdo_Tabela');

    let tr = document.createElement('tr');

    if (typeof (Dados_Menu.configuracao) === 'string') {
        Dados_Menu.configuracao = JSON.parse(Dados_Menu.configuracao);
    }


    if (Dados_Menu.menu_pai == "") {
        /**
         * Caso seja um menu Primario e não um Sub Menu
         */
        Install_Componente('./navbar_menu_item', {
            id_menu: ID_Menu,
            menu_icon: (Dados_Menu.configuracao.menu_icon != undefined ? Dados_Menu.configuracao.menu_icon : ""),
            menu_titulo: Dados_Menu.nome
        }, tr).then(() => {
            const submenuHolder = document.getElementById(ID_Menu + "_submenu_holder");
            const menuItem = document.getElementById(ID_Menu + "_menu_item");

            menuItem.onclick = () => {
                if (submenuHolder.classList.contains('hide')) {
                    submenuHolder.classList.remove('hide');
                } else {
                    submenuHolder.classList.add('hide');
                }
            }

        });
        Menu_Tabela.appendChild(tr);
    } else {
        /**
         * Caso seja um Sub Menu
         */
        const Menu_Pai_Holder = document.getElementById(ID_Menu_Pai + "_submenu_holder");


        // Caso o elemento nao tenha carregado ainda aguarda 50ms antes de tentar novamente
        if (Menu_Pai_Holder == undefined || Menu_Pai_Holder == null) {
            setTimeout(() => {
                Adicionar_Menu(Dados_Menu);
            }, 100)
            return;
        }

        const td = document.createElement('td');

        Install_Componente('navbar_submenu_item', {
            id_menu: ID_Menu,
            menu_icon: (Dados_Menu.configuracao.menu_icon != undefined ? Dados_Menu.configuracao.menu_icon : ""),
            menu_titulo: Dados_Menu.nome,
            menu_descricao: Dados_Menu.descricao
        }, td);

        /**
         * Cria o listener de OnClick
         */
        td.onclick = () => {
            if (Dados_Menu.load_dependencia != undefined && Dados_Menu.load_dependencia != "") {
                Carregar_Script(Dados_Menu.load_dependencia, () => {
                    _Eventos.emit(Dados_Menu.evento, Dados_Menu);
                })
            } else {

            }
        }


        /**
         * Valida a localidade para carregar o submenu
         */
        if (Menu_Pai_Holder.children.length > 0) {
            /**
             * Caso ja exista uma row de Submenus
             */

            // Verifica se não esta acima de 4 submenus
            if (Menu_Pai_Holder.children[Menu_Pai_Holder.children.length - 1].children.length < 4) {
                Menu_Pai_Holder.children[Menu_Pai_Holder.children.length - 1].appendChild(td);
            } else {
                const tr = document.createElement('tr');
                tr.appendChild(td);
                Menu_Pai_Holder.appendChild(tr);
            }
        } else {
            /**
             * Caso seja o primeiro Submenu
             */
            const tr = document.createElement('tr');
            tr.appendChild(td);
            Menu_Pai_Holder.appendChild(tr);
        }

    }

}

/**
 * Realiza a pesquisa de submenus e mostra somente os que condizem com a mesma
 * @param {String} texto_pesquisa 
 */
function Pesquisar_Menu(texto_pesquisa) {
    const lista_menus = document.getElementsByClassName('Menu_Lateral_Esquerdo_Submenu_Holder');
    const lista_submenus = document.getElementsByClassName('Menu_Lateral_Esquerdo_SubItem');

    if (lista_submenus != undefined) {
        Array.from(lista_submenus).forEach(menu => {
            if (menu.getAttribute('search_texto').indexOf(texto_pesquisa) > -1 || texto_pesquisa == "") {
                // console.log(menu.getAttribute('search_texto'));
                if (menu.parentElement.classList.contains('hide')) {
                    menu.parentElement.classList.remove('hide');
                }
            } else {
                if (!menu.parentElement.classList.contains('hide')) {
                    menu.parentElement.classList.add('hide');
                }
            }
        })
    }

    if (lista_menus != undefined) {
        Array.from(lista_menus).forEach(menu => {
            if (texto_pesquisa.length != "") {
                // console.log(menu.getAttribute('search_texto'));
                if (menu.classList.contains('hide')) {
                    menu.classList.remove('hide');
                }
            } else {
                if (!menu.classList.contains('hide')) {
                    menu.classList.add('hide');
                }
            }
        })
    }
}

/**
 * Realiza a troca de estado do menu lateral
 */
function Click_MenuLateral(forcefechar = false) {
    let Menu_Lateral_Esquerdo = document.getElementById('ntt_navbar_left');

    if (Menu_Lateral_Esquerdo.style.width == "40px" && forcefechar == false) {
        Menu_Lateral_Esquerdo.style.width = "360px";
        let submenuHolder = document.getElementsByClassName('Menu_Lateral_Esquerdo_Submenu_Holder');
        if (submenuHolder != undefined) {
            for (let i = 0; i < submenuHolder.length; i++) {
                if (submenuHolder[i] != undefined) {
                    if (!submenuHolder[i].classList.contains('hide')) { submenuHolder[i].classList.add('hide'); }
                }
            }
        }
    } else {
        Menu_Lateral_Esquerdo.style.width = "40px";
        let submenuHolder = document.getElementsByClassName('Menu_Lateral_Esquerdo_Submenu_Holder');
        if (submenuHolder != undefined) {
            for (let i = 0; i < submenuHolder.length; i++) {
                if (submenuHolder[i] != undefined) {
                    if (!submenuHolder[i].classList.contains('hide')) { submenuHolder[i].classList.add('hide'); }
                }
            }
        }
    }
}
