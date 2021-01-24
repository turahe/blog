<?php

namespace App\Http\QueryFilters;

class Type extends Filter
{
    /**
     * @param $builder
     * @return mixed
     */
    protected function applyFilters($builder)
    {
        // TODO: Implement applyFilters() method.
        return $builder->where('type', request($this->filterName()));
    }
}
