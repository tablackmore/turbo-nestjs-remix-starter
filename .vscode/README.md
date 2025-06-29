# VS Code Configuration

This directory contains VS Code-specific configuration files that enhance the development experience.

## Files Overview

### `settings.json` - Workspace Settings

Configures VS Code to work optimally with our tech stack:

- **Biome integration** for formatting and linting
- **TypeScript preferences** (single quotes, auto imports)
- **Tailwind CSS** IntelliSense with custom class regex
- **File associations** and nesting patterns
- **Performance optimizations** for the monorepo

### `extensions.json` - Recommended Extensions

Essential extensions for contributors:

- **Biome** - Primary formatter and linter
- **Tailwind CSS IntelliSense** - Autocomplete for classes
- **TypeScript support** - Enhanced TS features
- **Git integration** - Better Git workflow
- **Productivity tools** - Error lens, TODO tree, etc.

⚠️ **Important**: Install the recommended extensions when VS Code prompts you.

### `tasks.json` - Build Tasks

Pre-configured tasks accessible via `Ctrl+Shift+P` → "Tasks: Run Task":

- `dev: Start Development Servers` - Runs `npm run dev`
- `build: Build All Packages` - Runs `npm run build`
- `check: Format & Lint with Biome` - Runs `npm run check`
- `check-types: TypeScript Type Check` - Runs `npm run check-types`
- `quality-check: Full Quality Check` - Runs all quality checks

### `launch.json` - Debug Configurations

Debug configurations for:

- **NestJS API** debugging
- **Current TypeScript file** debugging
- **Jest tests** debugging
- **Attach to running Node process**

## Quick Setup

1. **Open the project** in VS Code
2. **Install recommended extensions** when prompted
3. **Restart VS Code** to apply all settings
4. **Start developing** with consistent formatting and linting

## Key Features

### Automatic Formatting

- **Format on save** enabled for all supported files
- **Import organization** on save
- **Biome** handles all formatting (no Prettier/ESLint conflicts)

### TypeScript Integration

- **Single quotes** preference
- **Auto imports** from workspace packages
- **Type hints** for function returns and literals
- **Monorepo-aware** symbol search

### Tailwind CSS Support

- **Class autocompletion** with custom patterns
- **Supports tailwind-variants** (`tv()` function)
- **Class name utility** (`cn()` function) recognition

### Performance Optimizations

- **File watchers** exclude build/dist directories
- **Search exclusions** for faster search
- **File nesting** for cleaner explorer

## Troubleshooting

### Extensions Not Working

1. Ensure all recommended extensions are installed
2. Restart VS Code completely
3. Check the output panel for any error messages

### Formatting Issues

1. Verify Biome is set as the default formatter
2. Check if conflicting formatters (Prettier/ESLint) are disabled
3. Run `npm run check` manually to test Biome

### TypeScript Errors

1. Ensure TypeScript SDK is using workspace version
2. Reload TypeScript: `Ctrl+Shift+P` → "TypeScript: Reload Projects"
3. Check `tsconfig.json` files are valid

### Tailwind IntelliSense Not Working

1. Verify `tailwind.config.ts` is properly configured
2. Check file associations in settings
3. Restart the Tailwind CSS Language Server

## Contributing

When adding new configuration:

1. Document the purpose in this README
2. Ensure compatibility with the team's workflow
3. Test with a fresh VS Code installation
4. Follow our [coding standards](../contributing-docs/coding-standards.md)
