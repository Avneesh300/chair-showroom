"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCartApi } from "@/services/cart.service";
import { createOrderApi, createTempPaymentOrderApi } from "@/services/order.service";
import { toast } from "react-toastify";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";

const steps = ["Address", "Payment", "Review & Place Order"];

declare global {
  interface Window { Razorpay: any; }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user_data") || "{}");



  // Cart page se aa raha hai
  const discountAmount = Number(searchParams.get("discount")) || 0;
  const couponCode = searchParams.get("coupon") || "";

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [address, setAddress] = useState({
    full_name: user.full_name || "",
    mobile: user.mobile || "",
    address: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
  });
  const [addressError, setAddressError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");


  useEffect(() => {
    const fetchCart = async () => {
      const response: any = await getCartApi({ page: 1, limit: 100 });
      if (response?.success) setCartItems(response.data);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.sellingPrice) * (item.quantity || 1)), 0
  );
  const FREE_DELIVERY_MIN = Number(process.env.NEXT_PUBLIC_FREE_DELIVERY_MIN) || 5000;
  const SHIPPING_CHARGE = Number(process.env.NEXT_PUBLIC_SHIPPING_CHARGE) || 299;
  const shippingCharge = subtotal >= FREE_DELIVERY_MIN ? 0 : SHIPPING_CHARGE;
  const finalTotal = subtotal - discountAmount + shippingCharge;

  // ✅ Address validation
  const validateAddress = () => {
    const { full_name, mobile, address: addr, city, state, pincode } = address;
    if (!full_name || !mobile || !addr || !city || !state || !pincode) {
      setAddressError("Please fill all address fields.");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setAddressError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setAddressError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setAddressError("");
    return true;
  };

  // ✅ Order create + Razorpay payment
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);

    try {
      if (paymentMethod === "COD") {
        // ✅ COD - seedha order create karo
        const orderRes: any = await createOrderApi({
          full_name: address.full_name,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          address: address.address,
          items: cartItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity || 1,
            price: Number(item.sellingPrice),
          })),
          subtotal,
          shippingCharge,
          discountAmount,
          totalAmount: finalTotal,
        });

        if (!orderRes?.success) {
          toast.error(orderRes?.message || "Order creation failed");
          setPlacingOrder(false);
          return;
        }

        setPlacedOrderId(orderRes.data._id);
        setOrderPlaced(true);
        setPlacingOrder(false);
        return;
      }

      // ✅ Online Payment - pehle Razorpay open karo
      // Temporary amount se payment order banao
      const tempPaymentOrder: any = await createTempPaymentOrderApi({
        amount: finalTotal,
      });

      if (!tempPaymentOrder?.success) {
        toast.error("Payment initialization failed");
        setPlacingOrder(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: tempPaymentOrder.data.amount,
        currency: tempPaymentOrder.data.currency,
        name: "Chair Store",
        description: "Chair Purchase",
        order_id: tempPaymentOrder.data.id,
        handler: async (response: any) => {
          // ✅ Payment success ke baad order create karo
          const orderRes: any = await createOrderApi({
            full_name: address.full_name,
            mobile: address.mobile,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            address: address.address,
            items: cartItems.map((item) => ({
              product: item.productId,
              quantity: item.quantity || 1,
              price: Number(item.sellingPrice),
            })),
            subtotal,
            shippingCharge,
            discountAmount,
            totalAmount: finalTotal,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (orderRes?.success) {
            setPlacedOrderId(orderRes.data._id);
            setOrderPlaced(true);
          } else {
            toast.error("Order creation failed after payment. Contact support.");
          }
          setPlacingOrder(false);
        },
        prefill: {
          name: address.full_name,
          contact: address.mobile,
        },
        theme: { color: "#b45309" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setPlacingOrder(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setPlacingOrder(false);
    }
  };
  // ✅ Order placed success screen
  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 text-center max-w-md w-full mx-4 shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-500 text-sm mb-1">
              Order ID: <span className="font-semibold text-gray-800">{placedOrderId}</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Estimated delivery: 3-5 working days. You will receive a confirmation on your mobile.
            </p>
            <div className="space-y-3">
              <Link href="/account/orders" className="block w-full bg-amber-700 text-white font-semibold py-3 rounded-xl hover:bg-amber-800 transition-colors">
                Track My Order
              </Link>
              <Link href="/" className="block w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-amber-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products" className="bg-amber-700 text-white px-6 py-2.5 rounded-full font-medium">Browse Chairs</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* ✅ Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">Checkout</h1>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${i <= step ? "text-amber-700" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < step ? "bg-amber-700 border-amber-700 text-white" : i === step ? "border-amber-600 text-amber-700" : "border-gray-300"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-amber-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {/* Step 0: Address */}
              {step === 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-5">Delivery Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "full_name", label: "Full Name", placeholder: "Rahul Sharma" },
                      { key: "mobile", label: "Mobile Number", placeholder: "9876543210" },
                      { key: "address", label: "Address", placeholder: "House No, Street, Area" },
                      { key: "city", label: "City", placeholder: "Lucknow" },
                      { key: "state", label: "State", placeholder: "Uttar Pradesh" },
                      { key: "pincode", label: "Pincode", placeholder: "226001" },
                    ].map((field) => (
                      <div key={field.key} className={field.key === "address" ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={address[field.key as keyof typeof address]}
                          onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                        />
                      </div>
                    ))}
                  </div>
                  {addressError && <p className="text-red-500 text-sm mt-3">{addressError}</p>}
                  <button
                    onClick={() => { if (validateAddress()) setStep(1); }}
                    className="mt-6 flex items-center gap-2 bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-amber-800"
                  >
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-5">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { value: "Razorpay", label: "Online Payment", desc: "UPI, Card, Net Banking, EMI via Razorpay" },
                      { value: "COD", label: "Cash on Delivery", desc: "Pay when chair is delivered" },
                    ].map((method) => (
                      <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === method.value ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300"}`}>
                        <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="accent-amber-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{method.label}</div>
                          <div className="text-xs text-gray-500">{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">← Back</button>
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-amber-800">
                      Review Order <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-5">Order Review</h2>
                  <div className="space-y-3 mb-5">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        {item.image
                          ? <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                          : <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">🪑</div>
                        }
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</div>
                          <div className="text-xs text-gray-400">Qty: {item.quantity || 1} × {formatPrice(item.sellingPrice)}</div>
                        </div>
                        <div className="text-sm font-bold">{formatPrice(Number(item.sellingPrice) * (item.quantity || 1))}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 mb-5">
                    <p><span className="text-gray-500">Delivery to:</span> <span className="font-medium">{address.full_name}, {address.city}, {address.pincode}</span></p>
                    <p><span className="text-gray-500">Mobile:</span> <span className="font-medium">{address.mobile}</span></p>
                    <p><span className="text-gray-500">Payment:</span> <span className="font-medium">{paymentMethod}</span></p>
                    {couponCode && <p><span className="text-gray-500">Coupon:</span> <span className="font-medium text-green-600">{couponCode} (-{formatPrice(discountAmount)})</span></p>}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">← Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      {placingOrder
                        ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                        : `🎉 Place Order – ${formatPrice(finalTotal)}`
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-20">
                <h3 className="font-semibold text-sm text-gray-800 mb-4">Price Details</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({cartItems.reduce((s, i) => s + (i.quantity || 1), 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={shippingCharge === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}