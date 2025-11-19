<?php

namespace App\Http\Controllers;

use App\Models\PengeluaranKulakan;
use App\Models\Produk;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class KulakanController extends Controller
{
    public function index()
    {
        $kulakanHistory = PengeluaranKulakan::with('produk')
            ->orderBy('tgl_pengeluaran', 'desc')
            ->get()
            ->groupBy(function ($item) {
                // Group by a composite key to represent a single purchase event
                return $item->tgl_pengeluaran . '-' . $item->note;
            })
            ->map(function ($group) {
                $firstItem = $group->first();
                return [
                    'id' => $firstItem->tgl_pengeluaran . '-' . $firstItem->note,
                    'tanggal' => date('Y-m-d', strtotime($firstItem->tgl_pengeluaran)),
                    'waktu' => date('H:i', strtotime($firstItem->tgl_pengeluaran)),
                    'catatan' => $firstItem->note,
                    'total' => $group->sum('subtotal'),
                    'items' => $group->map(function ($item) {
                        return [
                            'id' => $item->pengeluaran_kulakan_id,
                            'nama' => $item->produk->produk_nama,
                            'qty' => $item->qty,
                            'hargaBeli' => $item->harga_beli,
                            'hargaJual' => $item->produk->harga_jual, // Assuming we show the current selling price
                            'subtotal' => $item->subtotal,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('kulakan', [
            'kulakanHistory' => $kulakanHistory,
            'products' => Produk::where('is_deleted', false)->get(['produk_id', 'produk_nama', 'harga_beli', 'harga_jual']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'note' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.produk_id' => ['required', 'integer', 'exists:produk,produk_id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.hargaBeli' => ['required', 'integer', 'min:0'],
            'items.*.hargaJual' => ['required', 'integer', 'min:0'],
            'items.*.subtotal' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($request) {
            $tgl_pengeluaran = now();
            $user_id = Auth::id();

            foreach ($request->items as $item) {
                // Create the kulakan record
                PengeluaranKulakan::create([
                    'user_id' => $user_id,
                    'produk_id' => $item['produk_id'],
                    'qty' => $item['qty'],
                    'harga_beli' => $item['hargaBeli'],
                    'subtotal' => $item['subtotal'],
                    'note' => $request->note,
                    'tgl_pengeluaran' => $tgl_pengeluaran,
                ]);

                // Update product stock and prices
                $produk = Produk::find($item['produk_id']);
                $produk->stok += $item['qty'];
                $produk->harga_beli = $item['hargaBeli'];
                $produk->harga_jual = $item['hargaJual'];
                $produk->save();
            }
        });

        return redirect()->route('kulakan.index')->with('success', 'Kulakan berhasil disimpan.');
    }
}
