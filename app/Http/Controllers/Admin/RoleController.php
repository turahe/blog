<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\RoleRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;

/**
 * Class RoleController.
 */
final class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        $roles = Role::all();

        return view('admin.roles.index', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function create()
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
     * @return
     */
    public function edit(Role $role)
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
