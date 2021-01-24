<?php

namespace App\Http\QueryFilters;

/**
 * Class Sort.
 * @package App\Http\Pipelines\QueryFilters
 */
class Sort extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        return $builder->orderBy('title', request($this->filterName()));
    }
}
