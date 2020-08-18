<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Jobs;

use Mail;
use App\Models\Post;
use App\Mail\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/**
 * Class SendNewsletterSubscriptionEmail.
 */
class SendNewsletterSubscriptionEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var string
     */
    protected string $email;

    /**
     * Create a new job instance.
     *
     * @param $email
     */
    public function __construct($email)
    {
        $this->email = $email;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        $posts = Post::lastMonth()->get();
        $email = $this->email;

        Mail::to($this->email)->send(new Newsletter($posts, $email));
    }
}
