const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build Strapi for Vercel
console.log('Building Strapi for Vercel...');

// Run Strapi build
execSync('npm run build', { stdio: 'inherit' });

// Create Vercel function
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Create index.js for Vercel function
const indexJs = `
const strapi = require('./strapi');

module.exports = async (req, res) => {
  try {
    // Initialize Strapi if not already initialized
    if (!strapi.isInitialized) {
      await strapi.start();
    }

    // Handle the request
    await strapi.app(req, res);
  } catch (error) {
    console.error('Strapi error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
`;

fs.writeFileSync(path.join(distPath, 'index.js'), indexJs);

// Copy built files
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  execSync(\`cp -r \${buildPath}/* \${distPath}/\`);
}

console.log('Build completed for Vercel deployment');