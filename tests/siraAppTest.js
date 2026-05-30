const { Builder, By, until } = require('selenium-webdriver');

async function testSiraLogin() {
    // 1. Inicializa el navegador Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 2. Abre la URL local donde corre tu proyecto de React
        await driver.get('http://localhost:3000'); // Cambia el puerto si usas Vite (ej. 5173)

        // Maximizar ventana
        await driver.manage().window().maximize();

        // 3. Localizar los elementos del DOM (React) e ingresar credenciales
        // NOTA: Asegúrate de que tus inputs en React tengan estos nombres en el atributo 'id' o 'name'
        await driver.findElement(By.id('inputUsuario')).sendKeys('usuario_sira');
        await driver.findElement(By.id('inputContrasena')).sendKeys('Password123');

        // 4. Hacer clic en el botón de iniciar sesión
        await driver.findElement(By.id('btnIniciarSesion')).click();

        // 5. Esperar hasta 5 segundos a que cargue el componente de bienvenida (Dashboard)
        let lblBienvenida = await driver.wait(
            until.elementLocated(By.id('tituloBienvenida')), 
            5000
        );

        // 6. Validar que el texto sea el correcto
        let textoObtenido = await lblBienvenida.getText();
        if (textoObtenido === 'Bienvenido al Sistema SIRA') {
            console.log('--- TEST RESULT: PASÓ (SUCCESS) ---');
        } else {
            console.log('--- TEST RESULT: FALLÓ (Resultado inesperado) ---');
        }

    } catch (error) {
        console.error('Ocurrió un error durante la prueba automatizada:', error);
    } finally {
        // 7. Cerrar el navegador de forma segura
        await driver.quit();
    }
}

// Ejecutar la función de prueba
testSiraLogin();