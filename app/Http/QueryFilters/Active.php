<?php

namespace App\Http\QueryFilters;

/**
 * Class Active.
 * @package App\Http\Pipelines\QueryFilters
 */
class Active extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        return $builder->where('active', request($this->filterName()));
    }
}
