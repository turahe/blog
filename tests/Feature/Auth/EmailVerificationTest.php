<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param $user
     * @return string
     */
    protected function validVerificationVerifyRoute($user)
    {
        return URL::signedRoute('verification.verify', [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]);
    }

    /**
     * @param $user
     * @return string
     */
    protected function invalidVerificationVerifyRoute($user)
    {
        return route('verification.verify', [
            'id' => $user->id,
            'hash' => 'invalid-hash',
        ]);
    }

    /**
     * @test
     */
    public function it_guest_cannot_see_the_verification_notice()
    {
        $response = $this->get(route('verification.notice'));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function it_user_sees_the_verification_notice_when_not_verified()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($user)->get(route('verification.notice'));

        $response->assertStatus(200);
        $response->assertViewIs('auth.verify');
    }

    /** @test */
    public function it_verified_user_is_redirected_home_when_visiting_verification_notice_route()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('verification.notice'));

        $response->assertRedirect(route('admin.dashboard'));
    }

    /**
     * @test
     */
    public function it_guest_cannot_see_the_verification_verify_route()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => null,
        ]);

        $response = $this->get($this->validVerificationVerifyRoute($user));

        $response->assertRedirect(route('login'));
    }

    /**
     * @test
     */
    public function it_user_cannot_verify_others()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => null,
        ]);

        $user2 = factory(User::class)->create(['email_verified_at' => null]);

        $response = $this->actingAs($user)->get($this->validVerificationVerifyRoute($user2));

        $response->assertForbidden();
        $this->assertFalse($user2->fresh()->hasVerifiedEmail());
    }

    /** @test */
    public function it_user_is_redirected_to_correct_route_when_already_verified()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get($this->validVerificationVerifyRoute($user));

        $response->assertRedirect(route('admin.dashboard'));
    }

    /** @test */
    public function it_forbidden_is_returned_when_signature_is_invalid_in_verification_verify_route()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get($this->invalidVerificationVerifyRoute($user));

        $response->assertStatus(403);
    }

    /** @test */
    public function it_user_can_verify_them_selves()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($user)->get($this->validVerificationVerifyRoute($user));

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    /** @test */
    public function it_guest_cannot_resend_a_verification_email()
    {
        $response = $this->post(route('verification.resend'));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function it_user_is_redirected_to_correct_route_if_already_verified()
    {
        $user = factory(User::class)->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->post(route('verification.resend'));

        $response->assertRedirect(route('admin.dashboard'));
    }

    /** @test */
    public function it_user_can_resend_a_verification_email()
    {
        Notification::fake();
        $user = factory(User::class)->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($user)
            ->from(route('verification.notice'))
            ->post(route('verification.resend'));

        Notification::assertSentTo($user, VerifyEmail::class);
        $response->assertRedirect(route('verification.notice'));
    }
}
