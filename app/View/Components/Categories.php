<?php

namespace App\View\Components;

use App\Models\Category;
use Illuminate\View\Component;

class Categories extends Component
{
    protected $category;

    /**
     * Create a new component instance.
     *
     * @param Category $category
     */
    public function __construct(Category $category)
    {
        $this->category = $category->with('posts')->where('id', '!=', 1)->get();
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('blog.components.categories', [
            'categories' => $this->category,
        ]);
    }
}
