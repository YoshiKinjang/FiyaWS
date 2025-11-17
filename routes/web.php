<?php

use App\Http\Controllers\KategoriProdukController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/kategori', [KategoriProdukController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriProdukController::class, 'store'])->name('kategori.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
