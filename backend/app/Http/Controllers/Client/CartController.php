<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index()
    {
        $client = auth()->user();

        $cartItems = Cart::with('product')
            ->where('client_id', $client->id)
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $tax = $subtotal * 0.12; // 12% tax
        $shipping = $subtotal > 1000 ? 0 : 100; // Free shipping over 1000
        $total = $subtotal + $tax + $shipping;

        return response()->json([
            'items' => $cartItems,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
            ],
        ]);
    }

    public function add(Request $request)
    {
        $client = auth()->user();

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->is_active || $product->stock_quantity < $validated['quantity']) {
            return response()->json(['message' => 'Product is not available in the requested quantity.'], 400);
        }

        $cartItem = Cart::where('client_id', $client->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $validated['quantity'];
            
            if ($product->stock_quantity < $newQuantity) {
                return response()->json(['message' => 'Not enough stock available.'], 400);
            }
            
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            Cart::create([
                'client_id' => $client->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json(['message' => 'Product added to cart.']);
    }

    public function update(Request $request, Cart $cartItem)
    {
        // Ensure client can only update their own cart items
        if ($cartItem->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($cartItem->product->stock_quantity < $validated['quantity']) {
            return response()->json(['message' => 'Not enough stock available.'], 400);
        }

        $cartItem->update($validated);

        return response()->json(['message' => 'Cart updated.']);
    }

    public function remove(Cart $cartItem)
    {
        // Ensure client can only remove their own cart items
        if ($cartItem->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart.']);
    }

    public function clear()
    {
        $client = auth()->user();

        Cart::where('client_id', $client->id)->delete();

        return response()->json(['message' => 'Cart cleared.']);
    }
}
