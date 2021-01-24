<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class ResetsPasswordTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Displays the reset password request form.
     *
     * @test
     */
    public function it_displays_password_reset_request_form()
    {
        $response = $this->get('password/reset');

        $response->assertStatus(200);
    }

    /**
     * Sends the password reset email when the user exists.
     *
     * @test
     */
    public function it_sends_password_reset_email()
    {
        $user = User::factory()->create();

        $this->expectsNotification($user, ResetPassword::class);

        $response = $this->post('password/email', ['email' => $user->email]);

        $response->assertStatus(302);
    }

    /**
     * Does not send a password reset email when the user does not exist.
     *
     * @test
     */
    public function it_does_not_send_password_reset_email()
    {
        $this->doesntExpectJobs(ResetPassword::class);

        $this->post('password/email', ['email' => 'invalid@email.com']);
    }

    /**
     * Displays the form to reset a password.
     *
     * @test
     */
    public function it_displays_password_reset_form()
    {
        $response = $this->get('/password/reset/token');

        $response->assertStatus(200);
    }

    /**
     * Allows a user to reset their password.
     *
     * @test
     */
    public function it_changes_a_users_password()
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $response = $this->post('/password/reset', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertTrue(Hash::check('password', $user->fresh()->password));
    }
}
