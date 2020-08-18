<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Blog Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your blog. This value is used when the
    | blog needs to place the blog's name in a notification or
    | any other location as required by the blog.
    |
    */
    'title' => env('APP_TITLE', 'turahe'),
    'name' => env('APP_NAME', 'turahe'),
    'subtitle' => 'A clean blog written in Laravel 5.1',
    'description' => 'This is my meta description',

    /*
     * Whether or not minute/second should be abbreviated as min/sec
     */
    'abbreviate_time_measurements' => false,

    /*
     * Omit seconds from being displayed in the read time estimate
     */
    'omit_seconds' => true,

    /*
     * Whether or not only the time should be displayed
     */
    'time_only' => false,

    /*
     * The average words per minute reading time
     */
    'words_per_minute' => 230,

    'analytic_id' => env('GOOGLE_ANALYTIC_ID', null),

    /*
    |--------------------------------------------------------------------------
    | Blog Author
    |--------------------------------------------------------------------------
    |
    | This value is the name of your blog. This value is used when the
    | blog needs to place the blog's name in a notification or
    | any other location as required by the blog.
    |
    */
    'author' =>[
        'name' => env('APP_AUTHOR', 'turahe'),
        'description' => 'This is my meta description',
    ],
    'posts_per_page' => 10,
    'rss_size' => 25,

    /*
    |--------------------------------------------------------------------------
    | Socials blog settings
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */
    'socials' => [
        [
            'name' => 'facebook',
            'url'=> 'https://facebook.com/'.env('SOCIAL_FACEBOOK', null),
            'text' => 'LIKE ME ON',
        ],
        [
            'name' => 'instagram',
            'url'=> 'https://instagram.com/'.env('SOCIAL_INSTAGRAM', null),
            'text' => 'FOLLOW ME',
        ],
        [
            'name' => 'linkedin',
            'url'=> 'https://instagram.com/'.env('SOCIAL_LINKEDIN', null),
            'text' => 'FOLLOW ME',
        ],
        [
            'name' => 'behance',
            'url'=> 'https://behance.net/'.env('SOCIAL_BEHANCE', null),
            'text' => 'FOLLOW ME',
        ],
        [
            'name' => 'twitter',
            'url'=> 'https://twitter.com/'.env('SOCIAL_TWITTER', null),
            'text' => 'FOLLOW ME',
        ],
        [
            'name' => 'github',
            'url'=> 'https://github.com/'.env('SOCIAL_GITHUB', null),
            'text' => 'FOLLOW ME',
        ],
        [
            'name' => 'youtube',
            'url'=> 'https://youtube.com/'.env('SOCIAL_YOUTUBE', 'turahe'),
            'text' => 'SUBSCRIBE',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Blog Address
    |--------------------------------------------------------------------------
    |
    | This value is the name of your blog. This value is used when the
    | blog needs to place the blog's name in a notification or
    | any other location as required by the blog.
    |
    */
    'contact' => [
        'email' => env('CONTACT_EMAIL', 'example@ymail.com'),
        'phone' => env('CONTACT_PHONE', '+90 000 333 22'),
        'address' =>[
            'city' => 'Sydney',
            'street' => '6 rip carl Avenue CA 90733',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Blog PWA
    |--------------------------------------------------------------------------
    |
    | This value is the name of your blog. This value is used when the
    | blog needs to place the blog's name in a notification or
    | any other location as required by the blog.
    |
    */

    'manifest' => [
        'name' => env('APP_NAME', 'Turahe.id'),
        'short_name' => env('APP_NAME', 'Turahe.id'),
        'start_url' => '/',
        'background_color' => '#ffffff',
        'theme_color' => '#000000',
        'display' => 'standalone',
        'orientation'=> 'any',
        'status_bar'=> 'black',
        'icons' => [
            '72x72' => [
                'path' => '/images/icons/icon-72x72.png',
                'purpose' => 'any',
            ],
            '96x96' => [
                'path' => '/images/icons/icon-96x96.png',
                'purpose' => 'any',
            ],
            '128x128' => [
                'path' => '/images/icons/icon-128x128.png',
                'purpose' => 'any',
            ],
            '144x144' => [
                'path' => '/images/icons/icon-144x144.png',
                'purpose' => 'any',
            ],
            '152x152' => [
                'path' => '/images/icons/icon-152x152.png',
                'purpose' => 'any',
            ],
            '192x192' => [
                'path' => '/images/icons/icon-192x192.png',
                'purpose' => 'any',
            ],
            '384x384' => [
                'path' => '/images/icons/icon-384x384.png',
                'purpose' => 'any',
            ],
            '512x512' => [
                'path' => '/images/icons/icon-512x512.png',
                'purpose' => 'any',
            ],
        ],
        'splash' => [
            '640x1136' => '/images/icons/splash-640x1136.png',
            '750x1334' => '/images/icons/splash-750x1334.png',
            '828x1792' => '/images/icons/splash-828x1792.png',
            '1125x2436' => '/images/icons/splash-1125x2436.png',
            '1242x2208' => '/images/icons/splash-1242x2208.png',
            '1242x2688' => '/images/icons/splash-1242x2688.png',
            '1536x2048' => '/images/icons/splash-1536x2048.png',
            '1668x2224' => '/images/icons/splash-1668x2224.png',
            '1668x2388' => '/images/icons/splash-1668x2388.png',
            '2048x2732' => '/images/icons/splash-2048x2732.png',
        ],
        'custom' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Blog Feeds
    |--------------------------------------------------------------------------
    |
    | This value is the name of your blog. This value is used when the
    | blog needs to place the blog's name in a notification or
    | any other location as required by the blog.
    |
    */

    'feeds' => [
        'main' => [
            /*
             * Here you can specify which class and method will return
             * the items that should appear in the feed. For example:
             * 'App\Model@getAllFeedItems'
             *
             * You can also pass an argument to that method:
             * ['App\Model@getAllFeedItems', 'argument']
             */
            'items' => 'App\Models\Post@toFeedItem',

            /*
             * The feed will be available on this url.
             */
            'url' => 'rss',

            'title' => 'My feed',
            'description' => 'The description of the feed.',
            'language' => 'en-US',

            /*
             * The view that will render the feed.
             */
            'view' => 'vendor.feed.feed',

            /*
             * The type to be used in the <link> tag
             */
            'type' => 'application/atom+xml',
        ],
    ],
];
