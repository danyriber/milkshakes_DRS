<?php
/**
 * Sistema de Verificación de Instalación - Milkshakes DRS
 * Valida que todo esté configurado correctamente
 */

$checks = array();
$pass = 0;
$fail = 0;

// 1. Verificar PHP version
$php_version = phpversion();
if (version_compare($php_version, '7.4.0', '>=')) {
    $checks[] = array(
        'name' => 'PHP Version',
        'expected' => '7.4.0+',
        'actual' => $php_version,
        'status' => '✓ PASS'
    );
    $pass++;
} else {
    $checks[] = array(
        'name' => 'PHP Version',
        'expected' => '7.4.0+',
        'actual' => $php_version,
        'status' => '✗ FAIL'
    );
    $fail++;
}

// 2. Verificar extensiones PHP necesarias
$required_extensions = array('session', 'standard', 'filter');
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        $checks[] = array(
            'name' => "PHP Extension: $ext",
            'expected' => 'Loaded',
            'actual' => 'Loaded',
            'status' => '✓ PASS'
        );
        $pass++;
    } else {
        $checks[] = array(
            'name' => "PHP Extension: $ext",
            'expected' => 'Loaded',
            'actual' => 'Not loaded',
            'status' => '✗ FAIL'
        );
        $fail++;
    }
}

// 3. Verificar permiso de escritura en directorio logs
$logs_dir = 'logs';
if (!is_dir($logs_dir)) {
    @mkdir($logs_dir, 0755, true);
}

if (is_writable($logs_dir)) {
    $checks[] = array(
        'name' => 'Logs Directory Writable',
        'expected' => 'Yes',
        'actual' => 'Yes',
        'status' => '✓ PASS'
    );
    $pass++;
} else {
    $checks[] = array(
        'name' => 'Logs Directory Writable',
        'expected' => 'Yes',
        'actual' => 'No',
        'status' => '✗ FAIL'
    );
    $fail++;
}

// 4. Verificar archivos principales
$required_files = array(
    'index.php',
    'productos.php',
    'carrito.php',
    'contacto.php',
    'css/style.css',
    '.htaccess'
);

foreach ($required_files as $file) {
    if (file_exists($file)) {
        $checks[] = array(
            'name' => "File Exists: $file",
            'expected' => 'Yes',
            'actual' => 'Yes',
            'status' => '✓ PASS'
        );
        $pass++;
    } else {
        $checks[] = array(
            'name' => "File Exists: $file",
            'expected' => 'Yes',
            'actual' => 'No',
            'status' => '✗ FAIL'
        );
        $fail++;
    }
}

// 5. Verificar sesiones
session_start();
if (isset($_SESSION)) {
    $checks[] = array(
        'name' => 'Session Support',
        'expected' => 'Enabled',
        'actual' => 'Enabled',
        'status' => '✓ PASS'
    );
    $pass++;
} else {
    $checks[] = array(
        'name' => 'Session Support',
        'expected' => 'Enabled',
        'actual' => 'Disabled',
        'status' => '✗ FAIL'
    );
    $fail++;
}

// 6. Verificar configuración PHP importante
$ini_checks = array(
    'display_errors' => array('value' => ini_get('display_errors'), 'expected' => '1 o On'),
    'allow_url_fopen' => array('value' => ini_get('allow_url_fopen'), 'expected' => '1 o On'),
);

foreach ($ini_checks as $ini_name => $ini_data) {
    $value = $ini_data['value'] ? 'On' : 'Off';
    $checks[] = array(
        'name' => "PHP Config: $ini_name",
        'expected' => $ini_data['expected'],
        'actual' => $value,
        'status' => '⚠ INFO'
    );
}

// 7. Verificar servidor web
$checks[] = array(
    'name' => 'Web Server',
    'expected' => 'Apache 2.4+',
    'actual' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'status' => '⚠ INFO'
);

// 8. Información del sistema
$checks[] = array(
    'name' => 'Operating System',
    'expected' => 'Linux / Windows / macOS',
    'actual' => php_uname('s'),
    'status' => '⚠ INFO'
);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Instalación - Milkshakes DRS</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            width: 100%;
            padding: 40px;
        }
        header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-label {
            color: #666;
            font-size: 14px;
        }
        .pass {
            color: #28a745;
        }
        .fail {
            color: #dc3545;
        }
        .neutral {
            color: #6c757d;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #dee2e6;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .status {
            font-weight: 600;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
        }
        .status-pass {
            background: #d4edda;
            color: #155724;
        }
        .status-fail {
            background: #f8d7da;
            color: #721c24;
        }
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
        }
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        .alert-danger {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 30px;
        }
        a, button {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background 0.3s;
        }
        a:hover, button:hover {
            background: #764ba2;
        }
        .code {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🥤 Milkshakes DRS</h1>
            <p class="subtitle">Sistema de Verificación de Instalación</p>
        </header>

        <?php if ($fail > 0): ?>
            <div class="alert alert-danger">
                <strong>⚠️ Problemas Detectados:</strong><br>
                Se encontraron <?php echo $fail; ?> problema(s) que deben corregirse antes de usar la aplicación.
                Ver detalles abajo.
            </div>
        <?php else: ?>
            <div class="alert alert-success">
                <strong>✅ ¡Instalación Exitosa!</strong><br>
                Todos los requisitos se cumplen. La aplicación está lista para usar.
                <div class="actions" style="margin-top: 15px;">
                    <a href="index.php">Ir a la Aplicación</a>
                </div>
            </div>
        <?php endif; ?>

        <div class="summary">
            <div class="summary-item">
                <div class="summary-number pass"><?php echo $pass; ?></div>
                <div class="summary-label">Pasadas</div>
            </div>
            <div class="summary-item">
                <div class="summary-number fail"><?php echo $fail; ?></div>
                <div class="summary-label">Fallidas</div>
            </div>
            <div class="summary-item">
                <div class="summary-number neutral"><?php echo count($checks); ?></div>
                <div class="summary-label">Total Verificaciones</div>
            </div>
            <div class="summary-item">
                <div class="summary-number neutral"><?php echo round(($pass / count($checks)) * 100); ?>%</div>
                <div class="summary-label">Tasa de Éxito</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Verificación</th>
                    <th>Esperado</th>
                    <th>Actual</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($checks as $check): ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($check['name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($check['expected']); ?></td>
                        <td><?php echo htmlspecialchars($check['actual']); ?></td>
                        <td>
                            <?php
                            $status_class = '';
                            if (strpos($check['status'], 'PASS') !== false) {
                                $status_class = 'status-pass';
                            } elseif (strpos($check['status'], 'FAIL') !== false) {
                                $status_class = 'status-fail';
                            } else {
                                $status_class = 'status-info';
                            }
                            ?>
                            <span class="status <?php echo $status_class; ?>">
                                <?php echo htmlspecialchars($check['status']); ?>
                            </span>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h3>💡 Información del Sistema</h3>
            <p><strong>Usuario PHP:</strong> 
                <?php echo htmlspecialchars(get_current_user() ?: 'Unknown'); ?></p>
            <p><strong>Espacio en Disco (Disponible):</strong> 
                <?php echo htmlspecialchars(round(disk_free_space('/') / (1024 * 1024 * 1024), 2) . ' GB'); ?>
            </p>
            <p><strong>Memoria PHP (Max):</strong> 
                <?php echo htmlspecialchars(ini_get('memory_limit')); ?>
            </p>
            <p><strong>Tiempo Máximo de Ejecución:</strong> 
                <?php echo htmlspecialchars(ini_get('max_execution_time') . 's'); ?>
            </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>Para más información, consulta: 
                <a href="#" onclick="alert('Ver INSTALACION.md en el repositorio'); return false;">INSTALACION.md</a>
            </p>
            <p style="margin-top: 10px;">
                <strong>Fecha/Hora del Servidor:</strong> <?php echo date('Y-m-d H:i:s'); ?>
            </p>
        </div>
    </div>
</body>
</html>
