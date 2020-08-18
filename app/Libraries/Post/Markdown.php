<?php

namespace App\Libraries\Post;

use League\CommonMark\GithubFlavoredMarkdownConverter;

class Markdown
{
    /**
     * Convert markdown to HTML.
     *
     * @param string $text
     * @return string
     */
    public function generate(string $text): string
    {
        try {
            $markdown = new GithubFlavoredMarkdownConverter();

            return $markdown->convertToHtml($text);
        } catch (\Exception $exception) {
            $exception->getMessage();
        }
    }
}
