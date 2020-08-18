<?php

namespace App\View\Components;

use Illuminate\View\View;
use Illuminate\View\Component;

class Alert extends Component
{
    /**
     * The alert type.
     */
    public string $type;

    /**
     * The alert type.
     */
    public ?string $dismissible;

    /**
     * Create a new component instance.
     *
     * @param string $type
     * @param null|string $dismissible
     */
    public function __construct(string $type, string $dismissible = null)
    {
        $this->type = $type;
        $this->dismissible = $dismissible;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        return view('components.alert');
    }
}
