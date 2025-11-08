import { supabase } from '../lib/supabase';

export interface ReceiptItem {
  id?: string;
  receipt_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category?: string;
  created_at?: string;
}

export interface Receipt {
  id?: string;
  user_id?: string;
  store_name?: string;
  store_location?: string;
  purchase_date?: string;
  total_amount: number;
  tax_amount?: number;
  subtotal?: number;
  payment_method?: string;
  image_url?: string;
  category?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: ReceiptItem[];
}

export interface PriceHistory {
  id?: string;
  user_id?: string;
  item_name: string;
  store_name?: string;
  price: number;
  quantity: number;
  unit_price: number;
  purchase_date: string;
  receipt_id?: string;
  created_at?: string;
}

export interface ReceiptStats {
  total_receipts: number;
  total_amount: number;
  average_transaction: number;
  this_month_total: number;
  last_month_total: number;
}

export interface PriceComparison {
  item_name: string;
  stores: Array<{
    store_name: string;
    price: number;
    unit_price: number;
    last_purchase: string;
  }>;
  best_price: number;
  worst_price: number;
  average_price: number;
}

export const receiptService = {
  // Upload receipt image
  async uploadReceiptImage(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // OCR processing using Anthropic Claude (mock for now - you can integrate real OCR)
  async processReceiptOCR(imageUrl: string): Promise<Partial<Receipt>> {
    // This is a mock implementation
    // In production, you would call Claude API with vision capabilities
    // or use a dedicated OCR service like Google Vision API

    // Mock data for demonstration
    return {
      store_name: 'Sample Store',
      purchase_date: new Date().toISOString(),
      total_amount: 0,
      tax_amount: 0,
      subtotal: 0,
      items: []
    };
  },

  // Get all receipts
  async getReceipts(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        items:receipt_items(*)
      `)
      .order('purchase_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Receipt[];
  },

  // Get single receipt
  async getReceipt(id: string) {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        items:receipt_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Receipt;
  },

  // Create receipt
  async createReceipt(receipt: Omit<Receipt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { items, ...receiptData } = receipt;

    // Insert receipt
    const { data: newReceipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([{ ...receiptData, user_id: user.id }])
      .select()
      .single();

    if (receiptError) throw receiptError;

    // Insert items if any
    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        ...item,
        receipt_id: newReceipt.id,
      }));

      const { error: itemsError } = await supabase
        .from('receipt_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Insert price history for each item
      const priceHistoryData = items.map(item => ({
        user_id: user.id,
        item_name: item.item_name,
        store_name: receipt.store_name,
        price: item.total_price,
        quantity: item.quantity,
        unit_price: item.unit_price,
        purchase_date: receipt.purchase_date || new Date().toISOString(),
        receipt_id: newReceipt.id,
      }));

      await supabase
        .from('price_history')
        .insert(priceHistoryData);
    }

    return this.getReceipt(newReceipt.id);
  },

  // Update receipt
  async updateReceipt(id: string, receipt: Partial<Receipt>) {
    const { items, ...receiptData } = receipt;

    const { data, error } = await supabase
      .from('receipts')
      .update(receiptData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update items if provided
    if (items) {
      // Delete existing items
      await supabase
        .from('receipt_items')
        .delete()
        .eq('receipt_id', id);

      // Insert new items
      if (items.length > 0) {
        const itemsToInsert = items.map(item => ({
          ...item,
          receipt_id: id,
        }));

        await supabase
          .from('receipt_items')
          .insert(itemsToInsert);
      }
    }

    return this.getReceipt(id);
  },

  // Delete receipt
  async deleteReceipt(id: string) {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get receipt stats
  async getReceiptStats(): Promise<ReceiptStats> {
    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('total_amount, purchase_date');

    if (error) throw error;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const total_amount = receipts.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
    const this_month_total = receipts
      .filter(r => r.purchase_date && new Date(r.purchase_date) >= thisMonthStart)
      .reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
    const last_month_total = receipts
      .filter(r => {
        const date = r.purchase_date ? new Date(r.purchase_date) : null;
        return date && date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

    return {
      total_receipts: receipts.length,
      total_amount,
      average_transaction: receipts.length > 0 ? total_amount / receipts.length : 0,
      this_month_total,
      last_month_total,
    };
  },

  // Get price comparisons for common items
  async getPriceComparisons(): Promise<PriceComparison[]> {
    const { data, error } = await supabase
      .from('price_history')
      .select('item_name, store_name, unit_price, purchase_date')
      .order('purchase_date', { ascending: false });

    if (error) throw error;

    // Group by item name
    const itemGroups = data.reduce((acc, item) => {
      const itemName = item.item_name.toLowerCase().trim();
      if (!acc[itemName]) {
        acc[itemName] = [];
      }
      acc[itemName].push(item);
      return acc;
    }, {} as Record<string, typeof data>);

    // Create price comparisons
    const comparisons: PriceComparison[] = [];

    for (const [itemName, items] of Object.entries(itemGroups)) {
      // Group by store to get latest price per store
      const storeMap = new Map<string, typeof items[0]>();

      items.forEach(item => {
        if (item.store_name) {
          const existing = storeMap.get(item.store_name);
          if (!existing || new Date(item.purchase_date) > new Date(existing.purchase_date)) {
            storeMap.set(item.store_name, item);
          }
        }
      });

      const stores = Array.from(storeMap.values()).map(item => ({
        store_name: item.store_name!,
        price: Number(item.unit_price),
        unit_price: Number(item.unit_price),
        last_purchase: item.purchase_date,
      }));

      if (stores.length > 1) { // Only include items found in multiple stores
        const prices = stores.map(s => s.price);
        comparisons.push({
          item_name: itemName,
          stores,
          best_price: Math.min(...prices),
          worst_price: Math.max(...prices),
          average_price: prices.reduce((a, b) => a + b, 0) / prices.length,
        });
      }
    }

    return comparisons.sort((a, b) =>
      (b.worst_price - b.best_price) - (a.worst_price - a.best_price)
    );
  },

  // Get price history for specific item
  async getItemPriceHistory(itemName: string) {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .ilike('item_name', `%${itemName}%`)
      .order('purchase_date', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as PriceHistory[];
  },

  // Search receipts
  async searchReceipts(query: string) {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        items:receipt_items(*)
      `)
      .or(`store_name.ilike.%${query}%,notes.ilike.%${query}%`)
      .order('purchase_date', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data as Receipt[];
  },
};
