function getResendPasswordTemplate(name: string, newPassword: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reenvio de Senha - Finanbank</title>
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
                <h1>Reenvio de Senha</h1>
            </div>
            <div class="content">
                <p>Olá, <strong>${name}</strong>,</p>
                <p>Conforme solicitado, aqui está a sua nova senha de acesso ao sistema SAP da Finanbank:</p>
                <p>Sua nova senha é: <span class="password">${newPassword}</span></p>
                <p>Recomendamos que você altere essa senha após o primeiro login para garantir a segurança da sua conta.</p>
                <p>Se você não solicitou essa alteração, por favor, entre em contato imediatamente com o nosso suporte.</p>
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

export default getResendPasswordTemplate;
