const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

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
        console.log('🔍 Tentando capturar M3U8 de:', canalUrl);
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.band.com.br/',
            'DNT': '1'
        };

        const response = await axios.get(canalUrl, { 
            headers,
            timeout: 15000,
            maxRedirects: 5
        });

        const html = response.data;
        
        // Buscar links M3U8
        const m3u8Regex = /(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/gi;
        let matches = html.match(m3u8Regex);
        
        if (matches && matches.length > 0) {
            console.log(`✅ M3U8 encontrado:`, matches[0]);
            return matches[0];
        }

        // Buscar dentro de tags <script>
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        let scriptMatch;
        
        while ((scriptMatch = scriptRegex.exec(html)) !== null) {
            const scriptContent = scriptMatch[1];
            const m3u8InScript = scriptContent.match(m3u8Regex);
            
            if (m3u8InScript && m3u8InScript.length > 0) {
                console.log(`✅ M3U8 encontrado no script:`, m3u8InScript[0]);
                return m3u8InScript[0];
            }
        }

        console.log('❌ Nenhum M3U8 encontrado');
        return null;

    } catch (error) {
        console.error('❌ Erro ao capturar M3U8:', error.message);
        return null;
    }
}

// Página principal
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
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #fff;
            min-height: 100vh;
            padding-bottom: 60px;
        }

        .header {
            background: #000;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #FFD100;
            box-shadow: 0 2px 10px rgba(255, 209, 0, 0.3);
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
            background: #FFD100;
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
            color: #FFD100;
            text-shadow: 0 0 10px rgba(255, 209, 0, 0.5);
        }

        .btn-m3u {
            background: #FFD100;
            color: #000;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 209, 0, 0.3);
        }

        .btn-m3u:hover {
            background: #FFC700;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 209, 0, 0.5);
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
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid #333;
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #FFD100 0%, #FFC700 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            border-color: #FFD100;
            box-shadow: 0 10px 30px rgba(255, 209, 0, 0.3);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card-logo {
            text-align: center;
            margin-bottom: 15px;
        }

        .card-logo img {
            width: 120px;
            height: auto;
            filter: drop-shadow(0 2px 5px rgba(255, 209, 0, 0.3));
        }

        .card-title {
            font-size: 20px;
            font-weight: bold;
            color: #FFD100;
            text-align: center;
            margin-bottom: 12px;
            text-shadow: 0 2px 5px rgba(255, 209, 0, 0.3);
        }

        .online-count {
            color: #4ade80;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        .online-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }

        .btn-assistir {
            width: 100%;
            background: linear-gradient(135deg, #FFD100 0%, #FFC700 100%);
            color: #000;
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
            box-shadow: 0 4px 15px rgba(255, 209, 0, 0.3);
        }

        .btn-assistir:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(255, 209, 0, 0.5);
            background: linear-gradient(135deg, #FFC700 0%, #FFB700 100%);
        }

        .btn-copiar {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            color: #FFD100;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 209, 0, 0.3);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-copiar:hover {
            background: rgba(255, 209, 0, 0.2);
            border-color: #FFD100;
        }

        .btn-debug {
            width: 100%;
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #3b82f6;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
        }

        .btn-debug:hover {
            background: rgba(59, 130, 246, 0.3);
        }

        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #FFD100;
            color: #000;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: bold;
            display: none;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(255, 209, 0, 0.4);
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .header {
                flex-direction: column;
                gap: 10px;
            }

            .card-logo img {
                width: 100px;
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
        <a href="/baixar-m3u" class="btn-m3u">📥 BAIXAR M3U</a>
    </div>

    <div class="container">
        <div class="grid">
            ${canais.map((canal, index) => `
            <div class="card">
                <div class="card-logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Band_Marca.png" alt="Band Logo">
                </div>
                <div class="card-title">${canal.nome}</div>
                <div class="online-count">
                    <span class="online-dot"></span>
                    <span id="count-${index}">0 ON</span>
                </div>
                <a href="/stream/${index}" target="_blank" class="btn-assistir">▶️ ASSISTIR</a>
                <button onclick="copiarLink('http://${host}/stream/${index}')" class="btn-copiar">
                    📋 COPIAR LINK
                </button>
                <button onclick="debugStream(${index})" class="btn-debug">
                    🔍 DEBUG
                </button>
            </div>
            `).join('')}
        </div>
    </div>

    <div id="toast" class="toast">✓ Link copiado!</div>

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
                mostrarToast('✓ Link copiado com sucesso!');
            } catch (err) {
                alert('Erro ao copiar: ' + err);
            }
            
            document.body.removeChild(textArea);
        }

        async function debugStream(index) {
            try {
                mostrarToast('🔍 Buscando informações...');
                const response = await fetch('/debug/' + index);
                const data = await response.json();
                
                alert('🔍 DEBUG INFO\\n\\n' + 
                    '📡 Canal: ' + data.canal + '\\n' +
                    '✅ Status: ' + data.status + '\\n' +
                    '🔗 M3U8: ' + (data.m3u8 ? 'ENCONTRADO' : 'NÃO ENCONTRADO') + '\\n' +
                    (data.m3u8 ? '\\n📎 Link: ' + data.m3u8.substring(0, 100) + '...\\n' : '') +
                    '\\n📝 ' + data.details
                );
            } catch (e) {
                alert('❌ Erro no debug: ' + e.message);
            }
        }

        function mostrarToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2500);
        }

        // Atualiza contadores
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

// Endpoint de DEBUG
app.get('/debug/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    const canal = canais[index];
    
    if (!canal) {
        return res.json({ status: 'error', details: 'Canal não encontrado' });
    }

    try {
        const m3u8Link = await capturarM3U8(canal.url);
        
        res.json({
            status: m3u8Link ? 'success' : 'not_found',
            m3u8: m3u8Link,
            canal: canal.nome,
            url: canal.url,
            details: m3u8Link ? 'M3U8 capturado com sucesso!' : 'M3U8 não encontrado. O site pode ter mudado a estrutura.'
        });
    } catch (error) {
        res.json({
            status: 'error',
            canal: canal.nome,
            details: 'Erro: ' + error.message
        });
    }
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
        
        if (!m3u8Link || (Date.now() - m3u8Cache[index + '_time'] > 1800000)) {
            m3u8Link = await capturarM3U8(canal.url);
            if (m3u8Link) {
                m3u8Cache[index] = m3u8Link;
                m3u8Cache[index + '_time'] = Date.now();
            }
        }

        if (!m3u8Link) {
            return res.status(503).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Stream Indisponível</title>
                    <style>
                        body { font-family: Arial; text-align: center; padding: 50px; background: #1a1a1a; color: #fff; }
                        h1 { color: #FFD100; }
                        button { background: #FFD100; color: #000; padding: 15px 30px; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; margin-top: 20px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>⚠️ Stream Temporariamente Indisponível</h1>
                    <p>Não foi possível capturar o link M3U8 do canal <strong>${canal.nome}</strong>.</p>
                    <button onclick="history.back()">⬅️ Voltar</button>
                </body>
                </html>
            `);
        }

        res.redirect(m3u8Link);

    } catch (error) {
        res.status(500).send('Erro: ' + error.message);
    } finally {
        setTimeout(() => {
            if (usuariosOnline[index] > 0) usuariosOnline[index]--;
        }, 5000);
    }
});

// Stats
app.get('/stats', (req, res) => {
    res.json(usuariosOnline);
});

// Baixar M3U
app.get('/baixar-m3u', (req, res) => {
    const host = req.headers.host;
    let m3u = '#EXTM3U\n';
    
    canais.forEach((canal, index) => {
        m3u += `#EXTINF:-1 tvg-id="" tvg-name="${canal.nome}" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/4/4d/Band_Marca.png" group-title="Band TV",${canal.nome}\n`;
        m3u += `http://${host}/stream/${index}\n`;
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=band_tv.m3u');
    res.send(m3u);
});

app.listen(PORT, () => {
    console.log(`🚀 UNIBOX Band Plus rodando na porta ${PORT}`);
    console.log(`📺 Acesse: http://localhost:${PORT}`);
});
