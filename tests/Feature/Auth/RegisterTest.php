<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    /** @test  */
    public function it_user_can_view_a_registration_form()
    {
        $response = $this->get(route('register'));

        $response->assertSuccessful();
        $response->assertViewIs('auth.register');
    }

    /** @test  */
    public function it_user_cannot_view_a_registration_form_when_authenticated()
    {
        $user = User::factory()->make();

        $response = $this->actingAs($user, 'web')->get(route('register'));

        $response->assertRedirect(route('admin.dashboard'));
    }

    /** @test  */
    public function it_user_can_register()
    {
        $response = $this->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'our-secret',
            'password_confirmation' => 'our-secret',
        ]);
        $response->assertStatus(302);

        $this->assertAuthenticated();
    }

    /** @test  */
    public function it_user_cannot_register_without_name()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => '',
            'email' => 'john@example.com',
            'password' => 'our-secret',
            'password_confirmation' => 'our-secret',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('name');
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test  */
    public function it_user_cannot_register_without_email()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => 'John Doe',
            'email' => '',
            'password' => 'our-secret',
            'password_confirmation' => 'our-secret',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('email');
        $this->assertTrue(session()->hasOldInput('name'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test  */
    public function it_user_cannot_register_with_invalid_email()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'our-secret',
            'password_confirmation' => 'our-secret',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('email');
        $this->assertTrue(session()->hasOldInput('name'));
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test  */
    public function it_user_cannot_register_without_password()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('password');
        $this->assertTrue(session()->hasOldInput('name'));
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test  */
    public function it_user_cannot_register_without_password_confirmation()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'our-secret',
            'password_confirmation' => '',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('password');
        $this->assertTrue(session()->hasOldInput('name'));
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }

    /** @test  */
    public function it_user_cannot_register_with_passwords_not_matching()
    {
        $response = $this->from(route('register'))->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'our-secret',
            'password_confirmation' => 'rahasia-kita',
        ]);

        $response->assertRedirect(route('register'));
        $response->assertSessionHasErrors('password');
        $this->assertTrue(session()->hasOldInput('name'));
        $this->assertTrue(session()->hasOldInput('email'));
        $this->assertFalse(session()->hasOldInput('password'));
        $this->assertGuest();
    }
}
