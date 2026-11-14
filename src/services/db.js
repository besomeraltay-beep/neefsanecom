import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'neefsane_catalog_v5',
  ORDERS: 'neefsane_orders',
  COUPONS: 'neefsane_coupons_v1',
  SETTINGS: 'neefsane_settings_v1'
};

const DEFAULT_COUPONS = [
  { id: 'c1', code: 'HOSGELDIN10', type: 'percent', value: 0.10, label: '%10 İlk Sipariş İndirimi', minSpend: 0, isActive: true },
  { id: 'c2', code: 'EFSANE10', type: 'percent', value: 0.10, label: '%10 Özel İndirim', minSpend: 300, isActive: true },
  { id: 'c3', code: 'NEEF20', type: 'percent', value: 0.20, label: '%20 Lansman İndirimi', minSpend: 600, isActive: true }
];

const DEFAULT_SETTINGS = {
  freeShippingThreshold: 500,
  phone: '0850 300 00 00',
  whatsapp: '905000000000',
  storeName: 'NEEFSANE'
};

// ==========================================
// 1. PRODUCTS API
// ==========================================
export async function getProducts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using local fallback:', e);
    }
  }

  // Fallback to localStorage or INITIAL_PRODUCTS
  try {
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export async function saveProduct(product, isEdit) {
  // Update local storage first for instant UI response
  try {
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const existing = local ? JSON.parse(local) : INITIAL_PRODUCTS;
    let next;
    if (isEdit) {
      next = existing.map(p => p.id === product.id ? product : p);
    } else {
      next = [product, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
  } catch {}

  // Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      const row = {
        id: product.id,
        name: product.name,
        category: product.category,
        category_name: product.categoryName || product.category,
        price: Number(product.price),
        discount_price: product.discountPrice ? Number(product.discountPrice) : null,
        stock_count: Number(product.stockCount) || 0,
        rating: Number(product.rating) || 5.0,
        reviews_count: Number(product.reviewsCount) || 1,
        tag: product.tag || null,
        is_featured: !!product.isFeatured,
        is_bestseller: !!product.isBestSeller,
        is_new: !!product.isNew,
        image: product.image,
        images: product.images || [product.image],
        description: product.description || '',
        models: product.models || [],
        colors: product.colors || [],
        features: product.features || []
      };

      if (isEdit) {
        await supabase.from('products').update(row).eq('id', product.id);
      } else {
        await supabase.from('products').insert([row]);
      }
    } catch (e) {
      console.warn('Supabase product save error:', e);
    }
  }

  return product;
}

export async function deleteProduct(productId) {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (local) {
      const existing = JSON.parse(local);
      const next = existing.filter(p => p.id !== productId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
    }
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {
      console.warn('Supabase delete product error:', e);
    }
  }
}

// ==========================================
// 2. ORDERS API
// ==========================================
export async function getOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        // Map DB snake_case columns back to frontend camelCase
        const mapped = data.map(o => ({
          id: o.id,
          orderNumber: o.order_number,
          date: o.date,
          status: o.status,
          courier: o.courier,
          trackingNumber: o.tracking_number,
          trackingUrl: o.tracking_url,
          paymentMethod: o.payment_method,
          subtotal: o.subtotal,
          shippingFee: o.shipping_fee,
          total: o.total,
          customer: o.customer,
          items: o.items,
          timeline: o.timeline,
          adminNote: o.admin_note
        }));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase orders fetch error, using local fallback:', e);
    }
  }

  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export async function createOrder(order) {
  // Save local
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const existing = local ? JSON.parse(local) : [];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([order, ...existing]));
  } catch {}

  // Sync Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const row = {
        order_number: order.orderNumber,
        date: order.date,
        status: order.status || 'Hazırlanıyor',
        courier: order.courier || 'MNG Kargo',
        tracking_number: order.trackingNumber || null,
        tracking_url: order.trackingUrl || null,
        payment_method: order.paymentMethod || 'Kredi Kartı',
        subtotal: Number(order.subtotal) || 0,
        shipping_fee: Number(order.shippingFee) || 0,
        total: Number(order.total) || 0,
        customer: order.customer || {},
        items: order.items || [],
        timeline: order.timeline || [],
        admin_note: order.adminNote || null
      };
      await supabase.from('orders').insert([row]);
    } catch (e) {
      console.warn('Supabase createOrder error:', e);
    }
  }

  return order;
}

export async function updateOrder(orderNumber, updatedFields) {
  // Update local
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (local) {
      const existing = JSON.parse(local);
      const next = existing.map(o => o.orderNumber === orderNumber ? { ...o, ...updatedFields } : o);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
    }
  } catch {}

  // Sync Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const row = {};
      if (updatedFields.status !== undefined) row.status = updatedFields.status;
      if (updatedFields.courier !== undefined) row.courier = updatedFields.courier;
      if (updatedFields.trackingNumber !== undefined) row.tracking_number = updatedFields.trackingNumber;
      if (updatedFields.trackingUrl !== undefined) row.tracking_url = updatedFields.trackingUrl;
      if (updatedFields.adminNote !== undefined) row.admin_note = updatedFields.adminNote;

      await supabase.from('orders').update(row).eq('order_number', orderNumber);
    } catch (e) {
      console.warn('Supabase updateOrder error:', e);
    }
  }
}

export async function deleteOrder(orderNumber) {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (local) {
      const existing = JSON.parse(local);
      const next = existing.filter(o => o.orderNumber !== orderNumber);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
    }
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').delete().eq('order_number', orderNumber);
    } catch (e) {
      console.warn('Supabase deleteOrder error:', e);
    }
  }
}

// ==========================================
// 3. COUPONS API
// ==========================================
export async function getCoupons() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('coupons').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(c => ({
          id: c.id,
          code: c.code,
          type: c.type,
          value: Number(c.value),
          minSpend: Number(c.min_spend) || 0,
          label: c.label,
          isActive: c.is_active
        }));
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase coupons fetch error:', e);
    }
  }

  try {
    const local = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
  return DEFAULT_COUPONS;
}

export async function saveCoupon(coupon, isEdit) {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.COUPONS);
    const existing = local ? JSON.parse(local) : DEFAULT_COUPONS;
    let next;
    if (isEdit) {
      next = existing.map(c => c.id === coupon.id ? coupon : c);
    } else {
      next = [coupon, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(next));
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      const row = {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        min_spend: Number(coupon.minSpend) || 0,
        label: coupon.label || '',
        is_active: coupon.isActive !== false
      };
      if (isEdit) {
        await supabase.from('coupons').update(row).eq('id', coupon.id);
      } else {
        await supabase.from('coupons').insert([row]);
      }
    } catch (e) {
      console.warn('Supabase coupon save error:', e);
    }
  }

  return coupon;
}

export async function deleteCoupon(couponId) {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (local) {
      const existing = JSON.parse(local);
      const next = existing.filter(c => c.id !== couponId);
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(next));
    }
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('coupons').delete().eq('id', couponId);
    } catch (e) {
      console.warn('Supabase coupon delete error:', e);
    }
  }
}

// ==========================================
// 4. SETTINGS API
// ==========================================
export async function getStoreSettings() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const obj = {};
        data.forEach(item => {
          obj[item.key] = item.value;
        });
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(obj));
        return obj;
      }
    } catch (e) {
      console.warn('Supabase settings fetch error:', e);
    }
  }

  try {
    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveStoreSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      for (const [key, val] of Object.entries(settings)) {
        await supabase.from('settings').upsert({ key, value: val }, { onConflict: 'key' });
      }
    } catch (e) {
      console.warn('Supabase settings save error:', e);
    }
  }

  return settings;
}

// ==========================================
// 5. CUSTOMERS AUTH & DATABASE API
// ==========================================
const CUSTOMERS_KEY = 'neefsane_customers_v1';

async function hashPassword(password) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16);
}

export async function getCustomers() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'customers_registry')
        .maybeSingle();

      if (!error && data && Array.isArray(data.value)) {
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(data.value));
        return data.value;
      }
    } catch (e) {
      console.warn('Supabase customers fetch error:', e);
    }
  }

  try {
    const local = localStorage.getItem(CUSTOMERS_KEY);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export async function saveCustomers(customersList) {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customersList));
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('settings')
        .upsert({
          key: 'customers_registry',
          value: customersList
        }, { onConflict: 'key' });
    } catch (e) {
      console.warn('Supabase customers save error:', e);
    }
  }
}

export async function registerCustomer({ name, email, phone = '', password }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanName) throw new Error('Lütfen ad ve soyadınızı girin.');
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Lütfen geçerli bir e-posta adresi girin.');
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error('Şifreniz en az 6 karakter olmalıdır.');
  }

  const customers = await getCustomers();
  const exists = customers.find(c => c.email && c.email.toLowerCase() === cleanEmail);
  if (exists) {
    throw new Error('Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın.');
  }

  const passwordHash = await hashPassword(cleanPassword);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  const newCustomer = {
    id: 'cust_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    passwordHash: passwordHash,
    address: '',
    city: '',
    district: '',
    joinedAt: dateFormatted,
    createdAt: now.toISOString(),
    ordersCount: 0
  };

  const updatedList = [newCustomer, ...customers];
  await saveCustomers(updatedList);

  const { passwordHash: _, ...safeUser } = newCustomer;
  return safeUser;
}

export async function loginCustomer({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) throw new Error('Lütfen e-posta adresinizi girin.');
  if (!cleanPassword) throw new Error('Lütfen şifrenizi girin.');

  const customers = await getCustomers();
  const customer = customers.find(c => c.email && c.email.toLowerCase() === cleanEmail);

  if (!customer) {
    throw new Error('Bu e-posta adresine kayıtlı bir hesap bulunamadı. Lütfen önce kayıt olun.');
  }

  const inputHash = await hashPassword(cleanPassword);
  if (customer.passwordHash && customer.passwordHash !== inputHash) {
    throw new Error('Girdiğiniz şifre hatalı. Lütfen kontrol edip tekrar deneyin.');
  }

  const { passwordHash: _, ...safeUser } = customer;
  return safeUser;
}

export async function updateCustomerProfile(email, updatedData) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const customers = await getCustomers();
  const next = customers.map(c => {
    if (c.email && c.email.toLowerCase() === cleanEmail) {
      return {
        ...c,
        name: updatedData.name !== undefined ? updatedData.name : c.name,
        phone: updatedData.phone !== undefined ? updatedData.phone : c.phone,
        address: updatedData.address !== undefined ? updatedData.address : c.address,
        city: updatedData.city !== undefined ? updatedData.city : c.city,
        district: updatedData.district !== undefined ? updatedData.district : c.district
      };
    }
    return c;
  });

  await saveCustomers(next);
  const found = next.find(c => c.email && c.email.toLowerCase() === cleanEmail);
  if (found) {
    const { passwordHash: _, ...safeUser } = found;
    return safeUser;
  }
  return updatedData;
}
