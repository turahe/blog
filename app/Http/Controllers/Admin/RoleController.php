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
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Admin\RoleRequest;

/**
 * Class RoleController.
 */
final class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return View
     */
    public function index(): View
    {
        $roles = Role::all();

        return view('admin.roles.index', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.roles.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param RoleRequest $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function store(RoleRequest $request, Role $role): RedirectResponse
    {
        $role->create($request->all());

        return redirect()
            ->back()
            ->with('success', 'New Role successfully');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Role $role
     * @return View
     */
    public function edit(Role $role): View
    {
        return view('admin.roles.edit', compact('role'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param RoleRequest $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $role->update($request->all());

        return redirect()
            ->back()
            ->with('success', 'Role was updated');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Role $role
     * @throws \Exception
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()
            ->back()
            ->with('success', 'Role Was deleted');
    }
}
