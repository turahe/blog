<?php

namespace App\View\Components;

use App\Libraries\Instagram\Feed;
use Illuminate\View\Component;
use Illuminate\View\View;

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
