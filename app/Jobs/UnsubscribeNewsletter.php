<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use App\Models\NewsletterSubscription;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/**
 * Class UnsubscribeNewsletter.
 */
class UnsubscribeNewsletter implements ShouldQueue
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
     * @throws Exception
     * @return void
     */
    public function handle(): void
    {
        $email = $this->email;

        $newsletterSubscription = NewsletterSubscription::where('email', $email)->first();
        if ($newsletterSubscription) {
            $newsletterSubscription->delete();
        }
    }
}
