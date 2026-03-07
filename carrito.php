<?php
// carrito.php - Carrito de compras dinámico
session_start();

// Procesar eliminación de producto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eliminar_producto'])) {
    $indice = intval($_POST['indice_producto']);
    if (isset($_SESSION['carrito'][$indice])) {
        unset($_SESSION['carrito'][$indice]);
        $_SESSION['carrito'] = array_values($_SESSION['carrito']); // Reindexar
        $mensaje = "Producto eliminado del carrito";
    }
}

// Procesar vaciado de carrito
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['vaciar_carrito'])) {
    $_SESSION['carrito'] = array();
    $mensaje = "Carrito vaciado";
}

// Calcular total
$total = 0;
$cantidad_total = 0;
foreach ($_SESSION['carrito'] as $item) {
    $total += $item['precio'] * $item['cantidad'];
    $cantidad_total += $item['cantidad'];
}

$titulo_pagina = "Carrito de Compras - Milkshakes DRS";
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
                    <li><a href="carrito.php" class="active">Carrito (<?php echo $cantidad_total; ?>)</a></li>
                    <li><a href="contacto.php">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Contenido Principal -->
    <section class="cart-section">
        <div class="container">
            <h2>Tu Carrito de Compras</h2>

            <?php if (isset($mensaje)): ?>
                <div class="alert alert-info"><?php echo $mensaje; ?></div>
            <?php endif; ?>

            <?php if (count($_SESSION['carrito']) > 0): ?>
                <div class="cart-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            foreach ($_SESSION['carrito'] as $indice => $item) {
                                $subtotal = $item['precio'] * $item['cantidad'];
                                echo '<tr>';
                                echo '<td>' . htmlspecialchars($item['nombre']) . '</td>';
                                echo '<td>$' . number_format($item['precio'], 2) . '</td>';
                                echo '<td>' . intval($item['cantidad']) . '</td>';
                                echo '<td>$' . number_format($subtotal, 2) . '</td>';
                                echo '<td>';
                                echo '<form method="POST" style="display:inline;">';
                                echo '<input type="hidden" name="indice_producto" value="' . $indice . '">';
                                echo '<button type="submit" name="eliminar_producto" class="btn btn-danger btn-small">Eliminar</button>';
                                echo '</form>';
                                echo '</td>';
                                echo '</tr>';
                            }
                            ?>
                        </tbody>
                    </table>
                </div>

                <div class="cart-summary">
                    <h3>Resumen</h3>
                    <p><strong>Total de Productos:</strong> <?php echo $cantidad_total; ?></p>
                    <p><strong>Subtotal:</strong> $<?php echo number_format($total, 2); ?></p>
                    <p class="impuesto"><strong>Impuesto (10%):</strong> $<?php echo number_format($total * 0.10, 2); ?></p>
                    <p class="total"><strong>Total a Pagar:</strong> $<?php echo number_format($total * 1.10, 2); ?></p>
                </div>

                <div class="cart-actions">
                    <a href="productos.php" class="btn btn-secondary">Seguir Comprando</a>
                    <button onclick="alert('Funcionalidad de pago en desarrollo')" class="btn btn-primary">Proceder al Pago</button>
                    <form method="POST" style="display:inline;">
                        <button type="submit" name="vaciar_carrito" class="btn btn-danger" onclick="return confirm('¿Deseas vaciar el carrito?')">Vaciar Carrito</button>
                    </form>
                </div>
            <?php else: ?>
                <div class="empty-cart">
                    <p>Tu carrito está vacío</p>
                    <a href="productos.php" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            <?php endif; ?>
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
