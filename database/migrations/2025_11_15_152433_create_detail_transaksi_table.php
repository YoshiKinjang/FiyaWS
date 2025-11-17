<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->increments('detail_transaksi_id');

            $table->unsignedInteger('transaksi_id');
            $table->unsignedInteger('produk_id');

            $table->integer('harga');
            $table->integer('jumlah');
            $table->integer('subtotal');

            $table->foreign('transaksi_id')
                ->references('transaksi_id')->on('transaksi')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->foreign('produk_id')
                ->references('produk_id')->on('produk')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
