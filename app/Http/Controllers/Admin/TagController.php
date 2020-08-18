<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use Illuminate\View\View;
use Illuminate\Support\Arr;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Admin\TagRequest;

/**
 * Class TagController.
 */
final class TagController extends Controller
{
    protected array $fields = [
        'tag' => '',
        'title' => '',
        'subtitle' => '',
        'meta_description' => '',
        'layout' => 'blog.layouts.index',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return View
     */
    public function index(): View
    {
        $data = [
            'tags' => Tag::all(),
        ];
        foreach ($this->fields as $field => $default) {
            $data[$field] = old($field, $default);
        }

        return view('admin.tags.index', $data);
    }

    /**
     * Show form for creating new tag.
     */
    public function create()
    {
        $data = [];
        foreach ($this->fields as $field => $default) {
            $data[$field] = old($field, $default);
        }

        return view('admin.tag.create', $data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TagRequest $request
     * @param Tag $tag
     * @return RedirectResponse
     */
    public function store(TagRequest $request, Tag $tag): RedirectResponse
    {
//        $tag = new Tag();
        foreach (array_keys($this->fields) as $field) {
            $tag->$field = $request->get($field);
        }
        $tag->save();

        return redirect()
            ->back()
            ->with('success', 'Tag was saved successfully');
    }

    /**
     * Show the form for editing a tag.
     *
     * @param Tag $tag
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|View
     */
    public function edit(Tag $tag): View
    {
//        $tag = Tag::findOrFail($id);
        $data = [];
        foreach (array_keys($this->fields) as $field) {
            $data[$field] = old($field, $tag->$field);
        }

        return view('admin.tag.edit', $data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TagRequest $request
     * @param Tag $tag
     * @return RedirectResponse
     */
    public function update(TagRequest $request, Tag $tag): RedirectResponse
    {
        foreach (array_keys(Arr::except($this->fields, ['tag'])) as $field) {
            $tag->$field = $request->get($field);
        }
        $tag->save();

        return redirect()
            ->back()
            ->with('success', 'Tag was updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Tag $tag
     * @throws \Exception
     * @return RedirectResponse
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()
            ->back()
            ->with('success', 'Tag was deleted successfully');
    }
}
