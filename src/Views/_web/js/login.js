
function Login() {
    // Compila um JSON e criptografa a senha antes de enviar ao servidor
    let package = {
        Usuario: document.getElementById('username').value,
        Senha: CryptoJS.SHA3(document.getElementById('password').value).toString(),
        timestamp: new Date().getTime()
    }

    // Realiza o request de login e caso tenha sucesso redireciona para o ./
    fetch('./login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(package)
    }).then(data => {
        data.json().then(dadosRetorno => {
            // console.log(dadosRetorno);
            if (dadosRetorno != undefined) {
                if (dadosRetorno.login == "OK") {
                    setCookie("WSCore_Auth", dadosRetorno.token, dadosRetorno.data_token)

                    // Redireciona para a raiz do sistema
                    window.location.pathname = '';
                }
            }
        })
    });
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