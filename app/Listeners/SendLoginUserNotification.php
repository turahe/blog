<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\UserLoginNotification;
use Illuminate\Support\Facades\Notification;

class SendLoginUserNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $admins = User::whereHas('roles', function ($query) {
            $query->where('id', 1);
        })->get();

        Notification::send($admins, new UserLoginNotification($event->user));
    }
}
