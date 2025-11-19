<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function index()
    {
        $products = Produk::where('is_deleted', '!=', 1)
            ->orderBy('produk_nama', 'asc')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->produk_id,
                'nama' => $product->produk_nama,
                'harga_jual' => $product->harga_jual,
                'stok' => $product->stok,
            ]);

        return Inertia::render('transaksi/index', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customerName' => ['nullable', 'string', 'max:150'],
            'total' => ['required', 'integer', 'min:0'],
            'metodePembayaran' => ['required', 'string', 'in:tunai,transfer,qris'],
            'uangDibayar' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:produk,produk_id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.harga_jual' => ['required', 'integer', 'min:0'],
            'items.*.subtotal' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($data) {
            // 1. Create Transaction
            $transaksi = Transaksi::create([
                'user_id' => Auth::id(),
                'pembeli' => $data['customerName'],
                'total_harga' => $data['total'],
                'status' => 'lunas', // Assuming lunas for now
            ]);

            // 2. Create Transaction Details & Update Stock
            foreach ($data['items'] as $item) {
                DetailTransaksi::create([
                    'transaksi_id' => $transaksi->transaksi_id,
                    'produk_id' => $item['id'],
                    'harga' => $item['harga_jual'],
                    'jumlah' => $item['qty'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Decrement stock
                $produk = Produk::find($item['id']);
                $produk->stok -= $item['qty'];
                $produk->save();
            }

            // 3. Create Payment
            Pembayaran::create([
                'transaksi_id' => $transaksi->transaksi_id,
                'pembayaran_metode' => $data['metodePembayaran'],
                'pembayaran_total' => $data['total'],
                'uang_dibayar' => $data['uangDibayar'],
                'tgl_pembayaran' => now(),
            ]);
        });

        return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil disimpan.');
    }
}