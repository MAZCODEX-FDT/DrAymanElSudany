<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/** Create a dashboard admin, or reset an existing admin's password. */
#[Signature('clinic:admin {email} {--name=Clinic Admin}')]
#[Description('Create a dashboard admin or reset their password')]
class CreateAdmin extends Command
{
    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email')));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Not a valid email.');

            return self::FAILURE;
        }
        $password = (string) $this->secret('Password (10+ characters)');
        if (strlen($password) < 10) {
            $this->error('The password must be at least 10 characters.');

            return self::FAILURE;
        }
        $user = User::firstOrNew(['email' => $email]);
        $user->name = $user->exists ? $user->name : $this->option('name');
        $user->password = $password;
        $user->save();
        $this->info(($user->wasRecentlyCreated ? 'Admin created: ' : 'Password updated: ').$email);

        return self::SUCCESS;
    }
}
