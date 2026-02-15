const express = require('express');
const axios = require('axios');
const { Octokit } = require('@octokit/rest');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações do GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Lista de canais da Band por região
const canais = [
    { nome: 'Band SP', id: 'band-sp', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band News', id: 'band-news', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band Rio', id: 'band-rio', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band Minas', id: 'band-minas', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band RS', id: 'band-rs', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band Bahia', id: 'band-bahia', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band Paraná', id: 'band-parana', url: 'https://www.band.com.br/ao-vivo' },
    { nome: 'Band Brasília', id: 'band-brasilia', url: 'https://www.band.com.br/ao-vivo' }
];

let usuariosOnline = {};
let m3u8Cache = {};

// Função para extrair M3U8 da Band
async function capturarM3U8(canalUrl) {
    try {
        const response = await axios.get(canalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        const m3u8Regex = /(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/gi;
        const matches = html.match(m3u8Regex);
        
        if (matches && matches.length > 0) {
            return matches[0];
        }

        return null;
    } catch (error) {
        console.error('Erro ao capturar M3U8:', error.message);
        return null;
    }
}

// Página principal com visual UNIBOX RecordPlus
app.get('/', (req, res) => {
    const host = req.headers.host;
    
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UNIBOX - Band Plus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #1a0033 0%, #330066 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #fff;
            min-height: 100vh;
            padding-bottom: 60px;
        }

        .header {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: bold;
        }

        .logo-icon {
            width: 35px;
            height: 35px;
            background: #fff;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .logo-text {
            color: #fff;
        }

        .logo-text span {
            color: #d946ef;
        }

        .btn-m3u {
            background: #10b981;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            border: none;
            cursor: pointer;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            border-color: #d946ef;
            box-shadow: 0 10px 30px rgba(217, 70, 239, 0.3);
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .status-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .card-title {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            flex: 1;
        }

        .online-count {
            color: #10b981;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .online-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .btn-assistir {
            width: 100%;
            background: linear-gradient(135deg, #d946ef 0%, #c026d3 100%);
            color: #fff;
            padding: 14px;
            border-radius: 10px;
            border: none;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: block;
            text-align: center;
        }

        .btn-assistir:hover {
            transform: scale(1.02);
            box-shadow: 0 5px 20px rgba(217, 70, 239, 0.4);
        }

        .btn-copiar {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-copiar:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: #fff;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: bold;
            display: none;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .header {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <div class="logo-icon">📺</div>
            <div class="logo-text">UNIBOX <span>BAND PLUS</span></div>
        </div>
        <a href="/baixar-m3u" class="btn-m3u">M3U</a>
    </div>

    <div class="container">
        <div class="grid">
            ${canais.map((canal, index) => `
            <div class="card">
                <div class="card-header">
                    <div class="status-icon">📡</div>
                    <div class="card-title">${canal.nome}</div>
                </div>
                <div class="online-count">
                    <span class="online-dot"></span>
                    <span id="count-${index}">0 ON</span>
                </div>
                <a href="/stream/${index}" target="_blank" class="btn-assistir">ASSISTIR</a>
                <button onclick="copiarLink('http://${host}/stream/${index}')" class="btn-copiar">
                    COPIAR LINK
                </button>
            </div>
            `).join('')}
        </div>
    </div>

    <div id="toast" class="toast">Link copiado com sucesso! ✓</div>

    <script>
        function copiarLink(link) {
            const textArea = document.createElement('textarea');
            textArea.value = link;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                mostrarToast();
            } catch (err) {
                alert('Erro ao copiar: ' + err);
            }
            
            document.body.removeChild(textArea);
        }

        function mostrarToast() {
            const toast = document.getElementById('toast');
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2000);
        }

        // Atualiza contadores de usuários online
        setInterval(async () => {
            try {
                const response = await fetch('/stats');
                const stats = await response.json();
                
                Object.keys(stats).forEach(index => {
                    const elem = document.getElementById('count-' + index);
                    if (elem) {
                        elem.textContent = stats[index] + ' ON';
                    }
                });
            } catch (e) {}
        }, 3000);
    </script>
</body>
</html>
    `);
});

// Endpoint de stream
app.get('/stream/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    const canal = canais[index];
    
    if (!canal) {
        return res.status(404).send('Canal não encontrado');
    }

    usuariosOnline[index] = (usuariosOnline[index] || 0) + 1;

    try {
        let m3u8Link = m3u8Cache[index];
        
        // Se não tem cache ou está muito antigo (30min)
        if (!m3u8Link || (Date.now() - m3u8Cache[index + '_time'] > 1800000)) {
            m3u8Link = await capturarM3U8(canal.url);
            if (m3u8Link) {
                m3u8Cache[index] = m3u8Link;
                m3u8Cache[index + '_time'] = Date.now();
            }
        }

        if (!m3u8Link) {
            return res.status(503).send('Stream temporariamente indisponível');
        }

        // Redireciona para o M3U8
        res.redirect(m3u8Link);

    } catch (error) {
        res.status(500).send('Erro ao processar stream');
    } finally {
        setTimeout(() => {
            if (usuariosOnline[index] > 0) usuariosOnline[index]--;
        }, 5000);
    }
});

// Stats de usuários online
app.get('/stats', (req, res) => {
    res.json(usuariosOnline);
});

// Baixar lista M3U
app.get('/baixar-m3u', (req, res) => {
    const host = req.headers.host;
    let m3u = '#EXTM3U\n';
    
    canais.forEach((canal, index) => {
        m3u = `#EXTINF:-1 tvg-id="" tvg-name="${canal.nome}" group-title="Band TV",${canal.nome}\n`;
        m3u += `http://${host}/stream/${index}\n`;
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=band_tv.m3u');
    res.send(m3u);
});

app.listen(PORT, () => {
    console.log(`🚀 UNIBOX Band Plus rodando na porta ${PORT}`);
});
