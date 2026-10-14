
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Wrench, 
  Package, 
  Car, 
  Receipt, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  PhoneCall,
  MapPin,
  X
} from 'lucide-react';
import { 
  User, 
  BookingRecord, 
  OrderRecord, 
  TestDriveRecord, 
  ReceiptBreakdown, 
  Language, 
  UserVehicle 
} from '../types';

interface AccountDashboardProps {
  user: User;
  bookings: BookingRecord[];
  orders: OrderRecord[];
  testDrives: TestDriveRecord[];
  language: Language;
  onLogout: () => void;
  onAddVehicle: (vehicle: UserVehicle) => void;
  onBookService: () => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({
  user,
  bookings,
  orders,
  testDrives,
  language,
  onLogout,
  onAddVehicle,
  onBookService
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'testDrives' | 'profile'>('bookings');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptBreakdown | null>(null);

  // New vehicle form
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [engineTrim, setEngineTrim] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const isAr = language === 'ar';

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model) return;

    const newVeh: UserVehicle = {
      id: `veh_${Date.now()}`,
      make,
      model,
      year: parseInt(year) || 2023,
      engineTrim: engineTrim || (isAr ? 'المواصفات القياسية' : 'Standard Spec'),
      plateNumber: plateNumber || (isAr ? 'خصوصي الكويت' : 'Kuwait Private')
    };

    onAddVehicle(newVeh);
    setShowAddVehicleModal(false);
    setMake('');
    setModel('');
    setEngineTrim('');
    setPlateNumber('');
  };

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'مؤكد' : 'Confirmed'}</span>;
      case 'Car Received':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'تم استلام السيارة' : 'Car Received'}</span>;
      case 'In Service Bay':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse">{isAr ? 'في منصة الصيانة' : 'In Service Bay'}</span>;
      case 'Ready for Pickup':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'جاهزة للاستلام' : 'Ready for Pickup'}</span>;
      case 'Completed':
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'مكتمل' : 'Completed'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* User Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-sky-600/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {isAr ? 'عميل معتمد' : 'VERIFIED CLIENT'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4 mt-1 font-medium">
                <span>📧 {user.email}</span>
                <span>📞 {user.phone}</span>
                <span>💳 {user.paymentMethod || (isAr ? 'كي نت السريع' : 'KNET Express')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBookService}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isAr ? 'حجز موعد كراج' : 'Book Garage Bay'}</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs rounded-xl transition-colors"
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{isAr ? 'حجوزات الكراج النشطة' : 'Active Garage Bookings'} ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isAr ? 'طلبات القطع والمشتريات' : 'Parts & Orders'} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testDrives')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'testDrives'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{isAr ? 'طلبات تجربة القيادة' : 'Test Drive Requests'} ({testDrives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>{isAr ? 'المركبات المحفوظة والملف' : 'Saved Vehicles & Profile'}</span>
          </button>
        </div>

        {/* Tab 1: Active Garage Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {isAr ? 'لا توجد حجوزات صيانة نشطة' : 'No active garage bookings found'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                  {isAr ? 'احجز موعداً في ورشة الشويخ لصيانة المحرك أو برمجة الداينو.' : 'Schedule a service bay for computerized diagnostics or performance tuning.'}
                </p>
                <button
                  onClick={onBookService}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase rounded-xl"
                >
                  {isAr ? 'حجز موعد جديد' : 'Book a Bay Now'}
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500">#{booking.id}</span>
                      {getStatusBadge(booking.status)}
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{booking.serviceTitle}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Car className="w-3.5 h-3.5 text-sky-600" /> {booking.vehicleInfo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-600" /> {booking.timeSlot}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-sky-700 font-bold">
                        📍 {isAr ? 'أبيكس الشويخ منصة #3' : 'Apex Shuwaikh Bay #3'}
                      </span>
                    </div>
                  </div>

                  {/* Financial Total & Receipt Trigger */}
                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        {isAr ? 'قيمة الخدمة الإجمالية' : 'Total Job Value'}
                      </div>
                      <div className="text-2xl font-black text-sky-600">{booking.totalAmount} KWD</div>
                    </div>

                    <button
                      onClick={() => setSelectedReceipt({
                        transactionId: booking.id,
                        type: 'Service',
                        title: booking.serviceTitle,
                        date: booking.date,
                        items: [
                          { description: `${booking.serviceTitle} ${isAr ? 'معايرة وأجور يد' : 'Calibration & Labor'}`, cost: booking.laborFee },
                          { description: isAr ? 'قطع غيار OEM وفحص السلامة البيئية' : 'OEM Consumables & Environmental Inspection Fee', cost: booking.partsFee }
                        ],
                        laborCost: booking.laborFee,
                        partsCost: booking.partsFee,
                        deliveryOrBayFee: 0,
                        totalKWD: booking.totalAmount,
                        paymentMethod: booking.paymentStatus === 'Paid' ? (isAr ? 'كي نت (مدفوع بالكامل)' : 'KNET (Paid in Full)') : (isAr ? 'مستحق في الكراج' : 'Due at Garage')
                      })}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Receipt className="w-4 h-4 text-sky-600" />
                      <span>{isAr ? 'عرض الفاتورة' : 'View Receipt'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Parts & Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {isAr ? 'لا توجد طلبات قطع أو ملحقات حتى الآن' : 'No parts or hardware orders yet'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isAr ? 'تصفح متجر قطع غيار الأداء لدينا لطلب الترقية المناسبة.' : 'Browse our performance hardware store to order genuine bolt-on upgrades.'}
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const orderItemsText = order.items && order.items.length > 0
                  ? order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')
                  : (order as any).name || (order as any).title || (isAr ? 'طلب قطع غيار' : 'Parts Order');

                const statusText = isAr 
                  ? ((order as any).statusAr || (order.status === 'Dispatched' ? 'تم الشحن' : order.status))
                  : order.status;

                const paymentText = isAr
                  ? `الدفع عبر ${order.paymentMethod || 'نقداً عند الاستلام'}`
                  : `Paid via ${order.paymentMethod || 'Cash on Delivery'}`;

                return (
                  <div 
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-500">#{order.id}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {statusText}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {isAr ? 'التتبع:' : 'TRACKING:'} <span className="font-bold text-slate-800">{order.trackingNumber || 'KW-TRK-9821'}</span>
                        </span>
                      </div>

                      <div className="text-sm font-bold text-slate-900">
                        {orderItemsText}
                      </div>
                      
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>📅 {isAr ? `تم الشحن: ${order.date}` : `Dispatched: ${order.date}`}</span>
                        <span>•</span>
                        <span>💳 {paymentText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">
                          {isAr ? 'المجموع المدفوع' : 'Total Paid'}
                        </div>
                        <div className="text-2xl font-black text-sky-600">{order.totalAmount} KWD</div>
                      </div>

                      <button
                        onClick={() => setSelectedReceipt({
                          transactionId: order.id,
                          type: 'Part Order',
                          title: isAr ? 'توصيل طلب قطع غيار Apex' : 'Apex Parts Express Delivery',
                          date: order.date,
                          items: order.items ? order.items.map(i => ({ description: `${i.productName} (x${i.quantity})`, cost: i.price * i.quantity })) : [{ description: orderItemsText, cost: order.totalAmount }],
                          deliveryOrBayFee: order.deliveryFee || 0,
                          totalKWD: order.totalAmount,
                          paymentMethod: order.paymentMethod
                        })}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4 text-sky-600" />
                        <span>{isAr ? 'عرض الفاتورة' : 'View Receipt'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Showroom Test Drive Requests */}
        {activeTab === 'testDrives' && (
          <div className="space-y-4">
            {testDrives.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {isAr ? 'لا توجد طلبات تجربة قيادة' : 'No test drive requests'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isAr ? 'تصفح سياراتنا الفاخرة والمعتمدة لطلب تجربة قيادة خاصة.' : 'Browse our verified supercar and luxury showroom inventory to request a VIP drive.'}
                </p>
              </div>
            ) : (
              testDrives.map((drive) => (
                <div 
                  key={drive.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {drive.status}
                      </span>
                      <span className="text-xs text-slate-500">Ref: #{drive.id}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">{drive.vehicleName}</h4>
                    
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" /> {drive.location}
                      </span>
                      <span>📅 {isAr ? `تاريخ الطلب: ${drive.date}` : `Requested Date: ${drive.date}`}</span>
                      <span>👤 {isAr ? 'المستشار:' : 'Advisor:'} <span className="font-bold">{drive.advisorName}</span></span>
                    </div>
                  </div>

                  <a
                    href={`tel:${drive.advisorPhone}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isAr ? 'الاتصال بمستشار المبيعات' : 'Call Sales Advisor'}</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Saved Vehicles & Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'المركبات المحفوظة في ملفك' : 'Your Garage Registered Vehicles'}
                </h3>
                <button
                  onClick={() => setShowAddVehicleModal(true)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة مركبة' : 'Add Vehicle'}</span>
                </button>
              </div>

              {user.savedVehicles.map((veh) => (
                <div 
                  key={veh.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{veh.year} {veh.make} {veh.model}</h4>
                      <div className="text-xs text-slate-500 font-mono">
                        {veh.engineTrim} • {veh.plateNumber || (isAr ? 'خصوصي الكويت' : 'Kuwait Private')}
                      </div>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                    OBD2 READY
                  </span>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'أمان العميل والفوترة' : 'Customer Security & Billing'}
              </h3>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>{isAr ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>{isAr ? 'الهاتف:' : 'Mobile:'}</span>
                  <span className="font-bold text-slate-900">{user.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>{isAr ? 'طريقة الدفع الافتراضية:' : 'Default Payment:'}</span>
                  <span className="font-bold text-sky-600">{user.paymentMethod || (isAr ? 'كي نت السريع' : 'KNET Express Pay')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>{isAr ? 'الورشة المفضلة:' : 'Preferred Workshop:'}</span>
                  <span className="font-bold text-slate-900">{isAr ? 'الشويخ الصناعية 1' : 'Shuwaikh Industrial 1'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVehicleModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100"
            >
              <button 
                onClick={() => setShowAddVehicleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-sky-600" />
                <span>{isAr ? 'إضافة مركبة إلى ملف الكراج' : 'Add Vehicle to Your Garage Profile'}</span>
              </h3>

              <form onSubmit={handleCreateVehicle} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'الشركة المصنعة (مثال: بورش، نيسان)' : 'Make (e.g. Porsche, Nissan, Ford)'}
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'النوع (مثال: 911 GT3، باترول)' : 'Model (e.g. 911 GT3, Patrol, Mustang)'}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={isAr ? 'السنة (مثال: 2022)' : 'Year (e.g. 2022)'}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'رقم اللوحة (مثال: 14/8921)' : 'Plate (e.g. 14/8921)'}
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder={isAr ? 'المحرك / المواصفات (مثال: 5.6L V8)' : 'Engine / Spec (e.g. 5.6L V8 / 4.0L Flat-6)'}
                  value={engineTrim}
                  onChange={(e) => setEngineTrim(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md mt-2"
                >
                  {isAr ? 'حفظ المركبة في الملف' : 'Save Vehicle to Profile'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Itemized Receipt Breakdown Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-200 pb-4 mb-4">
                <div className="text-[10px] font-mono text-sky-600 uppercase font-bold">
                  {isAr ? 'إيصال معاملة رسمي من أبيكس تورك' : 'APEX TORQUE OFFICIAL TRANSACTION RECEIPT'}
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedReceipt.title}</h3>
                <div className="text-xs text-slate-500 font-mono mt-1 flex justify-between">
                  <span>ID: #{selectedReceipt.transactionId}</span>
                  <span>{selectedReceipt.date}</span>
                </div>
              </div>

              {/* Itemized breakdown table */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-slate-700 uppercase">
                  {isAr ? 'تفاصيل الخدمة / المنتجات:' : 'Itemized Job / Product Breakdown:'}
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between">
                      <span className="text-slate-700">{item.description}</span>
                      <span className="font-bold text-slate-900 font-mono">{item.cost} KWD</span>
                    </div>
                  ))}
                  {selectedReceipt.deliveryOrBayFee > 0 && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-700">{isAr ? 'رسوم الشحن السريع للكويت' : 'Kuwait Express Courier Dispatch'}</span>
                      <span className="font-bold text-slate-900 font-mono">{selectedReceipt.deliveryOrBayFee} KWD</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Certification */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 mb-6">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{isAr ? 'قناة الدفع:' : 'Payment Channel:'}</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{isAr ? 'إجمالي المبلغ المدفوع:' : 'TOTAL PAID AMOUNT:'}</span>
                  <span className="text-sky-600 text-lg">{selectedReceipt.totalKWD} KWD</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {isAr ? 'إيصال موثق من كراج أبيكس' : 'AUTHENTICATED APEX GARAGE RECEIPT'}
                </span>
                <button
                  onClick={() => window.print()}
                  className="text-sky-600 font-bold hover:underline"
                >
                  {isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};