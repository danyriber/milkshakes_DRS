#!/usr/bin/env node

/**
 * Script para configurar Strapi con tipos de contenido iniciales
 * Ejecutar después de la instalación inicial de Strapi
 */

const fs = require('fs');
const path = require('path');

// Configuración de tipos de contenido para Milkshakes DRS
const contentTypes = {
  // Productos gestionados en CMS
  product: {
    kind: 'collectionType',
    collectionName: 'products',
    info: {
      singularName: 'product',
      pluralName: 'products',
      displayName: 'Producto',
      description: 'Productos disponibles en la tienda'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        unique: true,
      },
      description: {
        type: 'text',
        required: true,
      },
      price: {
        type: 'decimal',
        required: true,
      },
      image: {
        type: 'media',
        multiple: false,
        required: false,
      },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::category.category',
        inversedBy: 'products',
      },
      featured: {
        type: 'boolean',
        default: false,
      },
      stock: {
        type: 'integer',
        default: 0,
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true,
      },
    },
  },

  // Categorías de productos
  category: {
    kind: 'collectionType',
    collectionName: 'categories',
    info: {
      singularName: 'category',
      pluralName: 'categories',
      displayName: 'Categoría',
      description: 'Categorías de productos'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        unique: true,
      },
      description: {
        type: 'text',
      },
      image: {
        type: 'media',
        multiple: false,
        required: false,
      },
      products: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::product.product',
        mappedBy: 'category',
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true,
      },
    },
  },

  // Páginas estáticas
  page: {
    kind: 'collectionType',
    collectionName: 'pages',
    info: {
      singularName: 'page',
      pluralName: 'pages',
      displayName: 'Página',
      description: 'Páginas estáticas del sitio'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {
      i18n: {
        localized: true,
      },
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
      },
      content: {
        type: 'richtext',
        required: true,
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true,
      },
      metaDescription: {
        type: 'text',
      },
      metaTitle: {
        type: 'string',
      },
      featuredImage: {
        type: 'media',
        multiple: false,
        required: false,
      },
    },
  },

  // Posts del blog
  'blog-post': {
    kind: 'collectionType',
    collectionName: 'blog_posts',
    info: {
      singularName: 'blog-post',
      pluralName: 'blog-posts',
      displayName: 'Post del Blog',
      description: 'Artículos del blog'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {
      i18n: {
        localized: true,
      },
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
      },
      content: {
        type: 'richtext',
        required: true,
      },
      excerpt: {
        type: 'text',
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true,
      },
      author: {
        type: 'string',
      },
      publishedAt: {
        type: 'datetime',
      },
      featuredImage: {
        type: 'media',
        multiple: false,
        required: false,
      },
      tags: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::tag.tag',
        inversedBy: 'blog_posts',
      },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::blog-category.blog-category',
        inversedBy: 'blog_posts',
      },
    },
  },

  // Categorías del blog
  'blog-category': {
    kind: 'collectionType',
    collectionName: 'blog_categories',
    info: {
      singularName: 'blog-category',
      pluralName: 'blog-categories',
      displayName: 'Categoría del Blog',
      description: 'Categorías para organizar posts del blog'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        unique: true,
      },
      description: {
        type: 'text',
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true,
      },
      blog_posts: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::blog-post.blog-post',
        mappedBy: 'category',
      },
    },
  },

  // Tags para blog
  tag: {
    kind: 'collectionType',
    collectionName: 'tags',
    info: {
      singularName: 'tag',
      pluralName: 'tags',
      displayName: 'Tag',
      description: 'Tags para categorizar contenido'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        unique: true,
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true,
      },
      blog_posts: {
        type: 'relation',
        relation: 'manyToMany',
        target: 'api::blog-post.blog-post',
        mappedBy: 'tags',
      },
    },
  },
};

// Función para crear archivos de tipos de contenido
function createContentTypeFiles() {
  const contentTypesDir = path.join(__dirname, 'src', 'api');

  // Crear directorio si no existe
  if (!fs.existsSync(contentTypesDir)) {
    fs.mkdirSync(contentTypesDir, { recursive: true });
  }

  Object.entries(contentTypes).forEach(([name, config]) => {
    const apiDir = path.join(contentTypesDir, name);
    const contentTypesSubDir = path.join(apiDir, 'content-types', name);

    // Crear estructura de directorios
    fs.mkdirSync(contentTypesSubDir, { recursive: true });

    // Crear archivo schema.json
    const schemaPath = path.join(contentTypesSubDir, 'schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(config, null, 2));

    console.log(`✅ Creado tipo de contenido: ${name}`);
  });

  console.log('\n🎉 Todos los tipos de contenido han sido creados!');
  console.log('\n📋 Tipos de contenido disponibles:');
  Object.keys(contentTypes).forEach(name => {
    console.log(`  - ${name}`);
  });
  console.log('\n🚀 Ejecuta: npm run develop');
  console.log('   Ve a http://localhost:1337/admin para configurar el contenido');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('🔧 Configurando tipos de contenido para Milkshakes DRS...\n');
  createContentTypeFiles();
}

module.exports = { contentTypes, createContentTypeFiles };