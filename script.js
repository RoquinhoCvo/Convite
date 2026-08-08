// URL do seu Web App do Google Apps Script
const URL_API = "https://script.google.com/macros/s/AKfycbw6O0gHFVn6_TP3YhMXmSoGkIOTEF8jPqzMGnAe4SYoBhDd-159w0xa43X3WGYagG8I/exec";

// Base de dados atualizada exatamente com a sua numeração
const baseDeDados = {
    "1": [{ nome: "Rafaela", vai: "" }, { nome: "Nazaré", vai: "" }, { nome: "Roque", vai: "" }],
    "2": [{ nome: "Raquel", vai: "" }, { nome: "Oliver", vai: "" }],
    "3": [{ nome: "Cristina", vai: "" }, { nome: "Lobo", vai: "" }],
    "4": [{ nome: "Gisele", vai: "" }, { nome: "Valdecir(Lola)", vai: "" }, { nome: "Anna Clara", vai: "" }],
    "5": [{ nome: "Lidiane", vai: "" }, { nome: "Jadir", vai: "" }],
    "6": [{ nome: "Estafany", vai: "" }, { nome: "Namorada", vai: "" }],
    "7": [{ nome: "Denise", vai: "" }],
    "8": [{ nome: "Anna Paula", vai: "" }],
    "9": [{ nome: "Anna Luiza", vai: "" }, { nome: "Lucas", vai: "" }],
    "10": [{ nome: "Vanda", vai: "" }, { nome: "Antonio", vai: "" }, { nome: "Arimar", vai: "" }],
    "11": [{ nome: "Larissa", vai: "" }],
    "12": [{ nome: "Leticia", vai: "" }, { nome: "Gilberto", vai: "" }],
    "13": [{ nome: "Marcia", vai: "" }, { nome: "Lessinho", vai: "" }],
    "14": [{ nome: "Alexsander", vai: "" }, { nome: "Sofia", vai: "" }, { nome: "Maria Emilia", vai: "" }, { nome: "José Antonio", vai: "" }],
    "15": [{ nome: "Eduardo(Dudu)", vai: "" }],
    "16": [{ nome: "Diana", vai: "" }],
    "17": [{ nome: "Monica", vai: "" }, { nome: "Gustavo", vai: "" }],
    "18": [{ nome: "Paulinho", vai: "" }],
    "19": [{ nome: "Naiara", vai: "" }],
    "20": [{ nome: "Elaine", vai: "" }, { nome: "Matheus", vai: "" }],
    "21": [{ nome: "Ariane", vai: "" }],
    "22": [{ nome: "Flávia", vai: "" }, { nome: "Agenor", vai: "" }],
    "23": [{ nome: "Valdirlene", vai: "" }, { nome: "Fabricio", vai: "" }],
    "24": [{ nome: "Thainá", vai: "" }, { nome: "Vitor", vai: "" }, { nome: "Valentina", vai: "" }],
    "25": [{ nome: "Viviane", vai: "" }],
    "26": [{ nome: "Matheus", vai: "" }],
    "27": [{ nome: "Deborá", vai: "" }, { nome: "Everton", vai: "" }, { nome: "Bruno", vai: "" }]
};

const urlParams = new URLSearchParams(window.location.search);
const idConvidado = urlParams.get('c');
const divLoading = document.getElementById('loading');
const divConteudo = document.getElementById('conteudo-convite');
const divSucesso = document.getElementById('mensagem-sucesso');
const listaConvidados = document.getElementById('lista-convidados');
const msgBoasVindas = document.getElementById('mensagem-boas-vindas');

let dadosGrupo = null;
const dataLimite = new Date("2026-09-19T23:59:59");

window.addEventListener('DOMContentLoaded', () => {
    if (!idConvidado || !baseDeDados[idConvidado]) {
        divLoading.innerText = "Convite inválido.";
        return;
    }
    dadosGrupo = baseDeDados[idConvidado];

    if (dadosGrupo.length > 1) {
        msgBoasVindas.innerHTML = `Roquinho e Patrícia convidam vocês para uma noite de churrasco, boa conversa e bons momentos. Esperamos contar com a presença de todos.<br>Ficaremos muito felizes em recebê-los(as) e será uma alegria contar com a companhia de vocês.`;
    } else {
        msgBoasVindas.innerHTML = `Roquinho e Patrícia convidam você para uma noite de churrasco, boa conversa e bons momentos. Esperamos contar com a sua presença.<br>Ficaremos muito felizes em recebê-lo(a) e será uma alegria contar com a sua companhia.`;
    }

    dadosGrupo.forEach((pessoa, index) => {
        const item = document.createElement('div');
        item.className = 'pessoa-item';
        item.innerHTML = `
            <span class="pessoa-nome">${pessoa.nome}</span>
            <div class="pessoa-opcoes">
                <input type="radio" name="vai-${index}" value="SIM" id="sim-${index}" onclick="verificarSelecao()"> <label for="sim-${index}">Irei</label>
                <input type="radio" name="vai-${index}" value="NAO" id="nao-${index}" onclick="verificarSelecao()"> <label for="nao-${index}">Não poderei ir</label>
            </div>
        `;
        listaConvidados.appendChild(item);
    });

    document.getElementById('btn-enviar').disabled = true;
    divLoading.style.display = 'none';
    divConteudo.style.display = 'block';
});

function verificarSelecao() {
    let todosSelecionaram = true;
    dadosGrupo.forEach((_, index) => {
        if (!document.querySelector(`input[name="vai-${index}"]:checked`)) {
            todosSelecionaram = false;
        }
    });
    document.getElementById('btn-enviar').disabled = !todosSelecionaram;
}

// Função auxiliar para juntar nomes bonitinho (ex: "Alexsander e Sofia")
function formatarNomes(nomes) {
    if (nomes.length === 1) return nomes[0];
    if (nomes.length === 2) return `${nomes[0]} e ${nomes[1]}`;
    return nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1];
}

function enviarConfirmacao() {
    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.innerText = "Salvando...";
    btnEnviar.disabled = true;

    let confirmados = [];
    let naoVao = [];

    dadosGrupo.forEach((pessoa, index) => {
        pessoa.vai = document.querySelector(`input[name="vai-${index}"]:checked`).value;
        pessoa.id = idConvidado;
        if (pessoa.vai === "SIM") {
            confirmados.push(pessoa.nome);
        } else {
            naoVao.push(pessoa.nome);
        }
    });

    fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosGrupo)
    });

    const h1Principal = document.querySelector('h1');
    const subtituloPrincipal = document.querySelector('.subtitulo');
    if (h1Principal) h1Principal.style.display = 'none';
    if (subtituloPrincipal) subtituloPrincipal.style.display = 'none';

    divConteudo.style.display = 'none';
    divSucesso.style.display = 'block';

    let htmlResultado = "";

    // Se houver alguém que vai
    if (confirmados.length > 0) {
        let textoNomesSim = formatarNomes(confirmados);
        let textoPresenca = confirmados.length > 1 ? "a presença de vocês" : "a sua presença";

        htmlResultado += `
            <h2>${textoNomesSim}, Obrigado pela sua confirmação!</h2>
            <p>Ficamos felizes em poder contar com ${textoPresenca}.</p>
            <br>
            <p style="font-size: 15px; color: #c5fc57; font-weight: 600;">📍 Localização:</p>
            <p style="margin-bottom: 15px; color: #d5f423;">Rua Senhor dos Passos nº 55 - Vila São José - Curvelo MG</p>
            <br>
            <h2 style="text-align: center;">Observação:</h2>
            <p style="text-align: center;">O churrasco é por nossa conta! Para acompanhar, teremos refrigerante 🥤 e chopp 🍺.<br>Se preferir outra bebida de sua escolha, fique à vontade para trazê-la.</p>
            <br>
            <p style="text-align: center;">Nos vemos em breve!</p>
        `;
    }

    // Se houver alguém que NÃO vai
    if (naoVao.length > 0) {
        if (confirmados.length > 0) {
            htmlResultado += `<hr style="margin: 25px 0; border: 0; border-top: 1px solid #cbd5e0;">`;
        }
        let textoNomesNao = formatarNomes(naoVao);
        let fraseNao = naoVao.length > 1 
            ? `Que pena, ${textoNomesNao}! Vocês não vão poder vir. Esperamos nos ver em uma próxima oportunidade!` 
            : `Que pena, ${textoNomesNao} você não poder vir. Esperamos nos ver em uma próxima oportunidade!`;

        htmlResultado += `
            <h2>Que pena!</h2>
            <p>${fraseNao.replace(/^Que pena, /, '')}</p>
        `;
    }

    divSucesso.innerHTML = htmlResultado;
}