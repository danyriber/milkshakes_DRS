<?php
// productos.php - Catálogo dinámico de productos
session_start();

// Simulación de base de datos con array
$catalogo = array(
    array(
        "id" => 1,
        "nombre" => "Milkshake Fresa",
        "precio" => 4.50,
        "descripcion" => "Milkshake de fresa natural con hielo y crema",
        "categoria" => "frutas",
        "disponible" => true,
        "imagen" => "fresa.png"
    ),
    array(
        "id" => 2,
        "nombre" => "Milkshake Chocolate",
        "precio" => 4.50,
        "descripcion" => "Milkshake de chocolate belga premium con toppings",
        "categoria" => "chocolate",
        "disponible" => true,
        "imagen" => "chocolate.png"
    ),
    array(
        "id" => 3,
        "nombre" => "Milkshake Vainilla",
        "precio" => 4.00,
        "descripcion" => "Milkshake de vainilla clásica, suave y cremoso",
        "categoria" => "clasicos",
        "disponible" => true,
        "imagen" => "vainilla.png"
    ),
    array(
        "id" => 4,
        "nombre" => "Milkshake Mango",
        "precio" => 5.00,
        "descripcion" => "Milkshake tropical de mango fresco",
        "categoria" => "frutas",
        "disponible" => true,
        "imagen" => "mango.png"
    ),
    array(
        "id" => 5,
        "nombre" => "Milkshake Oreo",
        "precio" => 5.50,
        "descripcion" => "Milkshake de chocolate con galletas Oreo",
        "categoria" => "chocolate",
        "disponible" => true,
        "imagen" => "oreo.png"
    ),
    array(
        "id" => 6,
        "nombre" => "Milkshake Pistacho",
        "precio" => 5.50,
        "descripcion" => "Milkshake de pistacho natural y delicado",
        "categoria" => "clasicos",
        "disponible" => true,
        "imagen" => "pistacho.png"
    ),
    array(
        "id" => 7,
        "nombre" => "Milkshake Plátano",
        "precio" => 4.50,
        "descripcion" => "Milkshake de plátano fresco con miel",
        "categoria" => "frutas",
        "disponible" => true,
        "imagen" => "platano.png"
    ),
    array(
        "id" => 8,
        "nombre" => "Milkshake Avellana",
        "precio" => 5.00,
        "descripcion" => "Milkshake de avellana tostada y cremosa",
        "categoria" => "clasicos",
        "disponible" => true,
        "imagen" => "avellana.png"
    )
);

// Procesar agregar al carrito
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['agregar_carrito'])) {
    $producto_id = intval($_POST['producto_id']);
    $cantidad = intval($_POST['cantidad']);
    
    // Buscar el producto
    $producto_encontrado = false;
    foreach ($catalogo as $prod) {
        if ($prod['id'] == $producto_id) {
            $_SESSION['carrito'][] = array(
                'id' => $prod['id'],
                'nombre' => $prod['nombre'],
                'precio' => $prod['precio'],
                'cantidad' => $cantidad,
                'timestamp' => time()
            );
            $producto_encontrado = true;
            $mensaje_exito = "¡Producto agregado al carrito!";
            break;
        }
    }
}

$titulo_pagina = "Catálogo de Productos - Milkshakes DRS";
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
                    <li><a href="productos.php" class="active">Catálogo</a></li>
                    <li><a href="carrito.php">Carrito (<?php echo count($_SESSION['carrito']); ?>)</a></li>
                    <li><a href="contacto.php">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Contenido Principal -->
    <section class="products-section">
        <div class="container">
            <h2>Nuestro Catálogo Completo</h2>
            
            <?php if (isset($mensaje_exito)): ?>
                <div class="alert alert-success">
                    <?php echo $mensaje_exito; ?>
                </div>
            <?php endif; ?>

            <div class="products-grid">
                <?php
                foreach ($catalogo as $producto) {
                    echo '<div class="product-card">';
                    echo '<div class="product-image">';
                    echo '<img src="images/' . htmlspecialchars($producto['imagen']) . '" alt="' . htmlspecialchars($producto['nombre']) . '">';
                    if (!$producto['disponible']) {
                        echo '<div class="out-of-stock">Agotado</div>';
                    }
                    echo '</div>';
                    echo '<div class="product-info">';
                    echo '<h3>' . htmlspecialchars($producto['nombre']) . '</h3>';
                    echo '<p class="description">' . htmlspecialchars($producto['descripcion']) . '</p>';
                    echo '<p class="category">Categoría: ' . htmlspecialchars($producto['categoria']) . '</p>';
                    echo '<p class="price">$' . number_format($producto['precio'], 2) . '</p>';
                    
                    if ($producto['disponible']) {
                        echo '<form method="POST" class="add-to-cart-form">';
                        echo '<input type="hidden" name="producto_id" value="' . $producto['id'] . '">';
                        echo '<label for="cantidad_' . $producto['id'] . '">Cantidad:</label>';
                        echo '<input type="number" id="cantidad_' . $producto['id'] . '" name="cantidad" value="1" min="1" max="10">';
                        echo '<button type="submit" name="agregar_carrito" class="btn btn-primary">Agregar al Carrito</button>';
                        echo '</form>';
                    } else {
                        echo '<button class="btn btn-disabled" disabled>No Disponible</button>';
                    }
                    
                    echo '</div>';
                    echo '</div>';
                }
                ?>
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
