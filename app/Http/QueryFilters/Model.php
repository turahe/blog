<?php

namespace App\Http\QueryFilters;

class Model extends Filter
{
    protected function applyFilters($builder)
    {
        // TODO: Implement applyFilters() method.
        return $builder->where('model_id', request($this->filterName()));
    }
}
