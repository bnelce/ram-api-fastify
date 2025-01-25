function createUserTemplate(name: string, password: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao SAP da Finanbank</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #004080;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                color: #ffffff;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                font-size: 16px;
                color: #333333;
                line-height: 1.5;
            }
            .content .password {
                font-weight: bold;
                color: #004080;
            }
            .content .link {
                display: inline-block;
                margin-top: 10px;
                padding: 10px 20px;
                background-color: #004080;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
            }
            .footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #777777;
                background-color: #f4f4f4;
                border-radius: 0 0 8px 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Bem-vindo ao SAP da Finanbank</h1>
            </div>
            <div class="content">
                <p>Olá, <strong>${name}</strong>,</p>
                <p>Sua conta no sistema SAP da Finanbank foi criada com sucesso. Aqui estão suas credenciais de acesso:</p>
                <p>Senha temporária: <span class="password">${password}</span></p>
                <p>Você pode acessar o sistema através do link abaixo:</p>
                <p><a href="https://sap.finanbankbr.com.br" class="link">Acessar o SAP da Finanbank</a></p>
                <p>Recomendamos que você altere essa senha após o primeiro login para garantir a segurança da sua conta.</p>
                <p>Se você tiver qualquer dúvida ou precisar de ajuda, por favor, entre em contato com o suporte.</p>
                <p>Atenciosamente,<br/>Equipe Finanbank</p>
            </div>
            <div class="footer">
                <p>Este é um email automático, por favor, não responda a este endereço. Em caso de dúvidas, entre em contato com o suporte da Finanbank.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export default createUserTemplate;
