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
        return <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'مؤكد' : 'Confirmed'}</span>;
      case 'Car Received':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'تم استلام السيارة' : 'Car Received'}</span>;
      case 'In Service Bay':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse">{isAr ? 'في منصة الصيانة' : 'In Service Bay'}</span>;
      case 'Ready for Pickup':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'جاهزة للاستلام' : 'Ready for Pickup'}</span>;
      case 'Completed':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full">{isAr ? 'مكتمل' : 'Completed'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-12 min-h-screen" style={{ backgroundColor: 'var(--page-bg, #0f172a)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* User Welcome Banner */}
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-sky-600/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {isAr ? 'عميل كراج معتمد' : 'VERIFIED CLIENT'}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4 mt-1 font-medium">
                <span>📧 {user.email}</span>
                <span>📞 {user.phone}</span>
                <span>💳 {user.paymentMethod || (isAr ? 'كي نت السريع / نقداً' : 'KNET Express / Cash')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBookService}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isAr ? 'حجز موعد كراج' : 'Book Garage Bay'}</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 border border-slate-700"
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-150 active:scale-95 ${
              activeTab === 'bookings'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{isAr ? 'حجوزات الكراج النشطة' : 'Active Garage Bookings'} ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-150 active:scale-95 ${
              activeTab === 'orders'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isAr ? 'طلبات القطع والمشتريات' : 'Parts & Orders'} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testDrives')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-150 active:scale-95 ${
              activeTab === 'testDrives'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{isAr ? 'طلبات تجربة القيادة' : 'Test Drive Requests'} ({testDrives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-150 active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
              <div className="rounded-3xl p-12 text-center border border-slate-800 text-slate-400" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'لا توجد حجوزات صيانة نشطة' : 'No active garage bookings found'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                  {isAr ? 'احجز موعداً في ورشة الشويخ لصيانة المحرك أو برمجة الداينو.' : 'Schedule a service bay for computerized diagnostics or performance tuning.'}
                </p>
                <button
                  onClick={onBookService}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase rounded-xl transition-all duration-150 active:scale-95"
                >
                  {isAr ? 'حجز موعد جديد' : 'Book a Bay Now'}
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="rounded-3xl p-6 border border-slate-700/80 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400">#{booking.id}</span>
                      {getStatusBadge(booking.status)}
                      <span className="bg-emerald-950 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{booking.serviceTitle}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <Car className="w-3.5 h-3.5 text-sky-400" /> {booking.vehicleInfo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" /> {booking.timeSlot}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-sky-400 font-bold">
                        📍 {isAr ? 'أبيكس الشويخ منصة #3 (الدفع عند الحضور)' : 'Apex Shuwaikh Bay #3 (Cash on Arrival)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        {isAr ? 'قيمة الخدمة الإجمالية' : 'Total Job Value'}
                      </div>
                      <div className="text-2xl font-black text-sky-400">{booking.totalAmount} KWD</div>
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
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 border border-slate-700"
                    >
                      <Receipt className="w-4 h-4 text-sky-400" />
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
              <div className="rounded-3xl p-12 text-center border border-slate-800 text-slate-400" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'لا توجد طلبات قطع أو ملحقات حتى الآن' : 'No parts or hardware orders yet'}
                </h3>
              </div>
            ) : (
              orders.map((order) => {
                const orderItemsText = order.items && order.items.length > 0
                  ? order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')
                  : (order as any).name || (order as any).title || (isAr ? 'طلب قطع غيار' : 'Parts Order');

                return (
                  <div 
                    key={order.id}
                    className="rounded-3xl p-6 border border-slate-700/80 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-400">#{order.id}</span>
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {isAr ? 'التتبع:' : 'TRACKING:'} <span className="font-bold text-white">{order.trackingNumber || 'KW-TRK-9821'}</span>
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white">
                        {orderItemsText}
                      </div>
                      
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>📅 {order.date}</span>
                        <span>•</span>
                        <span>💳 {order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">
                          {isAr ? 'المجموع المدفوع' : 'Total Paid'}
                        </div>
                        <div className="text-2xl font-black text-sky-400">{order.totalAmount} KWD</div>
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
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 border border-slate-700"
                      >
                        <Receipt className="w-4 h-4 text-sky-400" />
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
              <div className="rounded-3xl p-12 text-center border border-slate-800 text-slate-400" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'لا توجد طلبات تجربة قيادة' : 'No test drive requests'}
                </h3>
              </div>
            ) : (
              testDrives.map((drive) => (
                <div 
                  key={drive.id}
                  className="rounded-3xl p-6 border border-slate-700/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {drive.status}
                      </span>
                      <span className="text-xs text-slate-400">Ref: #{drive.id}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white">{drive.vehicleName}</h4>
                    
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" /> {drive.location}
                      </span>
                      <span>📅 {drive.date}</span>
                      <span>👤 {isAr ? 'المستشار:' : 'Advisor:'} <span className="font-bold text-white">{drive.advisorName}</span></span>
                    </div>
                  </div>

                  <a
                    href={`tel:${drive.advisorPhone}`}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-95 border border-slate-700"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
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
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'المركبات المحفوظة في ملفك' : 'Your Garage Registered Vehicles'}
                </h3>
                <button
                  onClick={() => setShowAddVehicleModal(true)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all duration-150 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة مركبة' : 'Add Vehicle'}</span>
                </button>
              </div>

              {user.savedVehicles.map((veh) => (
                <div 
                  key={veh.id}
                  className="rounded-2xl p-5 border border-slate-700/80 shadow-md flex items-center justify-between"
                  style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-bold border border-slate-800">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{veh.year} {veh.make} {veh.model}</h4>
                      <div className="text-xs text-slate-400 font-mono">
                        {veh.engineTrim} • {veh.plateNumber || (isAr ? 'خصوصي الكويت' : 'Kuwait Private')}
                      </div>
                    </div>
                  </div>

                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    OBD2 READY
                  </span>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'أمان العميل والفوترة' : 'Customer Security & Billing'}
              </h3>
              <div className="text-xs text-slate-300 space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{isAr ? 'الاسم:' : 'Name:'}</span>
                  <span className="font-bold text-white">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{isAr ? 'الهاتف:' : 'Mobile:'}</span>
                  <span className="font-bold text-white">{user.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{isAr ? 'طريقة الدفع الافتراضية:' : 'Default Payment:'}</span>
                  <span className="font-bold text-sky-400">{user.paymentMethod || (isAr ? 'كي نت السريع / نقداً' : 'KNET Express / Cash')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">{isAr ? 'الورشة المفضلة:' : 'Preferred Workshop:'}</span>
                  <span className="font-bold text-white">{isAr ? 'الشويخ الصناعية 1' : 'Shuwaikh Industrial 1'}</span>
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
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-700"
            >
              <button 
                onClick={() => setShowAddVehicleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-all duration-150 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-sky-400" />
                <span>{isAr ? 'إضافة مركبة إلى ملف الكراج' : 'Add Vehicle to Your Garage Profile'}</span>
              </h3>

              <form onSubmit={handleCreateVehicle} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'الشركة المصنعة (مثال: بورش، نيسان)' : 'Make (e.g. Porsche, Nissan, Ford)'}
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'النوع (مثال: 911 GT3، باترول)' : 'Model (e.g. 911 GT3, Patrol, Mustang)'}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={isAr ? 'السنة (مثال: 2022)' : 'Year (e.g. 2022)'}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'رقم اللوحة (مثال: 14/8921)' : 'Plate (e.g. 14/8921)'}
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder={isAr ? 'المحرك / المواصفات (مثال: 5.6L V8)' : 'Engine / Spec (e.g. 5.6L V8 / 4.0L Flat-6)'}
                  value={engineTrim}
                  onChange={(e) => setEngineTrim(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md mt-2 transition-all duration-150 active:scale-95"
                >
                  {isAr ? 'حفظ المركبة في الملف' : 'Save Vehicle to Profile'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Itemized Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-all duration-150 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-800 pb-4 mb-4">
                <div className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                  {isAr ? 'إيصال معاملة رسمي من أبيكس تورك' : 'APEX TORQUE OFFICIAL TRANSACTION RECEIPT'}
                </div>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedReceipt.title}</h3>
                <div className="text-xs text-slate-400 font-mono mt-1 flex justify-between">
                  <span>ID: #{selectedReceipt.transactionId}</span>
                  <span>{selectedReceipt.date}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-slate-300 uppercase">
                  {isAr ? 'تفاصيل الخدمة / المنتجات:' : 'Itemized Job / Product Breakdown:'}
                </div>
                <div className="divide-y divide-slate-800 text-xs text-slate-300">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between">
                      <span>{item.description}</span>
                      <span className="font-bold text-white font-mono">{item.cost} KWD</span>
                    </div>
                  ))}
                  {selectedReceipt.deliveryOrBayFee > 0 && (
                    <div className="py-2.5 flex justify-between">
                      <span>{isAr ? 'رسوم الشحن السريع للكويت' : 'Kuwait Express Courier Dispatch'}</span>
                      <span className="font-bold text-white font-mono">{selectedReceipt.deliveryOrBayFee} KWD</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 mb-6">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{isAr ? 'قناة الدفع:' : 'Payment Channel:'}</span>
                  <span className="font-bold text-white">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>{isAr ? 'إجمالي المبلغ المدفوع:' : 'TOTAL PAID AMOUNT:'}</span>
                  <span className="text-sky-400 text-lg">{selectedReceipt.totalKWD} KWD</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'إيصال موثق من كراج أبيكس' : 'AUTHENTICATED APEX GARAGE RECEIPT'}
                </span>
                <button
                  onClick={() => window.print()}
                  className="text-sky-400 font-bold hover:underline"
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