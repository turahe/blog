<?php

namespace App\Http\QueryFilters;

/**
 * Class Published.
 * @package App\Http\Pipelines\QueryFilters
 */
class Published extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        return $builder->where('published_at', request($this->filterName()));
    }
}
