# Fretio Component Library

## Overview

This document provides comprehensive documentation for all React components in the Fretio application. The component library is built using shadcn/ui with Radix UI primitives and follows consistent design patterns.

## Table of Contents

- [UI Components](#ui-components)
- [Business Components](#business-components)
- [Layout Components](#layout-components)
- [Form Components](#form-components)
- [Navigation Components](#navigation-components)
- [Utility Components](#utility-components)
- [Component Guidelines](#component-guidelines)

## UI Components

### Button
**Location**: `src/components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

**Props**:
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "sm" | "default" | "lg" | "icon"
- `disabled`: boolean
- `onClick`: () => void

### Input
**Location**: `src/components/ui/input.tsx`

A styled input component for form fields.

```tsx
import { Input } from "@/components/ui/input";

<Input 
  type="text" 
  placeholder="Enter text..." 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props**:
- `type`: HTML input types
- `placeholder`: string
- `value`: string
- `onChange`: (e: ChangeEvent) => void
- `disabled`: boolean
- `className`: string

### Card
**Location**: `src/components/ui/card.tsx`

A container component for grouping related content.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Card footer content</p>
  </CardFooter>
</Card>
```

### Dialog
**Location**: `src/components/ui/dialog.tsx`

A modal dialog component for overlays and popups.

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Toast
**Location**: `src/components/ui/toaster.tsx` and `src/components/ui/sonner.tsx`

Notification components for user feedback.

```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// Basic toast
toast({
  title: "Success",
  description: "Operation completed successfully",
});

// Destructive toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong",
});
```

## Business Components

### ProductCard
**Location**: `src/components/ProductCard.tsx`

Displays product information in a card format.

```tsx
import ProductCard from "@/components/ProductCard";

<ProductCard
  id="product-1"
  title="Gaming Laptop"
  price={35000}
  condition="good"
  images={["image1.jpg", "image2.jpg"]}
  seller={{
    name: "John Doe",
    room: "A-204",
    rating: 4.8
  }}
  category="Electronics"
  timeAgo="2h ago"
  views={23}
  isForRent={false}
  rentPricePerDay={undefined}
/>
```

**Props**:
- `id`: string - Unique product identifier
- `title`: string - Product name
- `price`: number - Selling price
- `condition`: "new" | "like-new" | "good" | "fair"
- `images`: string[] - Array of image URLs
- `seller`: SellerInfo - Seller details
- `category`: string - Product category
- `timeAgo`: string - Time since listing
- `views`: number - View count
- `isForRent`: boolean - Whether available for rent
- `rentPricePerDay`: number | undefined - Daily rental price

### CategoryGrid
**Location**: `src/components/CategoryGrid.tsx`

Displays product categories in a grid layout.

```tsx
import CategoryGrid from "@/components/CategoryGrid";

<CategoryGrid />
```

**Features**:
- Responsive grid layout
- Clickable category cards
- Navigation to filtered marketplace
- Category-specific icons and colors

### Header
**Location**: `src/components/Header.tsx`

Main navigation header component.

```tsx
import Header from "@/components/Header";

<Header />
```

**Features**:
- Logo and branding
- Navigation menu
- User authentication state
- Theme toggle
- Mobile responsive

### HeroSection
**Location**: `src/components/HeroSection.tsx`

Landing page hero section with call-to-action.

```tsx
import HeroSection from "@/components/HeroSection";

<HeroSection />
```

**Features**:
- Compelling headline and description
- Call-to-action buttons
- Background graphics
- Responsive design

## Layout Components

### Footer
**Location**: `src/components/Footer.tsx`

Application footer with links and information.

```tsx
import Footer from "@/components/Footer";

<Footer />
```

**Features**:
- Company information
- Quick links
- Social media links
- Copyright notice

### MobileNavigation
**Location**: `src/components/MobileNavigation.tsx`

Bottom navigation bar for mobile devices.

```tsx
import MobileNavigation from "@/components/MobileNavigation";

<MobileNavigation />
```

**Features**:
- Bottom tab navigation
- Active state indicators
- Notification badges
- Floating action button

### ScrollToTopButton
**Location**: `src/components/ScrollToTopButton.tsx`

Floating button to scroll to top of page.

```tsx
import ScrollToTopButton from "@/components/ScrollToTopButton";

<ScrollToTopButton />
```

**Features**:
- Appears on scroll
- Smooth scroll animation
- Customizable visibility threshold

## Form Components

### CreateProduct
**Location**: `src/pages/CreateProduct.tsx`

Form for creating new product listings.

```tsx
import CreateProduct from "@/pages/CreateProduct";

<CreateProduct />
```

**Features**:
- Multi-step form
- Image upload with compression
- Form validation
- Preview functionality
- Category selection

### CompleteProfile
**Location**: `src/pages/CompleteProfile.tsx`

Form for completing user profile setup.

```tsx
import CompleteProfile from "@/pages/CompleteProfile";

<CompleteProfile />
```

**Features**:
- Personal information form
- Document upload
- University/hostel selection
- Verification process

## Navigation Components

### ProtectedRoute
**Location**: `src/components/ProtectedRoute.tsx`

Route wrapper for authentication protection.

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<ProtectedRoute requireVerified>
  <AdminDashboard />
</ProtectedRoute>
```

**Props**:
- `children`: ReactNode - Protected content
- `requireVerified`: boolean - Require verified profile

### ThemeToggle
**Location**: `src/components/ThemeToggle.tsx`

Theme switching component.

```tsx
import ThemeToggle from "@/components/ThemeToggle";

<ThemeToggle />
```

**Features**:
- Light/Dark/System theme options
- Smooth transitions
- Persistent preference

## Utility Components

### LazyImage
**Location**: `src/components/LazyImage.tsx`

Lazy loading image component.

```tsx
import LazyImage from "@/components/LazyImage";

<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-full"
  fallback="/placeholder.jpg"
/>
```

**Props**:
- `src`: string - Image source URL
- `alt`: string - Alt text
- `className`: string - CSS classes
- `fallback`: string - Fallback image URL

### ResponsiveImage
**Location**: `src/components/ResponsiveImage.tsx`

Responsive image with WebP support.

```tsx
import ResponsiveImage from "@/components/ResponsiveImage";

<ResponsiveImage
  src="/path/to/image.jpg"
  alt="Description"
  sizes="(max-width: 640px) 100vw, 50vw"
  aspectRatio="square"
/>
```

**Props**:
- `src`: string - Image source URL
- `alt`: string - Alt text
- `sizes`: string - Responsive sizes
- `aspectRatio`: "square" | "video" | "portrait" | "landscape"

### TouchOptimizedProductCard
**Location**: `src/components/TouchOptimizedProductCard.tsx`

Mobile-optimized product card with touch gestures.

```tsx
import TouchOptimizedProductCard from "@/components/TouchOptimizedProductCard";

<TouchOptimizedProductCard
  {...productData}
  className="w-full"
/>
```

**Features**:
- Swipe gestures
- Touch feedback
- Mobile-optimized layout
- Accessibility support

## Component Guidelines

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard`)
- **Files**: PascalCase for components (e.g., `ProductCard.tsx`)
- **Props**: camelCase (e.g., `isForRent`)
- **CSS Classes**: kebab-case (e.g., `product-card`)

### File Structure

```
src/components/
├── ui/                 # shadcn/ui components
├── ProductCard.tsx     # Business components
├── Header.tsx          # Layout components
└── ...
```

### Props Interface

Always define TypeScript interfaces for component props:

```tsx
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  // ... other props
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, ... }) => {
  // component implementation
};
```

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the design system
- Ensure responsive design
- Support dark mode
- Maintain accessibility

### Accessibility

- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Support screen readers

### Performance

- Use React.memo for expensive components
- Implement lazy loading where appropriate
- Optimize images and assets
- Minimize re-renders
- Use proper key props

### Testing

- Write unit tests for components
- Test user interactions
- Verify accessibility
- Test responsive behavior
- Mock external dependencies

## Component Examples

### Custom Hook Usage

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MyComponent = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Success",
      description: "Action completed",
    });
  };
  
  return (
    <div>
      <p>Welcome, {profile?.full_name}</p>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
};
```

### Form Integration

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be positive"),
});

const ProductForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("title")}
        placeholder="Product title"
      />
      {errors.title && <p>{errors.title.message}</p>}
      
      <Input
        {...register("price", { valueAsNumber: true })}
        type="number"
        placeholder="Price"
      />
      {errors.price && <p>{errors.price.message}</p>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

## Contributing

When adding new components:

1. Follow the established patterns
2. Include TypeScript interfaces
3. Add proper documentation
4. Write tests
5. Ensure accessibility
6. Update this documentation

---

*Last updated: January 2025*
*Version: 1.0.0*
