<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use Carbon\Carbon;
use App\Libraries\Slug\HasSlug;
use App\Libraries\Users\Avatar;
use Spatie\MediaLibrary\HasMedia;
use Laravel\Passport\HasApiTokens;
use App\Libraries\Slug\SlugOptions;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Image\Exceptions\InvalidManipulation;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Translation\HasLocalePreference;

/**
 * App\Models\User.
 *
 * @method static firstOrCreate(array $array)
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $email
 * @property null|\Illuminate\Support\Carbon $email_verified_at
 * @property string $password
 * @property null|\Illuminate\Support\Carbon $registered_at
 * @property null|string $api_token
 * @property null|string $provider
 * @property null|string $provider_id
 * @property null|string $remember_token
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Activity[]|\Illuminate\Database\Eloquent\Collection $activities
 * @property-read null|int $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Passport\Client[] $clients
 * @property-read null|int $clients_count
 * @property-read \App\Models\Comment[]|\Illuminate\Database\Eloquent\Collection $comments
 * @property-read null|int $comments_count
 * @property-read null|string $avatar
 * @property-read mixed|string $url
 * @property-read \App\Models\Like[]|\Illuminate\Database\Eloquent\Collection $likes
 * @property-read null|int $likes_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\MediaLibrary\MediaCollections\Models\Media[] $media
 * @property-read null|int $media_count
 * @property-read \Illuminate\Notifications\DatabaseNotification[]|\Illuminate\Notifications\DatabaseNotificationCollection $notifications
 * @property-read null|int $notifications_count
 * @property-read \App\Models\Permission[]|\Illuminate\Database\Eloquent\Collection $permissions
 * @property-read null|int $permissions_count
 * @property-read \App\Models\Post[]|\Illuminate\Database\Eloquent\Collection $posts
 * @property-read null|int $posts_count
 * @property-read null|\App\Models\Profile $profile
 * @property-read \App\Models\Role[]|\Illuminate\Database\Eloquent\Collection $roles
 * @property-read null|int $roles_count
 * @property-read \App\Models\Social[]|\Illuminate\Database\Eloquent\Collection $socials
 * @property-read null|int $socials_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Passport\Token[] $tokens
 * @property-read null|int $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User authors()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User lastWeek()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User latest()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereApiToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereRegisteredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class User extends Authenticatable implements HasMedia, MustVerifyEmail, HasLocalePreference
{
    use Notifiable, InteractsWithMedia, HasRoles, HasApiTokens, LogsActivity, HasSlug;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'provider', 'provider_id', 'registered_at', 'api_token',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'registered_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @param null|Media $media
     * @throws InvalidManipulation
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('large')
            ->width(256)
            ->height(256)
            ->sharpen(10)
            ->optimize()
            ->withResponsiveImages();

        $this->addMediaConversion('medium')
            ->width(180)
            ->height(180)
            ->sharpen(10)
            ->optimize()
            ->withResponsiveImages();

        $this->addMediaConversion('small')
            ->width(120)
            ->height(120)
            ->sharpen(10)
            ->optimize()
            ->withResponsiveImages();

        $this->addMediaConversion('x-small')
            ->width(88)
            ->height(88)
            ->sharpen(10)
            ->optimize()
            ->withResponsiveImages();
    }

    /**
     * @return SlugOptions
     */
    public function getSlugOptions(): SlugOptions
    {
        // TODO: Implement getSlugOptions() method.
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    /**
     * Get the user's preferred locale.
     *
     * @return string
     */
    public function preferredLocale()
    {
        return $this->locale;
    }

    /**
     * @return mixed|string
     */
    public function getUrlAttribute(): string
    {
        return $this->slug;
    }

    /**
     * Get gravatar based username.
     *
     * @return null|string
     */
    public function getAvatarAttribute()
    {
        if ($this->getMedia('images')->count()) {
            return $this->getMedia('images')[0]->getUrl('x-small');
        }

        return Avatar::get($this);
    }

    /**
     * Return a unique personal access token.
     *
     * @return string
     */
    public static function generate(): string
    {
        do {
            $api_token = \Str::random(60);
        } while (self::where('api_token', $api_token)->exists());

        return $api_token;
    }

    /**
     * Scope a query to only include users registered last week.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeLastWeek(Builder $query): Builder
    {
        return $query->whereBetween('registered_at', [Carbon::now()->subWeeks(1), Carbon::now()])
            ->latest();
    }

    /**
     * Scope a query to order users by latest registered.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('registered_at', 'desc');
    }

    /**
     * Scope a query to filter available author users.
     *
     * @param Builder $query
     * @return mixed
     */
    public function scopeAuthors(Builder $query): Builder
    {
        return $query->whereHas('roles', function ($query) {
            $query->where('roles.name', Role::ROLE_ADMIN)
                ->orWhere('roles.name', Role::ROLE_EDITOR);
        });
    }

    /**
     * Check if the user can be an author.
     *
     * @return bool
     */
    public function canBeAuthor(): bool
    {
        return $this->isAdmin() || $this->isEditor();
    }

    /**
     * Check if the user has role admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(Role::ROLE_ADMIN);
    }

    /**
     * Check if the user has role editor.
     *
     * @return bool
     */
    public function isEditor(): bool
    {
        return $this->hasRole(Role::ROLE_EDITOR);
    }

    /**
     * One to one relationship
     * Relation user and profile
     * example: $user->profile.
     *
     * @return HasOne
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id');
    }

    /**
     * @return HasMany
     */
    public function socials(): HasMany
    {
        return  $this->hasMany(Social::class, 'user_id');
    }

    /**
     * One to many between users and post
     * every users has many posts
     * example: $user->posts.
     *
     * @return HasMany
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    /**
     * Return the user's comments.
     *
     * @return HasMany
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    /**
     * Return the user's likes
     * One to many between user's likes and like
     * Example: user->likes.
     *
     * @return HasMany
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class, 'user_id');
    }
}
