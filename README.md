# Cyber InfoSoft Corporation Website

A professional, responsive website for Cyber InfoSoft Corporation, specializing in custom website development for small businesses and startups.

## File Structure

```
├── index.html              # Home page
├── services.html           # Services page
├── about.html              # About Us page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page
├── quote.html              # Request a Quote page
├── favicon.ico             # Favicon
├── site.webmanifest        # Web App Manifest
├── robots.txt              # Robots file for search engines
├── sitemap.xml             # Sitemap for search engines
├── assets/                 # Assets directory
│   ├── images/             # Image files
│   ├── icons/              # Icon files
│   ├── logos/              # Logo files
│   └── svgs/               # SVG files
├── css/                    # CSS directory
│   └── style.css           # Main stylesheet
└── js/                     # JavaScript directory
    └── main.js             # Main JavaScript file
```

## Local Usage

To view the website locally:

1. Download or clone this repository
2. Open `index.html` in a web browser

No build step or server is required as this is a static website built with vanilla HTML, CSS, and JavaScript.

## Customization Guide

### Changing Logo

1. The logo is located in the root directory as `logo.jpg`
2. Update the logo references in the HTML files if needed:

```html
<a href="index.html" class="logo">
  <img src="logo.jpg" alt="Cyber InfoSoft Corporation Logo">
  <span>Cyber InfoSoft</span>
</a>
```

### Changing Colors

The website uses CSS variables for consistent theming. To change the color scheme:

1. Open `css/style.css`
2. Locate the `:root` section at the top of the file
3. Modify the color variables as needed:

```css
:root {
  /* Light Theme Colors */
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #60a5fa;
  --secondary-color: #475569;
  --accent-color: #f59e0b;
  --text-color: #1e293b;
  --text-light: #64748b;
  --bg-color: #ffffff;
  --bg-light: #f8fafc;
  --bg-dark: #f1f5f9;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  /* Dark Theme Colors */
  --dark-primary-color: #3b82f6;
  --dark-primary-dark: #2563eb;
  --dark-primary-light: #93c5fd;
  --dark-secondary-color: #94a3b8;
  --dark-accent-color: #fbbf24;
  --dark-text-color: #e2e8f0;
  --dark-text-light: #94a3b8;
  --dark-bg-color: #0f172a;
  --dark-bg-light: #1e293b;
  --dark-bg-dark: #0f172a;
  --dark-border-color: #334155;
  --dark-card-bg: #1e293b;
  --dark-card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}
```

### Changing Fonts

1. Update the Google Fonts link in the `<head>` section of each HTML file:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
   ```

2. Update the font-family variables in `css/style.css`:
   ```css
   :root {
     --font-primary: 'Inter', sans-serif;
     --font-heading: 'Poppins', sans-serif;
   }
   ```

### Changing Images

1. Replace image files in the `assets/images/` directory
2. Update image references in the HTML files:
   ```html
   <img src="assets/images/your-image.jpg" alt="Description">
   ```

### Updating Copy

To update text content, edit the HTML files directly. The website uses semantic HTML structure, making it easy to locate and modify content.

## Theme Toggle Functionality

The website includes a light/dark theme toggle that respects the user's system preference and persists their choice using localStorage.

### How the Theme Toggle Works

The theme toggle functionality is implemented in `js/main.js`:

```javascript
// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');

// Check for saved theme preference or use system preference
const getThemePreference = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    moonIcon.classList.add('d-none');
    sunIcon.classList.remove('d-none');
  } else {
    document.documentElement.removeAttribute('data-theme');
    sunIcon.classList.add('d-none');
    moonIcon.classList.remove('d-none');
  }
  localStorage.setItem('theme', theme);
};

// Initialize theme
applyTheme(getThemePreference());

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});
```

## Adding New Portfolio Items

To add new portfolio items to the portfolio page:

1. Open `portfolio.html`
2. Locate the portfolio grid section
3. Add a new portfolio item using the following structure:

```html
<div class="portfolio-item" data-category="category-name">
  <div class="portfolio-card">
    <div class="portfolio-image">
      <img src="assets/images/portfolio/your-project-image.jpg" alt="Project Name">
    </div>
    <div class="portfolio-content">
      <h3>Project Name</h3>
      <p>Brief project description</p>
      <div class="portfolio-tags">
        <span class="tag">HTML</span>
        <span class="tag">CSS</span>
        <span class="tag">JavaScript</span>
      </div>
      <button class="btn btn-sm btn-outline-primary view-project" data-project="project-id">View Details</button>
    </div>
  </div>
</div>
```

4. Add a corresponding modal for the project details:

```html
<div class="portfolio-modal" id="project-id">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Project Name</h2>
      <button class="close-modal">&times;</button>
    </div>
    <div class="modal-body">
      <div class="project-image">
        <img src="assets/images/portfolio/your-project-image.jpg" alt="Project Name">
      </div>
      <div class="project-details">
        <div class="project-info">
          <h3>Project Overview</h3>
          <p>Detailed project description...</p>
          
          <h3>Client</h3>
          <p>Client Name</p>
          
          <h3>Project Duration</h3>
          <p>X weeks</p>
          
          <h3>Technologies Used</h3>
          <div class="project-tags">
            <span class="tag">HTML</span>
            <span class="tag">CSS</span>
            <span class="tag">JavaScript</span>
          </div>
          
          <h3>Project Outcome</h3>
          <p>Results and metrics...</p>
          
          <div class="project-cta">
            <a href="#" class="btn btn-primary" target="_blank">Visit Website</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

5. Update the filter categories if needed:

```html
<div class="portfolio-filter">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="category-name">Category Name</button>
  <!-- Add more filter buttons as needed -->
</div>
```

## Adding New Services

To add a new service to the services page:

1. Open `services.html`
2. Locate the services grid section
3. Add a new service card using the following structure:

```html
<div class="service-card reveal">
  <div class="service-icon">
    <!-- Add your SVG icon here -->
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- SVG path data -->
    </svg>
  </div>
  <h3>Service Name</h3>
  <p>Service description...</p>
  <a href="#service-id" class="btn btn-sm btn-outline-primary">Learn More</a>
</div>
```

4. Add a detailed service section:

```html
<section id="service-id" class="section bg-light">
  <div class="container">
    <div class="section-header text-center">
      <h2 class="reveal">Service Name</h2>
      <p class="lead reveal">Service tagline or brief description</p>
    </div>
    
    <div class="row">
      <div class="col-lg-6 mb-4 mb-lg-0">
        <div class="service-content reveal">
          <h3>What's Included</h3>
          <ul class="feature-list">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <!-- Add more features -->
          </ul>
          
          <h3>Timeline</h3>
          <p>Estimated timeline information...</p>
          
          <div class="cta-buttons">
            <a href="quote.html" class="btn btn-primary">Request a Quote</a>
            <a href="contact.html" class="btn btn-outline-primary">Contact Us</a>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="pricing-table reveal">
          <h3>Pricing Tiers</h3>
          
          <div class="pricing-tier">
            <div class="tier-header">
              <h4>Basic Package</h4>
              <p class="price">$XXX</p>
            </div>
            <div class="tier-features">
              <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <!-- Add more features -->
              </ul>
            </div>
            <div class="tier-cta">
              <a href="quote.html" class="btn btn-outline-primary">Get Started</a>
            </div>
          </div>
          
          <!-- Add more pricing tiers as needed -->
        </div>
      </div>
    </div>
  </div>
</section>
```

## Swapping Google Map Embed

To change the Google Map embed on the contact page:

1. Open `contact.html`
2. Locate the map section
3. Replace the iframe src attribute with your own Google Maps embed URL:

```html
<div class="google-map">
  <iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
```

To get your own Google Maps embed URL:
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click on "Share" and then "Embed a map"
4. Copy the provided iframe code

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Push your website files to the repository
3. Go to repository Settings > Pages
4. Select the branch to deploy (usually `main` or `master`)
5. Click Save

### Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket account
4. Select your repository
5. Configure build settings (not needed for this static site)
6. Click "Deploy site"

### Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Click "New Project"
3. Import your repository from GitHub/GitLab/Bitbucket
4. Configure project settings (not needed for this static site)
5. Click "Deploy"

## License

This project is licensed under the MIT License - see the LICENSE file for details.