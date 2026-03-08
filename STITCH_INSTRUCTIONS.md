# Stitch Instructions

El repositorio debe obtener imágenes y código de un proyecto Stitch.

Se proporcionan IDs de proyecto y de pantalla, pero el servicio Stitch expone URLs que normalmente siguen un patrón similar a:

```
https://stitch.example.com/projects/<PROJECT_ID>/screens/<SCREEN_ID>.png
https://stitch.example.com/projects/<PROJECT_ID>/screens/<SCREEN_ID>.html
```

Para descargar el recurso usa `curl -L` (la opción `-L` sigue redirecciones):

```bash
# Imagen
curl -L "https://stitch.example.com/projects/12518992524238719426/screens/c00c4b17bc1d4c099e66f42cbf0be85b.png" -o store-admin-dashboard.png

# Código HTML
curl -L "https://stitch.example.com/projects/12518992524238719426/screens/c00c4b17bc1d4c099e66f42cbf0be85b.html" -o store-admin-dashboard.html
```

Sustituye la base de la URL con la dirección real que Stitch te proporcione. Este ejemplo usa el proyecto **12518992524238719426** y la pantalla **c00c4b17bc1d4c099e66f42cbf0be85b**.
