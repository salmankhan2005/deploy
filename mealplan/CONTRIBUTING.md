# 🤝 Contributing to Meal Plan Pro

Thank you for your interest in contributing to Meal Plan Pro! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Security Considerations](#security-considerations)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- Git
- Android Studio (for mobile development)
- Java JDK v11 or higher

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/mealplan.git
cd mealplan

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/mealplan.git
```

## 🔧 Development Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Mobile Development Setup
```bash
# Build and sync with Capacitor
npm run cap:build

# Open Android Studio
npm run cap:android
```

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Mobile
npm run cap:build       # Build and sync with Capacitor
npm run cap:android     # Open Android Studio

# Quality & Security
npm run lint            # Run ESLint
npm run security:audit  # Security audit
npm run security:fix    # Fix security issues
```

## 📝 Contributing Guidelines

### Types of Contributions

#### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide system information
- Include screenshots if applicable

#### ✨ Feature Requests
- Use the feature request template
- Explain the use case and benefits
- Consider implementation complexity
- Discuss with maintainers first for major features

#### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Test improvements

### Before You Start
1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open an issue for discussion
3. **Follow coding standards** - Maintain code consistency
4. **Write tests** - Ensure code quality
5. **Update documentation** - Keep docs current

## 🔄 Pull Request Process

### 1. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes
- Follow coding standards
- Write clear commit messages
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run linting
npm run lint

# Build the project
npm run build

# Test mobile build (if applicable)
npm run cap:build

# Run security audit
npm run security:audit
```

### 4. Commit Changes
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add text-to-speech functionality for recipes"

# Or for bug fixes
git commit -m "fix: resolve shopping list item duplication issue"
```

### 5. Push and Create PR
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### 6. PR Requirements
- [ ] Clear description of changes
- [ ] Link to related issues
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Security considerations addressed

## 💻 Coding Standards

### TypeScript Guidelines
```typescript
// Use explicit types
interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
}

// Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}

// Use meaningful variable names
const isUserAuthenticated = checkAuthStatus();
const recipeIngredients = recipe.ingredients;
```

### React Component Guidelines
```typescript
// Use functional components with hooks
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSave = useCallback(() => {
    onSave(recipe.id);
    setIsSaved(true);
  }, [recipe.id, onSave]);

  return (
    <Card>
      <h3>{recipe.name}</h3>
      <Button onClick={handleSave}>
        {isSaved ? 'Saved' : 'Save Recipe'}
      </Button>
    </Card>
  );
};
```

### CSS/Styling Guidelines
```css
/* Use Tailwind CSS classes */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Recipe Title</h2>
  <Button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Save
  </Button>
</div>
```

### File Organization
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── feature/         # Feature-specific components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── contexts/            # React contexts
├── services/            # API services
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

## 🧪 Testing Guidelines

### Component Testing
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from './RecipeCard';

describe('RecipeCard', () => {
  const mockRecipe = {
    id: 1,
    name: 'Test Recipe',
    ingredients: ['ingredient1', 'ingredient2']
  };

  it('renders recipe name', () => {
    render(<RecipeCard recipe={mockRecipe} onSave={jest.fn()} />);
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<RecipeCard recipe={mockRecipe} onSave={mockOnSave} />);
    
    fireEvent.click(screen.getByText('Save Recipe'));
    expect(mockOnSave).toHaveBeenCalledWith(1);
  });
});
```

### Mobile Testing
- Test on Android emulator
- Test on physical devices
- Verify TTS functionality
- Check touch interactions
- Test offline capabilities

## 🔒 Security Considerations

### Input Validation
```typescript
import { sanitizeInput } from '@/utils/security';

// Always sanitize user input
const handleUserInput = (input: string) => {
  const sanitizedInput = sanitizeInput(input);
  // Process sanitized input
};
```

### API Security
```typescript
// Use proper authentication headers
const apiCall = async (endpoint: string, data: any) => {
  const token = getAuthToken();
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('API call failed');
  }
  
  return response.json();
};
```

### Error Handling
```typescript
// Use secure error messages
const handleError = (error: Error) => {
  // Log detailed error for debugging
  console.error('Detailed error:', error);
  
  // Show user-friendly message
  toast.error('Something went wrong. Please try again.');
};
```

## 📚 Documentation

### Code Documentation
```typescript
/**
 * Calculates the total cooking time for a recipe
 * @param recipe - The recipe object containing time information
 * @param servings - Number of servings to adjust for
 * @returns Total cooking time in minutes
 */
export const calculateCookingTime = (recipe: Recipe, servings: number): number => {
  // Implementation
};
```

### README Updates
- Update feature lists
- Add new configuration options
- Update installation instructions
- Add troubleshooting information

## 🏷️ Commit Message Guidelines

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(tts): add text-to-speech functionality for recipes
fix(shopping): resolve item duplication in shopping lists
docs(api): update API documentation with new endpoints
style(components): improve button component styling
refactor(auth): simplify authentication logic
test(recipes): add unit tests for recipe service
chore(deps): update dependencies to latest versions
```

## 🚀 Release Process

### Version Numbering
- Follow [Semantic Versioning](https://semver.org/)
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes (backwards compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Security audit clean
- [ ] Mobile build successful
- [ ] Changelog updated
- [ ] Version bumped

## 🆘 Getting Help

### Resources
- **Documentation**: Check existing docs first
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord (if available)

### Asking Questions
1. Search existing issues and discussions
2. Provide clear problem description
3. Include relevant code snippets
4. Specify your environment (OS, Node version, etc.)
5. Include steps to reproduce

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Meal Plan Pro! 🍽️