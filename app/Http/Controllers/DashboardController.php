<?php

namespace App\Http\Controllers;

use App\Models\Hutang;
use App\Models\PengeluaranKulakan;
use App\Models\PengeluaranLainnya;
use App\Models\Produk;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Stats
        $totalPenjualanHariIni = Transaksi::where('status', 'lunas')
            ->whereDate('tgl_transaksi', Carbon::today())->sum('total_harga') ?? 0;

        $totalHutangAktif = Hutang::where('is_dibayar', false)->sum('hutang_total') ?? 0;

        $pengeluaranLainnyaBulanIni = PengeluaranLainnya::whereMonth('tgl_pengeluaran', Carbon::now()->month)
            ->whereYear('tgl_pengeluaran', Carbon::now()->year)->sum('subtotal') ?? 0;
        $pengeluaranKulakanBulanIni = PengeluaranKulakan::whereMonth('tgl_pengeluaran', Carbon::now()->month)
            ->whereYear('tgl_pengeluaran', Carbon::now()->year)->sum('subtotal') ?? 0;
        $totalPengeluaranBulanIni = $pengeluaranLainnyaBulanIni + $pengeluaranKulakanBulanIni;

        // Lists
        $stokMenipis = Produk::where('stok', '<=', 10)->where('is_deleted', '!=', 1)->orderBy('stok', 'asc')->limit(5)->get(['produk_nama', 'stok']);

        $transaksiTerakhir = Transaksi::orderBy('tgl_transaksi', 'desc')->limit(5)->get()
            ->map(fn ($item) => [
                'pembeli' => $item->pembeli ?? 'N/A',
                'total' => $item->total_harga,
                'status' => $item->status,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalPenjualanHariIni' => $totalPenjualanHariIni,
                'totalHutangAktif' => $totalHutangAktif,
                'totalPengeluaranBulanIni' => $totalPengeluaranBulanIni,
            ],
            'lowStockProducts' => $stokMenipis,
            'recentTransactions' => $transaksiTerakhir,
        ]);
    }
}