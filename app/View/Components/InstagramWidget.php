<?php

namespace App\View\Components;

use Illuminate\View\View;
use Illuminate\View\Component;
use App\Libraries\Instagram\Feed;

class InstagramWidget extends Component
{
    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render(): View
    {
        $feed = Feed::instagram('wach_1');

        return view('blog.components.instagram.feed', [
            'instagram' => $feed,
        ]);
    }
}
