# API Documentation

## Overview

Fretio uses Supabase as the backend, providing a RESTful API through PostgreSQL functions and real-time subscriptions.

## Authentication

All API requests require authentication via Supabase Auth JWT tokens.

```javascript
// Authentication header
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Products

#### Get Products
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
```

#### Get Product by ID
```javascript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    category:categories(*),
    seller:profiles(*)
  `)
  .eq('id', productId)
  .single();
```

#### Create Product
```javascript
const { data, error } = await supabase
  .from('products')
  .insert({
    title: 'Product Name',
    description: 'Product description',
    price: 99.99,
    category_id: 'category-uuid',
    condition: 'new',
    status: 'published',
    seller_id: userId
  });
```

#### Update Product
```javascript
const { data, error } = await supabase
  .from('products')
  .update({
    title: 'Updated Name',
    price: 89.99
  })
  .eq('id', productId)
  .eq('seller_id', userId); // Ensure user owns the product
```

#### Delete Product
```javascript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)
  .eq('seller_id', userId);
```

### Categories

#### Get All Categories
```javascript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('name');
```

#### Get Products by Category
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .eq('status', 'published');
```

### User Profiles

#### Get User Profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

#### Update Profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'John Doe',
    phone: '+1234567890',
    bio: 'Student at XYZ University'
  })
  .eq('user_id', userId);
```

### Messages

#### Send Message
```javascript
const { data, error } = await supabase
  .from('messages')
  .insert({
    chat_id: chatId,
    sender_id: senderId,
    receiver_id: receiverId,
    content: 'Hello!',
    type: 'text'
  });
```

#### Get Messages
```javascript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('chat_id', chatId)
  .order('created_at', { ascending: true });
```

#### Real-time Message Subscription
```javascript
const subscription = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `chat_id=eq.${chatId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();
```

### Favorites

#### Add to Favorites
```javascript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    product_id: productId
  });
```

#### Remove from Favorites
```javascript
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('user_id', userId)
  .eq('product_id', productId);
```

#### Get User Favorites
```javascript
const { data, error } = await supabase
  .from('favorites')
  .select(`
    *,
    product:products(*)
  `)
  .eq('user_id', userId);
```

### Reviews

#### Create Review
```javascript
const { data, error } = await supabase
  .from('reviews')
  .insert({
    product_id: productId,
    user_id: userId,
    rating: 5,
    comment: 'Great product!'
  });
```

#### Get Product Reviews
```javascript
const { data, error } = await supabase
  .from('reviews')
  .select(`
    *,
    user:profiles(full_name, avatar_url)
  `)
  .eq('product_id', productId)
  .order('created_at', { ascending: false });
```

### Notifications

#### Create Notification
```javascript
const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message',
    data: { chat_id: chatId }
  });
```

#### Get User Notifications
```javascript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .eq('is_read', false)
  .order('created_at', { ascending: false });
```

#### Mark as Read
```javascript
const { error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId);
```

## Storage API

### Upload Product Image
```javascript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`${productId}/${filename}`, file, {
    contentType: file.type,
    cacheControl: '3600'
  });
```

### Get Image URL
```javascript
const { data } = supabase.storage
  .from('product-images')
  .getPublicUrl(filePath);
```

### Delete Image
```javascript
const { error } = await supabase.storage
  .from('product-images')
  .remove([filePath]);
```

## Error Handling

All Supabase operations return an error object if something goes wrong:

```javascript
const { data, error } = await supabase
  .from('products')
  .select('*');

if (error) {
  console.error('Error fetching products:', error.message);
  // Handle error appropriately
} else {
  // Process data
}
```

## Rate Limiting

Supabase implements rate limiting by default:
- Anonymous requests: 500 req/hour
- Authenticated requests: 2500 req/hour

## Pagination

Use `range()` for pagination:

```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .range(0, 9); // First 10 items
```

## Filtering

Supabase supports various filters:

```javascript
// Equality
.eq('status', 'published')

// Inequality
.neq('status', 'sold')

// Greater/Less than
.gt('price', 100)
.lt('price', 500)

// Pattern matching
.like('title', '%laptop%')

// Array contains
.contains('tags', ['electronics'])

// Null checks
.is('deleted_at', null)
```

## Ordering

```javascript
// Single column
.order('created_at', { ascending: false })

// Multiple columns
.order('category_id')
.order('price', { ascending: true })
```

## Real-time Subscriptions

### Subscribe to Table Changes
```javascript
const subscription = supabase
  .channel('custom-channel')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'products'
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## Database Functions

Custom PostgreSQL functions can be called via RPC:

```javascript
const { data, error } = await supabase
  .rpc('get_trending_products', {
    limit_count: 10
  });
```

## Security

### Row Level Security (RLS)
All tables have RLS policies enabled to ensure users can only access authorized data.

### Best Practices
1. Always validate user permissions
2. Use parameterized queries
3. Implement proper error handling
4. Don't expose sensitive data in responses
5. Use HTTPS for all API calls
6. Implement rate limiting on client side
7. Cache responses when appropriate
