<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers;

use Auth;
use Session;
use Validator;
use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Jobs\UnsubscribeNewsletter;
use Illuminate\Http\RedirectResponse;
use App\Models\NewsletterSubscription;
use App\Http\Requests\NewsletterSubscriptionRequest;

/**
 * Class NewsletterSubscriptionController.
 */
final class NewsletterSubscriptionController extends Controller
{
    /**
     * @param NewsletterSubscriptionRequest $request
     * @return RedirectResponse
     */
    public function store(NewsletterSubscriptionRequest $request): RedirectResponse
    {
        $newsletterSubscription = NewsletterSubscription::create($request->validated());

        return back()
            ->with('success', __('newsletter.created'));
    }

    /**
     * @param Request $request
     * @return RedirectResponse|View
     */
    public function unsubscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:newsletter_subscriptions,email',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            $route = 'login';

            if (Auth::check()) {
                $route = 'home';
            }

            return redirect()->route($route)->withErrors($errors);
        }

        UnsubscribeNewsletter::dispatch($request->input('email'));

        Session::flash('success', __('newsletter.unsubscribed'));

        return view('newsletters.unsubscribed');
    }
}
