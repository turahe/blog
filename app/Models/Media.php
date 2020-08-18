<?php

namespace App\Models;

use App\Libraries\Tag\HasTags;
use Spatie\MediaLibrary\MediaCollections\Models\Media as Model;

/**
 * App\Models\Media.
 *
 * @property int $id
 * @property string $model_type
 * @property int $model_id
 * @property null|string $uuid
 * @property string $collection_name
 * @property string $name
 * @property string $file_name
 * @property null|string $mime_type
 * @property string $disk
 * @property null|string $conversions_disk
 * @property int $size
 * @property array $manipulations
 * @property array $custom_properties
 * @property array $responsive_images
 * @property null|int $order_column
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @property-read string $extension
 * @property-read string $human_readable_size
 * @property-read string $type
 * @property-read \Eloquent|\Illuminate\Database\Eloquent\Model $model
 * @property \App\Models\Tag[]|\Illuminate\Database\Eloquent\Collection $tags
 * @property-read null|int $tags_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\Spatie\MediaLibrary\MediaCollections\Models\Media ordered()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereCollectionName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereConversionsDisk($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereCustomProperties($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereDisk($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereManipulations($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereModelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereModelType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereOrderColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereResponsiveImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media whereUuid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media withAllTags($tags, $type = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media withAllTagsOfAnyType($tags)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media withAnyTags($tags, $type = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Media withAnyTagsOfAnyType($tags)
 * @mixin \Eloquent
 */
class Media extends Model
{
    use HasTags;
}
