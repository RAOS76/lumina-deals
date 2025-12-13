export const WelcomeEmailTemplate = (email: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; margin-top: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #4f46e5; text-decoration: none; }
        .hero { text-align: center; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
        .text { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .button { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 99px; text-decoration: none; font-weight: bold; font-size: 16px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://luminaofertas.com" class="logo">✨ LUMINA</a>
        </div>
        
        <div class="hero">
            <h1 class="title">¡Bienvenido al Club! 🚀</h1>
            <p class="text">
                Hola,
                <br><br>
                Gracias por unirte a <strong>Lumina Ofertas</strong>. Acabas de dar el primer paso para dejar de buscar y empezar a encontrar.
                <br><br>
                Nuestra IA ya está rastreando miles de productos para encontrar esas "joyas ocultas" que realmente valen la pena.
                <br><br>
                <strong>¿Qué puedes esperar?</strong>
                <br>
                • Las 5 mejores ofertas de la semana (sin spam).
                <br>
                • Análisis honestos de calidad/precio.
                <br>
                • Alertas de mínimos históricos.
            </p>
            
            <a href="https://luminaofertas.com" class="button">Ver Ofertas de Hoy</a>
        </div>

        <div class="footer">
            <p>Has recibido este correo porque te suscribiste a Lumina Ofertas.</p>
            <p>© ${new Date().getFullYear()} Lumina. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
`;
