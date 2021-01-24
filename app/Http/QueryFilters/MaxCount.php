<?php

namespace App\Http\QueryFilters;

/**
 * Class MaxCount.
 * @package App\Http\Pipelines\QueryFilters
 */
class MaxCount extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        return $builder->take(request($this->filterName()));
    }
}
