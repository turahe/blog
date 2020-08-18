<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Jobs;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use App\Models\NewsletterSubscription;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

/**
 * Class PrepareNewsletterSubscriptionEmail.
 */
class PrepareNewsletterSubscriptionEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        $newsletterSubscriptions = NewsletterSubscription::all();

        $newsletterSubscriptions->each(fn ($newsletterSubscription) => SendNewsletterSubscriptionEmail::dispatch($newsletterSubscription->email));

        PrepareNewsletterSubscriptionEmail::dispatch()->delay(Carbon::tomorrow());
    }
}
