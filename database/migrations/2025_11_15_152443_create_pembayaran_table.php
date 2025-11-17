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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->increments('pembayaran_id');

            $table->unsignedInteger('transaksi_id');
            $table->enum('pembayaran_metode', ['tunai', 'ewallet', 'qris', 'utang'])->nullable();
            $table->integer('pembayaran_total');
            $table->integer('uang_dibayar');
            $table->timestamp('tgl_pembayaran')->useCurrent();

            $table->foreign('transaksi_id')
                ->references('transaksi_id')->on('transaksi')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
