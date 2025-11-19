<?php

use App\Http\Controllers\DashboardController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\SatuanProdukController;
use App\Http\Controllers\KategoriProdukController;
use App\Http\Controllers\KulakanController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\JenisPengeluaranController;
use App\Http\Controllers\TransaksiController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/kategori', [KategoriProdukController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriProdukController::class, 'store'])->name('kategori.store');
    Route::put('/kategori/{id}', [KategoriProdukController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori/{id}', [KategoriProdukController::class, 'destroy'])->name('kategori.destroy');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/satuan', [SatuanProdukController::class, 'index'])->name('satuan.index');
    Route::post('/satuan', [SatuanProdukController::class, 'store'])->name('satuan.store');
    Route::put('/satuan/{id}', [SatuanProdukController::class, 'update'])->name('satuan.update');
    Route::delete('/satuan/{id}', [SatuanProdukController::class, 'destroy'])->name('satuan.destroy');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::post('/produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::put('/produk/{id}', [ProdukController::class, 'update'])->name('produk.update');
    Route::delete('/produk/{id}', [ProdukController::class, 'destroy'])->name('produk.destroy');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/kulakan', [KulakanController::class, 'index'])->name('kulakan.index');
    Route::post('/kulakan', [KulakanController::class, 'store'])->name('kulakan.store');
    // Route::put('/kulakan/{id}', [KulakanController::class, 'update'])->name('kulakan.update');
    // Route::delete('/kulakan/{id}', [KulakanController::class, 'destroy'])->name('kulakan.destroy');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/pengeluaran', [PengeluaranController::class, 'index'])->name('pengeluaran.index');
    Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.store');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
    Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth'])->group(function() {
    Route::get('/jenis-pengeluaran', [JenisPengeluaranController::class, 'index'])->name('jenis-pengeluaran.index');
    Route::post('/jenis-pengeluaran', [JenisPengeluaranController::class, 'store'])->name('jenis-pengeluaran.store');
    Route::put('/jenis-pengeluaran/{id}', [JenisPengeluaranController::class, 'update'])->name('jenis-pengeluaran.update');
    Route::delete('/jenis-pengeluaran/{id}', [JenisPengeluaranController::class, 'destroy'])->name('jenis-pengeluaran.destroy');
});
