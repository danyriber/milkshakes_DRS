<?php
// contacto.php - Formulario de contacto dinámico
session_start();

$mensaje_confirmacion = "";
$errores = array();

// Procesar formulario POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $asunto = isset($_POST['asunto']) ? trim($_POST['asunto']) : '';
    $mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';
    
    // Validaciones
    if (empty($nombre)) {
        $errores[] = "El nombre es requerido";
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "El email es requerido y debe ser válido";
    }
    if (empty($asunto)) {
        $errores[] = "El asunto es requerido";
    }
    if (empty($mensaje) || strlen($mensaje) < 10) {
        $errores[] = "El mensaje debe tener al menos 10 caracteres";
    }
    
    // Si no hay errores, procesar envío
    if (count($errores) === 0) {
        // Simular envío de email (en producción usar mail() o servicio de email)
        $mensaje_confirmacion = "¡Gracias por tu mensaje! Nos pondremos en contacto pronto.";
        
        // Registrar en log (simulado)
        $log_data = array(
            'timestamp' => date('Y-m-d H:i:s'),
            'nombre' => $nombre,
            'email' => $email,
            'telefono' => $telefono,
            'asunto' => $asunto,
            'mensaje' => $mensaje,
            'ip' => $_SERVER['REMOTE_ADDR']
        );
        
        // Guardar en archivo de log (si tiene permisos)
        $log_file = 'logs/contactos.log';
        if (!is_dir('logs')) {
            mkdir('logs', 0755, true);
        }
        // file_put_contents($log_file, json_encode($log_data) . PHP_EOL, FILE_APPEND);
        
        // Limpiar formulario
        $nombre = $email = $telefono = $asunto = $mensaje = '';
    }
}

$titulo_pagina = "Contacto - Milkshakes DRS";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $titulo_pagina; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="logo">
                <h1>🥤 Milkshakes DRS</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.php">Inicio</a></li>
                    <li><a href="productos.php">Catálogo</a></li>
                    <li><a href="carrito.php">Carrito (<?php echo isset($_SESSION['carrito']) ? count($_SESSION['carrito']) : 0; ?>)</a></li>
                    <li><a href="contacto.php" class="active">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Contenido Principal -->
    <section class="contact-section">
        <div class="container">
            <h2>Contacto</h2>
            <p class="intro">¿Tienes preguntas o sugerencias? Nos encantaría escucharte.</p>

            <div class="contact-content">
                <div class="contact-form-wrapper">
                    <?php if (!empty($mensaje_confirmacion)): ?>
                        <div class="alert alert-success">
                            <?php echo htmlspecialchars($mensaje_confirmacion); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (count($errores) > 0): ?>
                        <div class="alert alert-error">
                            <ul>
                                <?php foreach ($errores as $error): ?>
                                    <li><?php echo htmlspecialchars($error); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>

                    <form method="POST" class="contact-form">
                        <div class="form-group">
                            <label for="nombre">Nombre Completo *</label>
                            <input type="text" id="nombre" name="nombre" value="<?php echo isset($nombre) ? htmlspecialchars($nombre) : ''; ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono" value="<?php echo isset($telefono) ? htmlspecialchars($telefono) : ''; ?>">
                        </div>

                        <div class="form-group">
                            <label for="asunto">Asunto *</label>
                            <select id="asunto" name="asunto" required>
                                <option value="">Selecciona un asunto</option>
                                <option value="consulta">Consulta General</option>
                                <option value="pedido">Información de Pedidos</option>
                                <option value="reclamo">Reclamo o Sugerencia</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="mensaje">Mensaje *</label>
                            <textarea id="mensaje" name="mensaje" rows="6" required><?php echo isset($mensaje) ? htmlspecialchars($mensaje) : ''; ?></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
                    </form>
                </div>

                <div class="contact-info">
                    <h3>Información de Contacto</h3>
                    <div class="info-item">
                        <h4>📍 Dirección</h4>
                        <p>Calle Principal 123<br>Ciudad, Estado 12345</p>
                    </div>
                    <div class="info-item">
                        <h4>📞 Teléfono</h4>
                        <p>+1 (234) 567-8900</p>
                    </div>
                    <div class="info-item">
                        <h4>📧 Email</h4>
                        <p>info@milkshakesdrs.com</p>
                    </div>
                    <div class="info-item">
                        <h4>🕐 Horario</h4>
                        <p>Lunes a Viernes: 10:00 AM - 8:00 PM<br>Sábado y Domingo: 12:00 PM - 10:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2026 Milkshakes DRS. Todos los derechos reservados.</p>
            <p>Dirección: Calle Principal 123 | Teléfono: +1 234-567-8900 | Email: info@milkshakesdrs.com</p>
        </div>
    </footer>
</body>
</html>
