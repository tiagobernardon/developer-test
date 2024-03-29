<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserTypeEnum;

class TransactionPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function viewAll(User $user): bool
    {
        return $user->type === UserTypeEnum::Admin->value;
    }

    /**
     * Determine whether the user can store models.
     */
    public function store(User $user): bool
    {
        return $user->type === UserTypeEnum::Default->value;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $user->type === UserTypeEnum::Admin->value;
    }
}
