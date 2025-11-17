<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\KategoriProduk;

class KategoriProdukController extends Controller
{
    public function index()
    {
        return Inertia::render('kategori/datalist', [
            'data' => KategoriProduk::orderBy('kategori_produk_id', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'required|string|max:100|unique:kategori_produk,kategori',
        ], [
            'kategori.required' => 'Nama kategori wajib diisi.',
            'kategori.unique' => 'Kategori sudah ada, gunakan nama lain.',
            'kategori.max' => 'Nama kategori maksimal 100 karakter.',
        ]);

        KategoriProduk::create($validated);

        return redirect()->back()->with('success', 'Kategori berhasil dibuat.');
    }
}
