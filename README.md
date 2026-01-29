# Interior Design Studio Website Template

A modern, high-performance website template for interior designers with excellent RTL (Hebrew) support.

## Features

- **Full RTL & Hebrew Support** - Native right-to-left layout with proper Hebrew typography
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **High Performance** - Minimal dependencies, lazy loading, optimized animations
- **Modern UI** - Clean, elegant design perfect for interior design portfolios
- **Easy Customization** - JSON config file for all content, CSS variables for theming

## Quick Start

1. Open `index.html` in your browser to preview the site
2. **Edit `config.json`** to update all text content (see below)
3. Add your images to the `images/` folder
4. Deploy to your hosting provider

## File Structure

```
├── index.html          # Main HTML file
├── config.json         # ⭐ ALL CONTENT HERE - Edit this file!
├── css/
│   └── style.css       # All styles with CSS variables
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Your images go here
│   ├── hero-1.jpg      # Hero slider images (1920x1080 recommended)
│   ├── hero-2.jpg
│   ├── hero-3.jpg
│   ├── designer.jpg    # Designer photo (800x1000 recommended)
│   ├── project-1.jpg   # Project images (800x600 recommended)
│   ├── project-2.jpg
│   └── project-3.jpg
└── README.md
```

## Customization Guide

### 1. Edit config.json (Recommended!)

The easiest way to customize the site is to edit `config.json`. This single file contains ALL text content:

```json
{
  "designer": {
    "name": "שם המעצבת",           // Designer name (appears everywhere)
    "title": "סטודיו לעיצוב...",    // Designer title
    "phone": "050-0000000",         // Phone number
    "email": "email@example.com",   // Email address
    "address": "כתובת הסטודיו"      // Studio address
  },
  "social": {
    "whatsapp": "https://wa.me/...", // WhatsApp link
    "instagram": "https://...",       // Instagram profile
    "facebook": "https://..."         // Facebook page
  },
  // ... and much more!
}
```

**What you can customize in config.json:**
- Designer name, phone, email, address
- All social media links
- Hero section title & subtitle
- About section text
- All project titles & descriptions
- Process steps
- Testimonials
- Contact form labels & messages
- Footer text

### 3. Customize Colors

In `css/style.css`, modify the CSS variables at the top:

```css
:root {
    /* Primary Colors */
    --color-primary: #1a1a1a;        /* Main dark color */
    --color-secondary: #c9a96e;      /* Gold/accent color */
    --color-accent: #b8936e;         /* Hover accent */
    
    /* Text Colors */
    --color-text: #333333;
    --color-text-light: #666666;
    
    /* Background Colors */
    --color-background: #ffffff;
    --color-background-alt: #f8f7f5;
    --color-background-dark: #1a1a1a;
}
```

### 4. Add Your Images

Replace placeholder images in the `images/` folder:

| Image | Recommended Size | Description |
|-------|-----------------|-------------|
| `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` | 1920×1080px | Hero slideshow backgrounds |
| `designer.jpg` | 800×1000px | Designer portrait for About section |
| `project-1.jpg`, `project-2.jpg`, `project-3.jpg` | 800×600px | Portfolio project thumbnails |

### 5. Update Social Media Links

Search for `href="#"` in the social media sections and replace with your actual URLs:
- WhatsApp: `https://wa.me/972500000000`
- Instagram: `https://instagram.com/yourprofile`
- Facebook: `https://facebook.com/yourpage`

### 6. Customize Testimonials

Find the testimonials section and update:
- Quote text
- Customer names

### 7. Update Projects

For each project card, update:
- Image source
- Project title
- Project description
- Link to project page (if you create individual project pages)

## Adding More Projects

To add a new project, copy this template inside `.projects-grid`:

```html
<article class="project-card">
    <div class="project-image">
        <img src="images/project-new.jpg" alt="שם הפרויקט" loading="lazy">
        <div class="project-overlay">
            <a href="#" class="btn btn-small">לדף הפרויקט</a>
        </div>
    </div>
    <div class="project-content">
        <h3 class="project-title">שם הפרויקט</h3>
        <p class="project-description">תיאור קצר של הפרויקט.</p>
    </div>
</article>
```

## Form Handling

The contact form currently shows an alert on submission. To connect it to a real backend:

### Option 1: Formspree (Easy, Free)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Update the form tag:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: Custom Backend
Modify the `handleFormSubmit` function in `js/main.js` to send data to your server.

## Performance Tips

1. **Optimize Images**: Use tools like [TinyPNG](https://tinypng.com) to compress images
2. **Use WebP Format**: Convert images to WebP for better compression
3. **Enable Caching**: Configure your server to cache static assets
4. **Use a CDN**: For better global performance

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari
- Chrome for Android

## Accessibility

The template includes:
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Reduced motion support
- High contrast text

## License

This template is free to use for personal and commercial projects.

---

**Need help?** Feel free to reach out for customization assistance.
