# Portfolio Website Clone

A modern, responsive developer portfolio website built with Next.js and Tailwind CSS, inspired by the design from [websitedemos.net/web-developer-portfolio-04](https://websitedemos.net/web-developer-portfolio-04/).

## 🎯 Features

- **Matrix-style Design**: Dark theme with green accent colors and coding aesthetic
- **Animated Hero Section**: Dynamic text rotation and typing effects
- **Interactive Components**: Hover effects, smooth scrolling, and responsive design
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Performance Optimized**: Fast loading with Next.js optimization and Turbopack
- **Fully Responsive**: Mobile-first design that works on all devices

## 🚀 Sections

1. **Hero Section** - Dynamic introduction with rotating job titles
2. **About Me** - Interactive code-style presentation of skills and experience
3. **Portfolio** - Project showcase with placeholder images and tech stacks
4. **Services** - Professional services offered with detailed descriptions
5. **Resume** - Experience timeline and skills visualization
6. **Contact** - Functional contact form with social links
7. **Footer** - Simple footer with copyright information

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Source Code Pro (Google Fonts)
- **Deployment Ready**: Vercel, Netlify, or any static hosting

## 📦 Installation

1. Clone the repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd itsme
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Contact form

The contact form sends email via [Web3Forms](https://web3forms.com):

1. Sign up at [web3forms.com](https://web3forms.com) with your email.
2. Copy your access key.
3. Create `.env.local` from `.env.example` and set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.
4. Restart the dev server. On Vercel, add the same variable in project settings.

Submissions run in the browser (Web3Forms free plan does not allow server-side API calls).

## 🎨 Customization

### Colors

The color scheme is defined in `src/app/globals.css`:

- Background: `#0a0a0a` (black)
- Primary: `#00ff41` (matrix green)
- Secondary: `#ffffff` (white)
- Accent: `#333333` (dark gray)

### Content

Update the following components to customize content:

- `src/components/Hero.tsx` - Personal introduction and job titles
- `src/components/About.tsx` - About section and skills
- `src/components/Portfolio.tsx` - Projects and portfolio items
- `src/components/Services.tsx` - Services offered
- `src/components/Resume.tsx` - Experience and certifications
- `src/components/Contact.tsx` - Contact information and form

### Images

Replace placeholder images in the `public/` folder:

- `project1.svg` through `project6.svg` - Portfolio project images
- Add your own images and update the paths in components

## 🎯 Key Components

- **MatrixRain**: Animated matrix-style background effect
- **LoadingScreen**: Terminal-style loading animation
- **ScrollToTop**: Smooth scroll-to-top button
- **Header**: Responsive navigation with mobile menu
- **TypeWriter Effects**: Custom CSS animations for text effects

## 📱 Responsive Design

The website is fully responsive with:

- Mobile-first approach
- Flexible grid layouts
- Responsive navigation menu
- Optimized typography scaling
- Touch-friendly interactive elements

## 🚀 Deployment

### Vercel

\`\`\`bash
npm run build

# Deploy to Vercel

https://its-me.touchsimpledev.com/ or https://vercel.com/edwinsatyas-projects/new-itsme/2WGzTyzcQkxMj8BK8AveBxCo1GRt

### Static Export

\`\`\`bash
npm run build
npm run start
\`\`\`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original design inspiration from [websitedemos.net](https://websitedemos.net/web-developer-portfolio-04/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Note**: This is a portfolio template. Customize the content, images, and information to match your own professional profile and projects.
