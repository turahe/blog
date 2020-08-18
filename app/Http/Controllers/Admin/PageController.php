<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use Illuminate\View\View;
use App\Models\Post as Page;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Admin\PageRequest;

/**
 * Class PageController.
 */
final class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return View
     */
    public function index(): View
    {
        return view('admin.pages.index', [
            'pages' => Page::whereType('page')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.pages.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param PageRequest $request
     * @param Page $page
     * @return RedirectResponse
     */
    public function store(PageRequest $request, Page $page): RedirectResponse
    {
        $page->create($request->pageFillData());

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', __('pages.created'));
    }

    /**
     * Display the specified resource.
     *
     * @param Page $page
     * @return void
     */
    public function show(Page $page)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Page $page
     * @return View
     */
    public function edit(Page $page): View
    {
        return view('admin.pages.edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param PageRequest $request
     * @param Page $page
     * @return RedirectResponse
     */
    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $page->update($request->pageFillData());

        if ($request->action === 'continue') {
            return redirect()
                ->back()
                ->with('success', 'Post saved.');
        }

        return redirect()
            ->route('admin.pages.index')
            ->with('success', __('pages.updated'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Page $page
     * @throws \Exception
     * @return RedirectResponse
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return redirect()
            ->route('admin.pages.index')
            ->with('success', __('pages.deleted'));
    }
}
