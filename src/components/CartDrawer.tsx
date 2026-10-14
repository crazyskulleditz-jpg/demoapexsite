import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  CheckCircle, 
  Truck 
} from 'lucide-react';
import { CartItem, Language } from '../types';

interface CartDrawerProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onOrderPlaced?: (order: any) => void; // Optional direct state update callback
}

const FREE_TOWING_THRESHOLD = 300; // in KWD

export const CartDrawer: React.FC<CartDrawerProps> = ({
  language,
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const isAr = language === 'ar';

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const qualifiesForFreeTowing = subtotal >= FREE_TOWING_THRESHOLD;
  const progressPercent = Math.min(100, (subtotal / FREE_TOWING_THRESHOLD) * 100);
  const amountNeeded = Math.max(0, FREE_TOWING_THRESHOLD - subtotal);

  const deliveryFee = qualifiesForFreeTowing ? 0 : (items.length > 0 ? 10 : 0);
  const total = subtotal + deliveryFee;

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);

    // 1. Get current logged-in user
    const currentUserRaw = localStorage.getItem('apextorque_user');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

    // 2. Format both English and Arabic item summaries & total count
    const itemSummaryEn = items.map(i => i.product.name).join(', ');
    const itemSummaryAr = items.map(i => i.product.nameAr || i.product.name).join(', ');
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    // 3. Build item breakdown with both English and Arabic names
    const formattedItems = items.map(({ product, quantity }) => {
      const enName = product.name;
      const arName = product.nameAr || product.name;
      return {
        id: product.id,
        name: enName,
        nameAr: arName,
        title: enName,
        titleAr: arName,
        itemName: enName,
        itemNameAr: arName,
        item_name: enName,
        productName: enName,
        productNameAr: arName,
        product_name: enName,
        partName: enName,
        partNameAr: arName,
        part_name: enName,
        serviceName: enName,
        serviceNameAr: arName,
        service_name: enName,
        description: enName,
        descriptionAr: arName,
        desc: enName,
        label: enName,
        labelAr: arName,
        item: enName,
        text: enName,
        summary: enName,
        product: enName,

        price: product.price,
        unitPrice: product.price,
        unit_price: product.price,
        amount: product.price,
        total: product.price * quantity,

        quantity: quantity,
        qty: quantity,
        count: quantity,

        image: product.image,
        img: product.image,
      };
    });

    const todayEn = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const todayAr = new Date().toLocaleDateString('ar-KW', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // 4. Build complete bilingual order object
    const newOrder = {
      id: 'ORD-KW-' + Math.floor(100000 + Math.random() * 900000),
      date: todayEn,
      dateAr: todayAr,

      name: itemSummaryEn,
      nameAr: itemSummaryAr,
      title: itemSummaryEn,
      titleAr: itemSummaryAr,
      itemName: itemSummaryEn,
      itemNameAr: itemSummaryAr,
      item_name: itemSummaryEn,
      productName: itemSummaryEn,
      productNameAr: itemSummaryAr,
      product_name: itemSummaryEn,
      partName: itemSummaryEn,
      partNameAr: itemSummaryAr,
      part_name: itemSummaryEn,
      description: itemSummaryEn,
      descriptionAr: itemSummaryAr,
      desc: itemSummaryEn,
      item: itemSummaryEn,
      label: itemSummaryEn,
      labelAr: itemSummaryAr,
      summary: itemSummaryEn,
      summaryAr: itemSummaryAr,
      details: itemSummaryEn,

      quantity: totalQuantity,
      qty: totalQuantity,
      count: totalQuantity,
      total: total,
      totalAmount: total,
      price: total,
      subtotal: subtotal,
      deliveryFee: deliveryFee,

      paymentMethod: 'Cash on Delivery',
      paymentMethodAr: 'الدفع عند الاستلام',
      status: 'Dispatched',
      statusAr: 'تم الشحن',

      userId: currentUser?.id || 'guest',
      userEmail: currentUser?.email || 'guest@apextorque.kw',

      items: formattedItems,
      parts: formattedItems,
      products: formattedItems,
      services: formattedItems,
      jobs: formattedItems,
      breakdown: formattedItems,
    };

    // 5. Save to global orders history
    const existingOrdersRaw = localStorage.getItem('apextorque_orders');
    const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('apextorque_orders', JSON.stringify(updatedOrders));

    // 6. Update active user profile
    if (currentUser) {
      const userOrders = currentUser.orders || [];
      const updatedUser = {
        ...currentUser,
        orders: [newOrder, ...userOrders],
      };
      localStorage.setItem('apextorque_user', JSON.stringify(updatedUser));
    }

    // 7. Dispatch instant window events so open Profile/App state updates live
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('apextorque_orders_updated', { detail: newOrder }));

    if (onOrderPlaced) {
      onOrderPlaced(newOrder);
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      setTimeout(() => {
        onClearCart();
        setCheckoutComplete(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed ${isAr ? 'left-0' : 'right-0'} top-0 h-full w-full max-w-lg bg-white border-l border-slate-200 z-[70] shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {isAr ? 'سلة الطلبات' : 'Order Manifest'}
                  </h2>
                  <div className="text-xs text-slate-500">
                    {items.length} {items.length === 1 ? (isAr ? 'عنصر' : 'item') : (isAr ? 'عناصر' : 'items')}
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free VIP Express Towing Progress */}
            <div className="px-6 py-3 bg-sky-50 border-b border-sky-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-4 h-4 text-sky-600" />
                  {qualifiesForFreeTowing ? (
                    <span className="text-emerald-700 font-bold">
                      {isAr ? 'مبروك! سحب ونش وفحص VIP مجاني بالكويت!' : 'FREE VIP EXPRESS TOWING & SCAN UNLOCKED!'}
                    </span>
                  ) : (
                    <span>
                      {isAr 
                        ? `أضف بقيمة ${amountNeeded} د.ك للحصول على ونش وفحص مجاناً` 
                        : `Add ${amountNeeded} KWD more for Free VIP Towing & Scan`}
                    </span>
                  )}
                </span>
                <span className="text-sky-700 font-extrabold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${qualifiesForFreeTowing ? 'bg-emerald-500' : 'bg-sky-600'}`} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutComplete ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                    {isAr ? 'تم استلام طلبك بنجاح!' : 'Order Dispatched!'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-xs mb-4">
                    {isAr ? 'سيتم التواصل معك لتأكيد التوصيل والتركيب (الدفع عند الاستلام).' : 'Invoice and dispatch details saved to your profile. (Cash on Delivery)'}
                  </p>
                  <div className="font-mono text-xs text-sky-600 font-bold">
                    {isAr ? 'رقم الطلب' : 'ORDER'} #APX-KW-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-30 text-slate-400" />
                  <p className="text-sm font-bold text-slate-600">
                    {isAr ? 'السلة فارغة حالياً' : 'Your cart is empty'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    {isAr ? 'تصفح قطع الغيار وخدمات الكراج لإضافتها للطلب.' : 'Browse our performance parts and services to get started.'}
                  </p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200" 
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">
                            {isAr && product.nameAr ? product.nameAr : product.name}
                          </h4>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-2 text-slate-900">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900">
                          {(product.price * quantity).toLocaleString()} KWD
                        </div>
                        {quantity > 1 && (
                          <div className="text-[10px] text-slate-400">
                            {product.price} {isAr ? 'د.ك للقطعة' : 'KWD each'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && !checkoutComplete && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>{isAr ? 'إجمالي المنتجات:' : 'Subtotal:'}</span>
                    <span className="text-slate-900 font-bold">{subtotal.toLocaleString()} KWD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'رسوم التوصيل بالكويت:' : 'Kuwait Delivery:'}</span>
                    <span className={qualifiesForFreeTowing ? 'text-emerald-600 font-bold' : 'text-slate-900'}>
                      {qualifiesForFreeTowing ? (isAr ? 'مجاني (عرض ترويجي)' : 'FREE') : `${deliveryFee} KWD`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>{isAr ? 'المجموع النهائي:' : 'Total Amount:'}</span>
                    <span className="text-lg text-sky-600">{total.toLocaleString()} KWD</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase tracking-wider text-sm rounded-2xl shadow-md transition-all active:scale-[0.98]"
                >
                  {isCheckingOut ? (
                    <span>{isAr ? 'جاري المعالجة...' : 'Processing...'}</span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>{isAr ? 'تأكيد الطلب - الدفع عند الاستلام' : 'Confirm Order (Cash on Delivery)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'الدفع نقداً عند الاستلام / التوصيل' : 'CASH ON DELIVERY / CASH ON ARRIVAL'}</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};