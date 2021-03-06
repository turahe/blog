<div id="app" class="blog-comment">
    <div class="section-heading-4 heading-dark">
        <h3 class="item-heading">{{ trans_choice('comments.count', $blog->comments->count()) }}</h3>
    </div>
    @include ('blog.comment.form')

    <comment-list
        :post-id="{{ $blog->id }}"
        loading-comments="@lang('comments.loading_comments')"
        data-confirm="@lang('forms.comments.delete')">
    </comment-list>

</div>


{{--<div class="blog-comment">--}}
{{--    <div class="section-heading-4 heading-dark">--}}
{{--        <h3 class="item-heading">{{ $blog->comments->count() }} COMMENTS</h3>--}}
{{--    </div>--}}
{{--    @foreach($blog->comments as $comment)--}}
{{--        <div class="media media-none--xs">--}}
{{--            <img src="{{ $comment->user->avatar }}" alt="{{ $comment->user->name }}" class="img-fluid media-img-auto" width="80px">--}}
{{--            <div class="media-body">--}}
{{--                <h4 class="item-title">{{ $comment->user->name }}</h4>--}}
{{--                <div class="item-subtitle" data-toggle="tooltip" title="{{ $comment->published_at->toIso8601String() }}">--}}
{{--                    <time>--}}
{{--                        {{ $comment->time_elapsed }}--}}
{{--                    </time>--}}
{{--                </div>--}}
{{--                {{ $comment->content }}--}}
{{--                <a href="#" class="item-btn">Reply</a>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    @endforeach--}}
{{--</div>--}}
