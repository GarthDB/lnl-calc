# Latitude & Longitude Calculator

[![CI/CD Pipeline](https://github.com/garthdb/lnl-calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/garthdb/lnl-calc/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://garthdb.github.io/lnl-calc/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=check)](https://github.com/garthdb/lnl-calc/actions)

A modern geographic coordinate calculator web application built with Lit, Spectrum Web Components, and TypeScript.

## Features

- **Coordinate Conversions**: Convert between decimal degrees, degrees/minutes/seconds (DMS), and other formats
- **Distance Calculations**: Calculate distances between two geographic points using the Haversine formula
- **Bearing Calculations**: Determine the bearing/heading between coordinates
- **Midpoint Calculations**: Find the center point between two coordinates
- **Coordinate Validation**: Validate latitude and longitude inputs with proper range checking
- Clean, modern UI using Adobe's Spectrum Design System
- Responsive design for desktop and mobile use
- Web Components architecture with Lit
- TypeScript support with strict type checking
- Comprehensive testing with AVA
- Automatic CI/CD deployment to GitHub Pages
- Conventional commit enforcement with Husky and Commitlint

## Supported Coordinate Formats

The calculator accepts coordinates in multiple common formats:

### 📍 **Decimal Degrees (DD)**
- **Space separated**: `37.7749° N 122.4194° W`
- **Comma separated**: `36.1716° N, 115.1391° W` 
- **With signs**: `+37.7749, -122.4194`
- **Plain format**: `37.7749 -122.4194`

### 📍 **Degrees Decimal Minutes (DDM)**
- `37° 46.494' N 122° 25.164' W`
- Common in marine navigation and aviation

### 📍 **Degrees Minutes Seconds (DMS)**
- `37° 46' 29.64" N 122° 25' 9.84" W`
- Traditional format used on most maps

**Auto-Detection**: The calculator automatically detects which format you're using and parses accordingly. Simply type coordinates in any supported format!

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

The project features **automatic deployment to GitHub Pages** via GitHub Actions:

#### 🔄 **Automatic Deployment**
- **Trigger**: When PRs are merged into `main` branch
- **Process**: 
  1. Runs tests and builds the application
  2. Deploys to GitHub Pages automatically
  3. Updates live site at: https://garthdb.github.io/lnl-calc/

#### 🚀 **CI/CD Pipeline**
- **Pull Requests**: Runs tests and builds to validate changes
- **Main Branch**: Runs tests, builds, and deploys to production
- **Status**: Check the badges above for current build status

#### 📦 **Manual Deployment** (if needed)
```bash
pnpm build
pnpm deploy
```

#### 🔍 **Workflow Details**
- **Tests**: Must pass before deployment
- **Build**: Optimized production build with Vite
- **Artifacts**: Build artifacts are cached between jobs
- **Concurrency**: Only one deployment runs at a time
- **Environment**: Deploys to `github-pages` environment

#### 🛡️ **Branch Protection**
- **Direct pushes blocked**: All changes must come through PRs
- **Required status checks**: `test` job must pass
- **Required reviews**: Minimum 1 approving review
- **Admin enforcement**: Even admins must follow the rules
- **Force pushes disabled**: Prevents destructive changes
- **Branch deletions disabled**: Protects main branch integrity

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

**🛡️ Branch Protection**: The `main` branch is protected and requires all changes to go through pull requests with passing status checks.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes using conventional commits (see below)
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request
8. **Ensure CI passes**: The `test` job must pass before merging
9. **Get approval**: At least 1 approving review required
10. **Merge**: Only through PR merge (direct pushes to `main` are blocked)

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages are automatically validated using Commitlint and Husky.

**Format**: `<type>[optional scope]: <description>`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Examples:**
```bash
feat: add distance calculation using Haversine formula
fix: correct coordinate validation for edge cases
docs: update README with installation instructions
test: add unit tests for bearing calculations
chore: add husky and commitlint configuration
```

**Rules:**
- Type is required and must be lowercase
- Description is required and should be lowercase
- Maximum header length: 100 characters
- Use present tense ("add" not "added")
- Don't end with a period

## License

This project is licensed under the Apache-2.0 License. 