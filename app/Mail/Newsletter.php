<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Newsletter extends Mailable
{
    use Queueable, SerializesModels;

    protected $posts;
    protected $email;

    /**
     * Create a new message instance.
     *
     * @param $posts
     * @param $email
     */
    public function __construct($posts, $email)
    {
        $this->posts = $posts;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): Newsletter
    {
        return $this->from('hello@turahe.id', config('app.name', 'Turahe'))
            ->subject(__('newsletter.email.subject'))
            ->view('emails.newsletter')
            ->with([
                'posts' => $this->posts,
                'email' => $this->email,
            ]);
    }
}
