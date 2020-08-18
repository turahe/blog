<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Profile.
 *
 * @property int $id
 * @property int $user_id
 * @property string $full_name
 * @property int $gender
 * @property string $birthplace
 * @property string $birthday
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereBirthplace($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereUserId($value)
 * @mixin \Eloquent
 * @property string $first_name
 * @property string $last_name
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereLastName($value)
 * @property string $biography
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Profile whereBiography($value)
 * @property-read \App\Models\User $user
 */
class Profile extends Model
{
    /**
     * Get the user's first name.
     *
     * @param  string  $value
     * @return string
     */
    public function getFirstNameAttribute($value)
    {
        return ucfirst($value);
    }

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Set the user's first name.
     *
     * @param  string  $value
     * @return void
     */
    public function setFirstNameAttribute($value)
    {
        $this->attributes['first_name'] = strtolower($value);
    }

    /**
     * Return the profile's user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
