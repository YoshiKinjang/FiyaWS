<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriProduk extends Model
{
    protected $table = 'kategori_produk';
    protected $primaryKey = 'kategori_produk_id';
    public $timestamps = false;

    protected $fillable = [
        'kategori',
        'created_at'
    ];
}
