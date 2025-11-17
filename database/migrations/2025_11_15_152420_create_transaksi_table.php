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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->increments('transaksi_id');
            $table->timestamp('tgl_transaksi')->useCurrent();
            $table->string('pembeli', 150)->nullable();
            $table->string('no_hp_pembeli', 20)->nullable();

            $table->unsignedBigInteger('user_id');
            $table->integer('total_harga');
            $table->enum('status', ['lunas', 'utang', 'batal'])->default('lunas');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
