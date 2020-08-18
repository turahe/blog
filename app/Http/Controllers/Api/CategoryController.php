<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Resources\Category as CategoryResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class CategoryController.
 */
class CategoryController extends Controller
{
    /**
     * Return the categories.
     *
     * @param Request $request
     * @param Category $category
     * @return ResourceCollection
     */
    public function index(Request $request, Category $category): ResourceCollection
    {
        return CategoryResource::collection(
            $category->latest()
                ->with(['media', 'posts'])
                ->paginate($request->input('limit', 20))
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CategoryRequest $request
     * @param Category $category
     * @throws AuthorizationException
     * @return CategoryResource
     */
    public function update(CategoryRequest $request, Category $category): CategoryResource
    {
        $this->authorize('update', $category);

        $category->update($request->all());

        return new CategoryResource($category);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CategoryRequest $request
     * @param Category $category
     * @throws AuthorizationException
     * @return CategoryResource
     */
    public function store(CategoryRequest $request, Category $category): CategoryResource
    {
        $this->authorize('store', $category);

        return new CategoryResource(
            $category->create($request->all())
        );
    }

    /**
     * Return the specified resource.
     * @param Category $category
     * @return CategoryResource
     */
    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Category $category
     * @throws AuthorizationException
     * @throws \Exception
     * @return Response
     */
    public function destroy(Category $category): Response
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->noContent();
    }
}
