# Coding Standards

This document outlines the coding standards and best practices for contributing to this monorepo.
These standards ensure consistency, maintainability, and quality across our TypeScript, React 19,
React Router v7, NestJS, and Tailwind CSS v4 codebase.

## Table of Contents

- [General Guidelines](#general-guidelines)
- [TypeScript Coding Standards](#typescript-coding-standards)
- [React 19 Specific Guidelines](#react-19-specific-guidelines)
- [React Router v7 Guidelines](#react-router-v7-guidelines)
- [NestJS Specific Guidelines](#nestjs-specific-guidelines)
- [Tailwind CSS Guidelines](#tailwind-css-guidelines)
- [File Organization](#file-organization)
- [Testing Standards](#testing-standards)
- [Code Review Guidelines](#code-review-guidelines)

## General Guidelines

### Code Quality Principles

- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns within the codebase
- **Performance**: Write efficient code that scales
- **Type Safety**: Leverage TypeScript's type system fully
- **Maintainability**: Write code that is easy to modify and extend

### Formatting and Linting

- Use **Biome** for code formatting and linting
- Run `npm run check` before committing
- All code must pass type checking: `npm run check-types`
- Follow the configured Biome rules (see `biome.json`)

### Comments and Documentation

```typescript
// Good: Explain WHY, not WHAT
// Debounce API calls to prevent rate limiting
const debouncedSearch = useDebouncedCallback(search, 300);

// Bad: Explaining obvious code
// Set the user name to the provided name
setUserName(name);
```

### Version Control

- Follow our [Commit Message Guidelines](./commit-message-guidelines.md)
- Use conventional commits with proper scopes: `feat(api):`, `fix(web):`, `docs(readme):`, etc.
- Keep commits atomic and focused
- Write descriptive commit messages that explain what and why

## TypeScript Coding Standards

### Type Definitions

```typescript
// Good: Use specific types
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  roles: readonly UserRole[];
}

// Bad: Use any or overly generic types
interface User {
  id: any;
  data: object;
}
```

### Type Imports

```typescript
// Good: Use type-only imports when appropriate
import type { User } from './types';
import { fetchUser } from './api';

// Exception: When used at runtime (e.g., NestJS decorators)
import { User } from './entities/user.entity';
```

### Function Declarations

```typescript
// Good: Use function expressions for better hoisting control
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Good: Use function declarations for main exported functions
export function createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
}
```

### Error Handling

```typescript
// Good: Use typed errors
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Good: Handle errors explicitly
try {
  const user = await createUser(userData);
  return { success: true, data: user };
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: error.message };
  }
  throw error; // Re-throw unexpected errors
}
```

### Utility Types

```typescript
// Good: Use TypeScript utility types
type PartialUser = Partial<User>;
type UserUpdate = Pick<User, 'name' | 'email'>;
type UserResponse = Omit<User, 'password'>;

// Good: Create reusable utility types
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

## React 19 Specific Guidelines

### Component Structure

```tsx
// Good: Functional components with proper typing
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  
  // Implementation
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Form Management with useActionState (Preferred)

```tsx
// Good: Use React 19's useActionState for automatic form state management
import { useActionState } from 'react';

interface FormState {
  success: boolean;
  error: string | null;
  data?: unknown;
}

async function createItemAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const result = await itemsApi.createItem({ name, description });
    return { success: true, error: null, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create item' 
    };
  }
}

function ItemForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState(createItemAction, {
    success: false,
    error: null,
  });

  React.useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <input name="name" required className="w-full p-2 border rounded" />
      <textarea name="description" className="w-full p-2 border rounded" />
      <SubmitButton />
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

### Form Status with useFormStatus (Preferred)

```tsx
// Good: Use useFormStatus for form status without prop drilling
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Item'}
    </button>
  );
}

// Good: Reusable form status indicator
function FormStatusIndicator() {
  const { pending, data } = useFormStatus();
  
  if (!pending) return null;
  
  return (
    <div className="flex items-center text-blue-600">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
      Processing...
    </div>
  );
}
```

### Optimistic Updates with useOptimistic (Preferred)

```tsx
// Good: Use useOptimistic for immediate UI feedback
import { useOptimistic, useTransition } from 'react';

type OptimisticAction = { type: 'delete'; itemId: string };

function optimisticReducer(items: Item[], action: OptimisticAction): Item[] {
  switch (action.type) {
    case 'delete':
      return items.filter((item) => item.id !== action.itemId);
    default:
      return items;
  }
}

function ItemsList({ initialItems }: { initialItems: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, addOptimistic] = useOptimistic(initialItems, optimisticReducer);

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;

    // Immediately update UI
    addOptimistic({ type: 'delete', itemId: item.id });

    // Perform actual deletion
    startTransition(async () => {
      try {
        await itemsApi.deleteItem(item.id);
        // Success - optimistic update persists
      } catch (error) {
        console.error('Delete failed:', error);
        // Error - optimistic update automatically reverts
      }
    });
  };

  return (
    <div className="space-y-4">
      {optimisticItems.map((item) => (
        <div 
          key={item.id}
          className={`p-4 bg-gray-50 rounded-lg ${isPending ? 'opacity-60' : 'opacity-100'}`}
        >
          <h3 className="font-semibold">{item.name}</h3>
          <button onClick={() => handleDelete(item)} className="text-red-600">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Enhanced Error Boundaries (Preferred)

```tsx
// Good: Enhanced error boundary with React 19 patterns
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  RENDER = 'render',
  UNKNOWN = 'unknown',
}

function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();
  if (message.includes('fetch') || message.includes('network')) {
    return ErrorCategory.NETWORK;
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorCategory.VALIDATION;
  }
  return ErrorCategory.UNKNOWN;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  // Enhanced error boundary implementation with:
  // - Error categorization for better user messages
  // - Auto-retry mechanisms for network errors
  // - Error logging with unique IDs
  // - Smart recovery strategies per error type
  
  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const category = categorizeError(error);
    console.group('🚨 Error Boundary');
    console.error('Error:', error);
    console.error('Category:', category);
    console.groupEnd();
    
    this.props.onError?.(error, errorInfo);
  }

  // ... implementation details
}
```

### Custom Hooks for React 19 Patterns (Preferred)

```tsx
// Good: Reusable async action hook
interface AsyncActionState<T = unknown> {
  isPending: boolean;
  error: string | null;
  data: T | null;
}

export function useAsyncAction<T = unknown>() {
  const [state, setState] = useState<AsyncActionState<T>>({
    isPending: false,
    error: null,
    data: null,
  });
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, isPending: true, error: null }));
    
    startTransition(async () => {
      try {
        const result = await asyncFn();
        setState({ isPending: false, error: null, data: result });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState({ isPending: false, error: errorMessage, data: null });
        throw error;
      }
    });
  }, []);

  return {
    state: { ...state, isPending: isPending || state.isPending },
    execute,
  };
}
```

### Error Handling with React 19

```tsx
// Good: Comprehensive error handling strategy
function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Global error tracking
        console.group('🚨 Global Error');
        console.error('Error:', error);
        console.error('Info:', errorInfo);
        console.groupEnd();
      }}
      resetOnPropsChange={true}
    >
      <Routes />
    </ErrorBoundary>
  );
}

// Good: Component-level error boundaries for granular handling
function UserSection() {
  return (
    <ErrorBoundary resetKeys={[userId]} fallback={<UserSectionError />}>
      <UserProfile />
    </ErrorBoundary>
  );
}
```

### State Management with React 19

```tsx
// Good: Use useReducer for complex state with React 19 patterns
interface AppState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'OPTIMISTIC_ADD'; payload: Item }
  | { type: 'OPTIMISTIC_REMOVE'; payload: string };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'OPTIMISTIC_ADD':
      return { ...state, items: [...state.items, action.payload] };
    case 'OPTIMISTIC_REMOVE':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
}
```

## React Router v7 Guidelines

### Route Definitions

```typescript
// Good: Use the new route() API for type-safe routing
import { route } from '@react-router/dev/routes';

export default [
  route('/', './routes/home.tsx'),
  route('/users/:id', './routes/user.tsx'),
  route('/api/users', './routes/api/users.tsx'),
];
```

### Loaders and Actions

```typescript
// Good: Properly typed loaders
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id;
  if (!userId) {
    throw new Response('User ID required', { status: 400 });
  }
  
  const user = await fetchUser(userId);
  if (!user) {
    throw new Response('User not found', { status: 404 });
  }
  
  return { user };
}

// Good: Properly typed actions
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);
  
  try {
    const user = await createUser(userData);
    return redirect(`/users/${user.id}`);
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

### Data Fetching

```tsx
// Good: Use useLoaderData with proper typing
import { useLoaderData } from 'react-router';

export default function UserPage() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Navigation

```tsx
// Good: Use declarative navigation
import { NavLink, useNavigate } from 'react-router';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/users" 
        className={({ isActive }) => 
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
        }
      >
        Users
      </NavLink>
    </nav>
  );
}

// Good: Programmatic navigation
function CreateUserForm() {
  const navigate = useNavigate();
  
  const handleSuccess = (user: User) => {
    navigate(`/users/${user.id}`, { replace: true });
  };
  
  // Implementation
}
```

## NestJS Specific Guidelines

### Module Structure

```typescript
// Good: Well-structured modules
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: 'USER_CACHE',
      useClass: RedisUserCache,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
```

### Controllers

```typescript
// Good: RESTful controller with proper decorators
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserDto] })
  async findAll(
    @Query() query: GetUsersDto,
  ): Promise<UserDto[]> {
    return this.userService.findAll(query);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    return this.userService.create(createUserDto);
  }
}
```

### Services

```typescript
// Good: Service with proper error handling
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}
  
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new BadRequestException('Failed to create user');
    }
  }
}
```

### DTOs and Validation

```typescript
// Good: Comprehensive DTOs with validation
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;
  
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  email: string;
  
  @ApiPropertyOptional({ description: 'User role', example: 'user' })
  @IsOptional()
  @IsString()
  role?: string;
}
```

### Guards and Interceptors

```typescript
// Good: Custom guard with proper typing
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  }
}
```

## Tailwind CSS Guidelines

### Utility Classes

```tsx
// Good: Use semantic utility classes
<div className="flex items-center justify-between p-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
    Action
  </button>
</div>

// Bad: Inline styles or overly complex classes
<div className="flex items-center justify-between p-6" style={{ backgroundColor: '#fff' }}>
```

### Responsive Design

```tsx
// Good: Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg md:text-xl font-semibold">Card Title</h3>
    <p className="text-sm md:text-base text-gray-600 mt-2">Description</p>
  </div>
</div>
```

### Custom Components

```tsx
// Good: Extract reusable component patterns
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
} as const;

interface ButtonProps {
  variant?: keyof typeof buttonVariants;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${buttonVariants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Better: Use tailwind-variants for complex components (see Styling Guidelines)
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'px-4 py-2 rounded-md font-medium transition-colors',
  variants: {
    variant: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
```

### Dark Mode Support

```tsx
// Good: Use dark mode utilities
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
  <p className="text-gray-600 dark:text-gray-300">
    Description
  </p>
</div>
```

## File Organization

### Project Structure

```text
apps/
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   └── user/
│   │   │       ├── user.controller.ts
│   │   │       ├── user.service.ts
│   │   │       ├── user.module.ts
│   │   │       ├── dto/
│   │   │       └── entities/
│   │   ├── common/         # Shared utilities
│   │   └── main.ts
│   └── test/
└── web/                    # React Router frontend
    ├── app/
    │   ├── routes/         # Route components
    │   ├── components/     # Shared components
    │   ├── hooks/          # Custom hooks
    │   ├── utils/          # Utility functions
    │   └── types/          # Type definitions
    └── public/
```

### Naming Conventions

```typescript
// Files: kebab-case
user-profile.component.tsx
user-service.ts
create-user.dto.ts

// Components: PascalCase
export function UserProfile() {}
export class CreateUserDto {}

// Variables/Functions: camelCase
const userName = 'John';
function fetchUserData() {}

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Types/Interfaces: PascalCase
interface UserData {}
type ApiResponse<T> = {};
```

## Testing Standards

### Unit Tests

```typescript
// Good: Comprehensive unit tests
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    
    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  
  describe('findById', () => {
    it('should return user when found', async () => {
      const user = { id: '1', name: 'John' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      
      const result = await service.findById('1');
      
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
    
    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Component Tests

```tsx
// Good: React component tests
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };
  
  it('should render user information', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('should call onUpdate when edit button is clicked', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

## Code Review Guidelines

### What to Look For

1. **Type Safety**: Ensure proper TypeScript usage
2. **Performance**: Check for unnecessary re-renders, inefficient queries
3. **Security**: Validate input sanitization, authentication
4. **Accessibility**: Ensure proper ARIA labels, keyboard navigation
5. **Error Handling**: Verify proper error boundaries and handling
6. **Testing**: Ensure adequate test coverage

### Review Checklist

- [ ] Code follows established patterns
- [ ] Type annotations are appropriate
- [ ] Error handling is comprehensive
- [ ] Performance implications considered
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] Accessibility requirements met
- [ ] Security considerations addressed

### Pull Request Requirements

- All tests must pass
- Code coverage should not decrease
- Linting and formatting checks must pass
- At least one approval from a maintainer
- All conversations must be resolved

---

## Enforcement

These standards are enforced through:

- **Biome**: Automated formatting and linting
- **TypeScript**: Type checking
- **Automated Tests**: Unit and integration tests
- **Code Reviews**: Manual review process
- **CI/CD Pipeline**: Automated quality checks

Remember: These standards exist to improve code quality and team productivity.
When in doubt, prioritize readability and maintainability.
