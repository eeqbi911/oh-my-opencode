---
name: frontend-patterns
description: Frontend development patterns for React, Next.js, Vue, and Svelte including component architecture, state management, and performance optimization.
origin: oh-my-opencode
---

# Frontend Patterns Skill

## When to Activate

- Creating new UI components
- Setting up state management
- Performance optimization
- Building with React/Next.js/Vue/Svelte
- CSS/styling decisions

## Component Architecture

### Single Responsibility

```typescript
// ✅ Good: Focused component
function UserAvatar({ userId }: { userId: string }) {
  const { data: user } = useUser(userId)
  if (!user) return <Skeleton />
  return <img src={user.avatarUrl} alt={user.name} />
}

// ❌ Bad: Does too much
function UserCard({ userId }: { userId: string }) {
  // Fetches user, displays avatar, name, bio, posts, comments...
}
```

### Compound Components

```typescript
// ✅ Good: Related components
function Select({ children, value, onChange }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  )
}

Select.Option = function Option({ value, children }) {
  const { value: selected, onChange } = useContext(SelectContext)
  return (
    <div 
      className={selected === value ? 'selected' : ''}
      onClick={() => onChange(value)}
    >
      {children}
    </div>
  )
}

// Usage
<Select value={theme} onChange={setTheme}>
  <Select.Option value="light">Light</Select.Option>
  <Select.Option value="dark">Dark</Select.Option>
</Select>
```

## State Management

### Local vs Global State

```typescript
// Local state: Component-specific
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// Shared state: Context or store
const CartContext = createContext()

function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const addItem = (item) => setItems(i => [...i, item])
  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  )
}
```

### URL State

```typescript
// URL params for shareable state
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'
  
  return (
    <select 
      value={category}
      onChange={(e) => setSearchParams({ category: e.target.value })}
    >
      <option value="all">All</option>
      <option value="electronics">Electronics</option>
    </select>
  )
}
```

## Performance Patterns

### Lazy Loading

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Memoization

```typescript
// Expensive computations
const sortedData = useMemo(() => {
  return expensiveSort(data)
}, [data])

// Stable callbacks
const handleClick = useCallback((id) => {
  doSomething(id)
}, [doSomething])

// Memoized components
const ListItem = memo(({ item, onSelect }) => (
  <div onClick={() => onSelect(item.id)}>{item.name}</div>
))
```

### Virtualization

```typescript
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  )
}
```

## Data Fetching

### SWR Pattern

```typescript
function useUser(userId: string) {
  return useSWR(userId ? `/api/users/${userId}` : null, 
    fetcher,
    { revalidateOnFocus: false }
  )
}

// Usage
function UserProfile({ userId }) {
  const { data: user, error, isLoading } = useUser(userId)
  
  if (error) return <Error error={error} />
  if (isLoading) return <Skeleton />
  return <div>{user.name}</div>
}
```

### React Query Pattern

```typescript
const { data: user, isPending } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

## CSS Architecture

### CSS Modules

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
}

.primary {
  background: blue;
  color: white;
}
```

```tsx
import styles from './Button.module.css'

export function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  )
}
```

### Tailwind Utility Classes

```tsx
// ✅ Good: Composable utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ❌ Bad: Inline styles mixed
<div style={{ display: 'flex' }} className="p-4">
```

## Error Boundaries

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, info) {
    logError(error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackUI />
    }
    return this.props.children
  }
}
```

## Accessibility

### ARIA Labels

```tsx
// ❌ Bad: No accessible name
<button>X</button>

// ✅ Good: Descriptive
<button aria-label="Close dialog">
  <CloseIcon />
</button>
```

### Keyboard Navigation

```tsx
<div 
  role="listbox"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') selectFocused()
    if (e.key === 'ArrowDown') focusNext()
    if (e.key === 'ArrowUp') focusPrev()
  }}
>
  {options.map(option => (
    <div role="option" key={option.id}>{option.label}</div>
  ))}
</div>
```
