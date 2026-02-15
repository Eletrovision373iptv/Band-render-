const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Links M3U8 reais capturados manualmente
const canais = [
    { 
        nome: 'Band SP', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/019498af-1fdf-7df5-86bd-e4a6f588d6a7/s1/playlist-360p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTQ5OGFmLTFmZGYtN2RmNS04NmJkLWU0YTZmNTg4ZDZhNy8iLCJ1aWQiOiI3MzQxN2M5MC1jYjBhLTRmMTItYmNhYi1mN2JjZjM1MWI1NjIiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTUwNiwiaWF0IjoxNzcxMDA5NTA2LCJleHAiOjE4MDI1NDU1MDYsImp0aSI6IjczNDE3YzkwLWNiMGEtNGYxMi1iY2FiLWY3YmNmMzUxYjU2MiIsImlzcyI6IlNwYWxsYSJ9.o2Ol9F5-5EL2e6IQhBjEjB8UKbF68csalpB7i-Qx69w&uid=73417c90-cb0a-4f12-bcab-f7bcf351b562&magica=sim'
    },
    { 
        nome: 'Band Campinas', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0197a7cd-ca64-7087-a66b-1d4482670af5/s1/playlist-1080p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTdhN2NkLWNhNjQtNzA4Ny1hNjZiLTFkNDQ4MjY3MGFmNS8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTUyMCwiaWF0IjoxNzcxMDA5NTIwLCJleHAiOjE4MDI1NDU1MjAsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.AqEnTAqKCQs5qG_NSAj-HerSutyVWJW6iBmM5ERirF0&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    },
    { 
        nome: 'Band Vale', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0197ad59-3361-7900-9b7b-ce5c34cdab47/s1/playlist-360p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTdhZDU5LTMzNjEtNzkwMC05YjdiLWNlNWMzNGNkYWI0Ny8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTUyOCwiaWF0IjoxNzcxMDA5NTI4LCJleHAiOjE4MDI1NDU1MjgsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.kzjkn2kg_mZTnv6jxgrYj3ARLS8E8bCmz3iGQkLu-wA&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    },
    { 
        nome: 'Band RN', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0197a39b-ee99-7b8a-9364-54800d7ed371/s1/playlist-1080p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTdhMzliLWVlOTktN2I4YS05MzY0LTU0ODAwZDdlZDM3MS8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTUzMSwiaWF0IjoxNzcxMDA5NTMxLCJleHAiOjE4MDI1NDU1MzEsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.u47P8Js789xytyKebTBQ6dUyskiJruXv4ibmEA2pFC8&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    },
    { 
        nome: 'Band Rio', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0194f211-4229-749f-a47e-58f819471024/s1/playlist_nova-a.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTRmMjExLTQyMjktNzQ5Zi1hNDdlLTU4ZjgxOTQ3MTAyNC8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTUzNywiaWF0IjoxNzcxMDA5NTM3LCJleHAiOjE4MDI1NDU1MzcsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.NjtRbzLGNmeoZ5h6vMBCcsHaKJtmKUzvxkOII3MjXx4&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    },
    { 
        nome: 'Band Minas', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0195cdf3-d8d8-74b6-9516-6c79c06bcec8/s1/playlist-1080p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTVjZGYzLWQ4ZDgtNzRiNi05NTE2LTZjNzljMDZiY2VjOC8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU0MCwiaWF0IjoxNzcxMDA5NTQwLCJleHAiOjE4MDI1NDU1NDAsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.sfTa7PNEp-UdOYHRx5ms7nXwGlIypC45kz-R0ajhwZ4&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    },
    { 
        nome: 'Band Brasília', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0195ed65-6002-7fe1-9037-745645406075/s1/playlist_nova-a.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTVlZDY1LTYwMDItN2ZlMS05MDM3LTc0NTY0NTQwNjA3NS8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU0NiwiaWF0IjoxNzcxMDA5NTQ2LCJleHAiOjE4MDI1NDU1NDYsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.WNWVfPm2AiwiJ1FmT_ziSmmwCriGBK7nkgC6oaZjeQg&uid=b0144fab-44c0-4197-a401-da25f6a4913a'
    },
    { 
        nome: 'Band Paulista', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0195d367-739b-7ac1-93b4-da5f84c96efc/s1/playlist-1080p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTVkMzY3LTczOWItN2FjMS05M2I0LWRhNWY4NGM5NmVmYy8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU0OCwiaWF0IjoxNzcxMDA5NTQ4LCJleHAiOjE4MDI1NDU1NDgsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.bO0uzu8bgN_qj34uyhHrugWYWzn2CKv3Dlq9NhIigSc&uid=b0144fab-44c0-4197-a401-da25f6a4913a'
    },
    { 
        nome: 'Band Bahia', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0196ff1e-8bbc-76d9-bcda-cfe58c2b0be6/s1/playlist_nova-a.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTZmZjFlLThiYmMtNzZkOS1iY2RhLWNmZTU4YzJiMGJlNi8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU1NywiaWF0IjoxNzcxMDA5NTU3LCJleHAiOjE4MDI1NDU1NTcsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.GJcrcmwD7zRtQkXiFx7VmspxeBRkMEnkgrjSaVTLa7w&uid=b0144fab-44c0-4197-a401-da25f6a4913a'
    },
    { 
        nome: 'Band Paraná', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/0195d36a-f948-71a4-bf7c-da6c3f84afb1/s1/playlist-720p.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTVkMzZhLWY5NDgtNzFhNC1iZjdjLWRhNmMzZjg0YWZiMS8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU2MCwiaWF0IjoxNzcxMDA5NTYwLCJleHAiOjE4MDI1NDU1NjAsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.OfaFFc0_7Xqcv9hoymB9XqIAxpEaFbYFK65vnHYFMwI&uid=b0144fab-44c0-4197-a401-da25f6a4913a'
    },
    { 
        nome: 'Band RS', 
        m3u8: 'https://hqf6tcxuhk.singularcdn.net.br/live/01995331-340e-7730-9dc8-ddcbf32b45a1/s1/playlist_nova-a.m3u8?sjwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmlfc3ViIjoiLzAxOTk1MzMxLTM0MGUtNzczMC05ZGM4LWRkY2JmMzJiNDVhMS8iLCJ1aWQiOiJiMDE0NGZhYi00NGMwLTQxOTctYTQwMS1kYTI1ZjZhNDkxM2EiLCJyYXUiOm51bGwsImJleSI6ZmFsc2UsImlpcCI6ZmFsc2UsIm5iZiI6MTc3MTAwOTU3MywiaWF0IjoxNzcxMDA5NTczLCJleHAiOjE4MDI1NDU1NzMsImp0aSI6ImIwMTQ0ZmFiLTQ0YzAtNDE5Ny1hNDAxLWRhMjVmNmE0OTEzYSIsImlzcyI6IlNwYWxsYSJ9.YzSeYaNbDIhDGP3df-jtSZ8wCVzBQFzBf_L4RZqpOiM&uid=b0144fab-44c0-4197-a401-da25f6a4913a&magica=sim'
    }
];

let usuariosOnline = {};

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

        .logo-text { color: #fff; }
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
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

        .card:hover::before { opacity: 1; }

        .card-logo {
            text-align: center;
            margin-bottom: 15px;
        }

        .card-logo img {
            width: 100px;
            height: auto;
            filter: drop-shadow(0 2px 5px rgba(255, 209, 0, 0.3));
        }

        .card-title {
            font-size: 18px;
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
            .grid { grid-template-columns: 1fr; }
            .header { flex-direction: column; gap: 10px; }
            .card-logo img { width: 80px; }
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

        function mostrarToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2500);
        }

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

// Stream endpoint
app.get('/stream/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const canal = canais[index];
    
    if (!canal) {
        return res.status(404).send('Canal não encontrado');
    }

    usuariosOnline[index] = (usuariosOnline[index] || 0) + 1;

    setTimeout(() => {
        if (usuariosOnline[index] > 0) usuariosOnline[index]--;
    }, 5000);

    // Redireciona direto para o M3U8
    res.redirect(canal.m3u8);
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
