<?php

namespace App\Http\Controllers;

use App\Models\Hutang;
use App\Models\PengeluaranKulakan;
use App\Models\PengeluaranLainnya;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('startDate', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('endDate', Carbon::now()->endOfMonth()->toDateString());

        // Laporan Penjualan
        $laporanPenjualan = Transaksi::with('pembayaran')
            ->whereBetween('tgl_transaksi', [$startDate, $endDate])
            ->where('status', 'lunas')
            ->orderBy('tgl_transaksi', 'desc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->transaksi_id,
                'tanggal' => Carbon::parse($item->tgl_transaksi)->toDateString(),
                'customer' => $item->pembeli ?? 'N/A',
                'total' => $item->total_harga,
                'metode' => $item->pembayaran->pembayaran_metode ?? 'N/A',
            ]);

        // Laporan Pengeluaran
        $laporanPengeluaran = PengeluaranLainnya::with('jenisPengeluaran')
            ->whereBetween('tgl_pengeluaran', [$startDate, $endDate])
            ->orderBy('tgl_pengeluaran', 'desc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->pengeluaran_lainnya_id,
                'tanggal' => Carbon::parse($item->tgl_pengeluaran)->toDateString(),
                'jenis' => $item->jenisPengeluaran->jenis ?? 'Lainnya',
                'subtotal' => $item->subtotal,
            ]);

        // Laporan Hutang
        $laporanHutang = Hutang::with('transaksi')
            ->whereBetween('tgl_hutang', [$startDate, $endDate])
            ->orderBy('tgl_hutang', 'desc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->hutang_id,
                'tanggal' => Carbon::parse($item->tgl_hutang)->toDateString(),
                'nama' => $item->transaksi->pembeli ?? 'N/A',
                'nominal' => $item->hutang_total,
                'status' => $item->is_dibayar ? 'Lunas' : 'Belum Lunas',
            ]);

        // Laporan Kulakan
        $laporanKulakan = PengeluaranKulakan::with('produk')
            ->whereBetween('tgl_pengeluaran', [$startDate, $endDate])
            ->orderBy('tgl_pengeluaran', 'desc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->pengeluaran_kulakan_id,
                'tanggal' => Carbon::parse($item->tgl_pengeluaran)->toDateString(),
                'produk' => $item->produk->produk_nama ?? 'N/A',
                'qty' => $item->qty,
                'total' => $item->subtotal,
            ]);

        return Inertia::render('laporan/index', [
            'reports' => [
                'penjualan' => $laporanPenjualan,
                'pengeluaran' => $laporanPengeluaran,
                'hutang' => $laporanHutang,
                'kulakan' => $laporanKulakan,
            ],
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
            ],
        ]);
    }
}