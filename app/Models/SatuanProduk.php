<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SatuanProduk extends Model
{
    protected $table = 'satuan_produk';
    protected $primaryKey = 'satuan_produk_id';

    public $timestamps = false;
    protected $fillable = [
        'satuan',
        'created_at'
    ];
}
