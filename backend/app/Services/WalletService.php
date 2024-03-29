<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
 
class WalletService
{
    public function getCurrentBalance(Request $request) : float
    {        
        return $request->user()->wallet->balance;
    }

    public function addFunds(Transaction $transaction) : void
    {     
        $wallet = $transaction->user->wallet;
        $wallet->balance += $transaction->amount;
        $wallet->save();
    }

    public function removeFunds(Request $request, Transaction $transaction) : void
    {        
        $request->user()->wallet->balance -= $transaction->amount;
        $request->user()->wallet->save();
    }
}