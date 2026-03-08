const axios = require('axios');

// Configuración del CMS
const CMS_URL = process.env.CMS_URL || 'http://cms-service:1337';
const CMS_API_TOKEN = process.env.CMS_API_TOKEN; // Para autenticación si es necesario

class CMSIntegration {
  constructor() {
    this.client = axios.create({
      baseURL: CMS_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(CMS_API_TOKEN && { 'Authorization': `Bearer ${CMS_API_TOKEN}` })
      }
    });
  }

  // Obtener contenido estático (páginas, blogs, etc.)
  async getContent(contentType, params = {}) {
    try {
      const response = await this.client.get(`/api/${contentType}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${contentType} from CMS:`, error.message);
      throw error;
    }
  }

  // Obtener un elemento específico por ID o slug
  async getContentById(contentType, id, params = {}) {
    try {
      const response = await this.client.get(`/api/${contentType}/${id}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${contentType} ${id} from CMS:`, error.message);
      throw error;
    }
  }

  // Obtener productos desde el CMS (si se gestionan ahí)
  async getProducts(params = {}) {
    return this.getContent('products', params);
  }

  // Obtener categorías
  async getCategories(params = {}) {
    return this.getContent('categories', params);
  }

  // Obtener páginas estáticas
  async getPages(params = {}) {
    return this.getContent('pages', params);
  }

  // Obtener posts del blog
  async getBlogPosts(params = {}) {
    return this.getContent('blog-posts', params);
  }

  // Buscar contenido
  async search(query, contentTypes = []) {
    try {
      const params = { _q: query };
      if (contentTypes.length > 0) {
        // Implementar búsqueda en múltiples tipos de contenido
        const results = {};
        for (const type of contentTypes) {
          results[type] = await this.getContent(type, { ...params });
        }
        return results;
      }
      // Búsqueda general (depende de la configuración del CMS)
      const response = await this.client.get('/api/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching CMS:', error.message);
      throw error;
    }
  }

  // Verificar estado del CMS
  async healthCheck() {
    try {
      const response = await this.client.get('/');
      return { status: 'healthy', version: response.data?.version };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new CMSIntegration();