<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\View\View;
use App\Http\Requests\UsersRequest;
use Illuminate\Http\RedirectResponse;

/**
 * Class UserController.
 */
final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return View
     */
    public function index(): View
    {
        $users = User::all();

        return view('admin.users.index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.users.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UsersRequest $request
     * @param User $user
     * @return RedirectResponse
     */
    public function store(UsersRequest $request, User $user): RedirectResponse
    {
        $user->create($request->all());

        return redirect()
            ->back()
            ->with('success', 'New user was saved successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return void
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param User $user
     * @return View
     */
    public function edit(User $user): View
    {
        return view('admin.users.edit', [
            'user' => $user,
            'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UsersRequest $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(UsersRequest $request, User $user): RedirectResponse
    {
        $user->update($request->all());

        return redirect()
            ->back()
            ->with('success', 'new user was updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @throws \Exception
     * @return RedirectResponse
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()
            ->back()
            ->with('success', 'User was deleted successfully');
    }
}
