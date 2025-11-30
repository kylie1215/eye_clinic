<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::where('is_active', true)->where('stock_quantity', '>', 0);

            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%")
                      ->orWhere('brand', 'like', "%{$request->search}%")
                      ->orWhere('description', 'like', "%{$request->search}%");
                });
            }

            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->has('brand') && $request->brand !== 'all') {
                $query->where('brand', $request->brand);
            }

            $products = $query->orderBy('created_at', 'desc')->paginate(12);

            $brands = Product::where('is_active', true)->distinct()->pluck('brand')->filter();

            return response()->json([
                'products' => $products,
                'brands' => $brands,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        try {
            if (!$product->is_active) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $relatedProducts = Product::where('is_active', true)
                ->where('stock_quantity', '>', 0)
                ->where('category', $product->category)
                ->where('id', '!=', $product->id)
                ->take(4)
                ->get();

            return response()->json([
                'product' => $product,
                'relatedProducts' => $relatedProducts,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
