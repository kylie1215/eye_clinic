<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $client = auth()->user();
        $query = Order::with('items.product')
            ->where('client_id', $client->id);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Client/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Order $order): Response
    {
        // Ensure client can only view their own orders
        if ($order->client_id !== auth()->id()) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('Client/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function checkout(): Response
    {
        $client = auth()->user();

        $cartItems = Cart::with('product')
            ->where('client_id', $client->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('client.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $tax = $subtotal * 0.12;
        $shipping = $subtotal > 1000 ? 0 : 100;
        $total = $subtotal + $tax + $shipping;

        return Inertia::render('Client/Orders/Checkout', [
            'cartItems' => $cartItems,
            'client' => $client,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $client = auth()->user();

        $validated = $request->validate([
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'nullable|string',
            'shipping_postal_code' => 'required|string',
            'shipping_country' => 'required|string',
            'contact_phone' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $cartItems = Cart::with('product')
            ->where('client_id', $client->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        // Calculate totals
        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
        $tax = $subtotal * 0.12;
        $shipping = $subtotal > 1000 ? 0 : 100;
        $total = $subtotal + $tax + $shipping;

        try {
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'client_id' => $client->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_fee' => $shipping,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_state' => $validated['shipping_state'] ?? null,
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'shipping_country' => $validated['shipping_country'],
                'contact_phone' => $validated['contact_phone'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items and update stock
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->product->price,
                    'total_price' => $cartItem->product->price * $cartItem->quantity,
                ]);

                // Update product stock
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            // Clear cart
            Cart::where('client_id', $client->id)->delete();

            // Create notification for admin
            $adminUsers = \App\Models\User::where('role', 'admin')->get();
            foreach ($adminUsers as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'order',
                    'title' => 'New Order Received',
                    'message' => "New order {$order->order_number} from {$client->name}.",
                    'data' => ['order_id' => $order->id],
                ]);
            }

            DB::commit();

            return redirect()->route('client.orders.show', $order)
                ->with('success', 'Order placed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to place order. Please try again.');
        }
    }
}
