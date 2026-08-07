// URL do seu Web App do Google Apps Script (para salvar na planilha)
const URL_API = "https://script.google.com/macros/s/AKfycbw6O0gHFVn6_TP3YhMXmSoGkIOTEF8jPqzMGnAe4SYoBhDd-159w0xa43X3WGYagG8I/exec";

// Base de dados dos grupos extraída diretamente da sua planilha
const baseDeDados = {
    "1": [
        { nome: "Rafaela", parentesco: "Filha", vai: "" },
        { nome: "Nazaré", parentesco: "Esposa", vai: "" },
        { nome: "Roque", parentesco: "Esposo", vai: "" }
    ],
    "2": [
        { nome: "Raquel", parentesco: "Esposa", vai: "" },
        { nome: "Oliver", parentesco: "Esposo", vai: "" }
    ],
    "3": [
        { nome: "Cristina", parentesco: "Esposa", vai: "" },
        { nome: "Lobo", parentesco: "Esposo", vai: "" }
    ],
    "4": [
        { nome: "Gisele", parentesco: "Esposa", vai: "" },
        { nome: "Valdecir(Lola)", parentesco: "Esposo", vai: "" },
        { nome: "Anna Clara", parentesco: "Filha", vai: "" }
    ],
    "5": [
        { nome: "Lidiane", parentesco: "Esposa", vai: "" },
        { nome: "Jadir", parentesco: "Esposo", vai: "" },
        { nome: "Estafany", parentesco: "Filha", vai: "" }
    ],
    "6": [
        { nome: "Denise", parentesco: "Mãe", vai: "" },
        { nome: "Anna Paula", parentesco: "Filha", vai: "" },
        { nome: "Anna Luiza", parentesco: "Filha", vai: "" },
        { nome: "Lucas", parentesco: "Namorado", vai: "" }
    ],
    "7": [
        { nome: "Arimar", parentesco: "Filho", vai: "" },
        { nome: "Vanda", parentesco: "Esposa", vai: "" },
        { nome: "Antonio", parentesco: "Esposo", vai: "" }
    ],
    "8": [
        { nome: "Larissa", parentesco: "Irmãs", vai: "" },
        { nome: "Leticia", parentesco: "Esposa", vai: "" },
        { nome: "Gilberto", parentesco: "Esposo", vai: "" }
    ],
    "9": [
        { nome: "Marcia", parentesco: "Esposa", vai: "" },
        { nome: "Lessinho", parentesco: "Esposo", vai: "" }
    ],
    "10": [
        { nome: "Alexsander", parentesco: "Filho", vai: "" },
        { nome: "Sofia", parentesco: "Filha", vai: "" },
        { nome: "Maria Emilia", parentesco: "Mãe", vai: "" },
        { nome: "José Antonio", parentesco: "Esposo", vai: "" }
    ],
    "11": [
        { nome: "Eduardo(Dudu)", parentesco: "Esposo", vai: "" },
        { nome: "Diana", parentesco: "Esposa", vai: "" }
    ],
    "12": [
        { nome: "Monica", parentesco: "Mãe", vai: "" },
        { nome: "Gustavo", parentesco: "Filho", vai: "" }
    ],
    "13": [{ nome: "Paulinho", parentesco: "", vai: "" }],
    "14": [{ nome: "Naiara", parentesco: "", vai: "" }],
    "15": [
        { nome: "Elaine", parentesco: "Namorados", vai: "" },
        { nome: "Matheus", parentesco: "Namorados", vai: "" }
    ],
    "16": [{ nome: "Ariane", parentesco: "", vai: "" }],
    "17": [
        { nome: "Flávia", parentesco: "Esposa", vai: "" },
        { nome: "Agenor", parentesco: "Esposo", vai: "" }
    ],
    "18": [
        { nome: "Valdirlene", parentesco: "Esposa", vai: "" },
        { nome: "Fabricio", parentesco: "Esposo", vai: "" }
    ],
    "19": [
        { nome: "Thainá", parentesco: "Esposa", vai: "" },
        { nome: "Vitor", parentesco: "Esposo", vai: "" },
        { nome: "Valentina", parentesco: "Filha", vai: "" }
    ],
    "20": [{ nome: "Viviane", parentesco: "", vai: "" }],
    "21": [{ nome: "Matheus", parentesco: "", vai: "" }],
    "22": [
        { nome: "Deborá", parentesco: "Esposa", vai: "" },
        { nome: "Everton", parentesco: "Esposo", vai: "" },
        { nome: "Bruno", parentesco: "Filho", vai: "" }
    ]
};

// Pega o parâmetro 'c' da URL (ex: ?c=10)
const urlParams = new URLSearchParams(window.location.search);
const idConvidado = urlParams.get('c');

const divLoading = document.getElementById('loading');
const divConteudo = document.getElementById('conteudo-convite');
const divSucesso = document.getElementById('mensagem-sucesso');
const listaConvidados = document.getElementById('lista-convidados');
const msgBoasVindas = document.getElementById('mensagem-boas-vindas');

let dadosGrupo = null;
const dataLimite = new Date("2026-09-18T23:59:59");
const hoje = new Date();

window.addEventListener('DOMContentLoaded', () => {
    if (!idConvidado || !baseDeDados[idConvidado]) {
        divLoading.innerText = "Convite inválido ou link incompleto.";
        divLoading.style.color = "#e74c3c";
        return;
    }

    dadosGrupo = baseDeDados[idConvidado];

    // 1. Verificar se passou do prazo (18/09/2026)
    if (hoje > dataLimite) {
        divLoading.style.display = 'none';
        divSucesso.style.display = 'block';
        divSucesso.innerHTML = `
            <h2>Confirmação encerrada</h2>
            <p>O prazo para confirmação de presença foi encerrado em 18/09/2026.</p>
            <p>Caso precise falar conosco, entre em contato diretamente.</p>
        `;
        return;
    }

    // Texto da mensagem principal
    msgBoasVindas.innerHTML = `Vamos nos reunir para uma noite de churrasco, boa conversa e bons momentos. Esperamos contar com você.<br><br>Ficaremos muito felizes em recebê-lo(a) e esperamos que possa estar conosco.`;

    // Montar os itens sem exibir o parentesco
    dadosGrupo.forEach((pessoa, index) => {
        const item = document.createElement('div');
        item.className = 'pessoa-item';

        item.innerHTML = `
            <span class="pessoa-nome">${pessoa.nome}</span>
            <div class="pessoa-opcoes">
                <select id="vai-${index}">
                    <option value="SIM">Irei Comparecer</option>
                    <option value="NAO">Não poderei comparecer</option>
                </select>
            </div>
        `;
        listaConvidados.appendChild(item);
    });

    divLoading.style.display = 'none';
    divConteudo.style.display = 'block';
});

function enviarConfirmacao() {
    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.innerText = "Salvando...";
    btnEnviar.disabled = true;

    let algumVai = false;

    dadosGrupo.forEach((pessoa, index) => {
        const select = document.getElementById(`vai-${index}`);
        pessoa.vai = select.value;
        pessoa.id = idConvidado;
        if (pessoa.vai === "SIM") {
            algumVai = true;
        }
    });

    // Enviar dados em segundo plano para a planilha
    fetch(URL_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosGrupo)
    }).catch(err => console.log(err));

    // Esconde o cabeçalho principal ("Reserve esta data" e data/hora) ao mudar para a tela de sucesso
    const h1Principal = document.querySelector('h1');
    const subtituloPrincipal = document.querySelector('.subtitulo');
    if (h1Principal) h1Principal.style.display = 'none';
    if (subtituloPrincipal) subtituloPrincipal.style.display = 'none';

    // Exibir a tela final de acordo com a escolha
    divConteudo.style.display = 'none';
    divSucesso.style.display = 'block';

    if (algumVai) {
        divSucesso.innerHTML = `
            <h2>Obrigado pela sua confirmação!</h2>
            <p>Ficamos felizes em poder contar com a presença de vocês.</p>
            <br>
            <p style="font-size: 15px; color: #2c3e50; font-weight: 600;">📍 Localização:</p>
            <p style="margin-bottom: 15px; color: #4a5568;">Rua Senhor dos Passos nº 55 - Vila São José - Curvelo MG</p>
            <br>
            <p>🍺 <strong>Aviso importante:</strong> Para este momento teremos Refrigerante e como bebida alcoólica <strong>Chopp</strong>. Caso prefira outra bebida de sua preferência, fique à vontade para trazer.</p>
            <br>
            <p>Nos vemos em breve!</p>
        `;
    } else {
        divSucesso.innerHTML = `
            <h2>Obrigado por nos informar.</h2>
            <p>Sua resposta foi registrada com sucesso.</p>
            <p>Esperamos encontrá-los em outra oportunidade.</p>
        `;
    }
}