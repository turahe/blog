<?php

namespace App\Http\QueryFilters;

/**
 * Class Category.
 * @package App\Http\Pipelines\QueryFilters
 */
class Category extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        // TODO: Implement applyFilters() method.
        return $builder->where('category_id', request($this->filterName()));
    }
}
