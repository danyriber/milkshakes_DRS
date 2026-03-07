<?php
// index.php - Página principal de la tienda de milkshakes
session_start();

// Inicializar carrito si no existe
if (!isset($_SESSION['carrito'])) {
    $_SESSION['carrito'] = array();
}

$titulo_pagina = "Milkshakes DRS - Tienda Local";
$descripcion = "Bienvenido a Milkshakes DRS, tu tienda de milkshakes premium";
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
    <!-- Header y Navegación -->
    <header>
        <div class="container">
            <div class="logo">
                <h1>🥤 Milkshakes DRS</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.php" class="active">Inicio</a></li>
                    <li><a href="productos.php">Catálogo</a></li>
                    <li><a href="carrito.php">Carrito (<?php echo count($_SESSION['carrito']); ?>)</a></li>
                    <li><a href="contacto.php">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h2>¡Bienvenido a Milkshakes DRS!</h2>
            <p>Los mejores milkshakes artesanales de la ciudad</p>
            <a href="productos.php" class="btn btn-primary">Explorar Catálogo</a>
        </div>
    </section>

    <!-- Sección de Características -->
    <section class="features">
        <div class="container">
            <div class="feature-card">
                <h3>🍓 Ingredientes Premium</h3>
                <p>Seleccionamos los mejores ingredientes naturales para cada milkshake</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Preparación Rápida</h3>
                <p>Recibe tu pedido en minutos, siempre fresco y delicioso</p>
            </div>
            <div class="feature-card">
                <h3>🎯 Personalización</h3>
                <p>Personaliza tu milkshake con tus sabores favoritos</p>
            </div>
        </div>
    </section>

    <!-- Sección de Productos Destacados -->
    <section class="featured">
        <div class="container">
            <h2>Productos Destacados</h2>
            <div class="products-grid">
                <?php
                // Array de productos destacados (simulando base de datos)
                $productos_destacados = array(
                    array(
                        "id" => 1,
                        "nombre" => "Milkshake Fresa",
                        "precio" => 4.50,
                        "descripcion" => "Milkshake de fresa natural con hielo",
                        "imagen" => "fresa.png"
                    ),
                    array(
                        "id" => 2,
                        "nombre" => "Milkshake Chocolate",
                        "precio" => 4.50,
                        "descripcion" => "Milkshake de chocolate belga premium",
                        "imagen" => "chocolate.png"
                    ),
                    array(
                        "id" => 3,
                        "nombre" => "Milkshake Vainilla",
                        "precio" => 4.00,
                        "descripcion" => "Milkshake de vainilla clásica",
                        "imagen" => "vainilla.png"
                    )
                );

                foreach ($productos_destacados as $producto) {
                    echo '<div class="product-card">';
                    echo '<img src="images/' . htmlspecialchars($producto['imagen']) . '" alt="' . htmlspecialchars($producto['nombre']) . '">';
                    echo '<h3>' . htmlspecialchars($producto['nombre']) . '</h3>';
                    echo '<p>' . htmlspecialchars($producto['descripcion']) . '</p>';
                    echo '<p class="price">$' . number_format($producto['precio'], 2) . '</p>';
                    echo '<a href="productos.php" class="btn btn-secondary">Ver Más</a>';
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
