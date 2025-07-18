# Latitude & Longitude Calculator

A modern geographic coordinate calculator web application built with Lit, Spectrum Web Components, and TypeScript.

## Features

- **Coordinate Conversions**: Convert between decimal degrees, degrees/minutes/seconds (DMS), and other formats
- **Distance Calculations**: Calculate distances between two geographic points using the Haversine formula
- **Bearing Calculations**: Determine the bearing/heading between coordinates
- **Coordinate Validation**: Validate latitude and longitude inputs
- Clean, modern UI using Adobe's Spectrum Design System
- Responsive design for desktop and mobile use
- Web Components architecture
- TypeScript support
- Comprehensive testing with AVA
- Automatic deployment to GitHub Pages

## Tech Stack

- **Framework**: [Lit](https://lit.dev/) - Simple. Fast. Web Components.
- **UI Components**: [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) - Adobe's design system
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Testing**: [AVA](https://github.com/avajs/ava) - Test runner
- **Package Manager**: [PNPM](https://pnpm.io/) - Fast, disk space efficient package manager
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PNPM

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lnl-calc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building

Build the project for production:
```bash
pnpm build
```

### Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

### Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions. Every push to the main branch will trigger a build and deployment.

You can also manually deploy:
```bash
pnpm build
pnpm deploy
```

## Use Cases

- **Navigation & GPS**: Convert coordinates between different formats for GPS devices
- **Mapping Applications**: Calculate distances and bearings for mapping software
- **Surveying**: Professional surveying and geographic information systems (GIS)
- **Travel Planning**: Calculate distances between destinations
- **Education**: Learn about geographic coordinate systems and calculations

## Project Structure

```
lnl-calc/
├── src/
│   ├── components/
│   │   └── calculator.ts          # Main lat/lng calculator component
│   ├── main.ts                    # Application entry point
│   └── simple.test.js             # Basic tests
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions workflow
├── index.html                     # Main HTML file
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── ava.config.mjs                 # AVA test configuration
└── package.json                   # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## License

This project is licensed under the Apache-2.0 License. 