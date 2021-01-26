@extends('admin.layouts.app', [
    'title' => __('edit') . $post->title
])

@section('content')



    <p>@lang('posts.show') : <a href="{{ $post->url }}">{{ $post->url }}</a></p>

    <form method="POST" action="{{ route('admin.posts.update', $post) }}" enctype="multipart/form-data"
          accept-charset="UTF-8">
        @method('PATCH')
        @csrf

        <div class="container-fluid">
            <div class="row">
                @include('admin.posts._form')
            </div>
        </div>
        <div class="pull-left">
            <a href="{{ route('admin.posts.index') }}" class="btn btn-secondary">{{  __('forms.actions.back') }}</a>
            <button class="btn btn-primary" type="submit">
                <i class="fa fa-save" aria-hidden="true"></i>
                @lang('forms.actions.update')
            </button>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#buttonDelete">
                <i class="fa fa-trash" aria-hidden="true"></i>
                @lang('forms.actions.delete')
            </button>

        </div>
    </form>


    <!-- Modal -->
    <div class="modal fade" id="buttonDelete" tabindex="-1" role="dialog" aria-labelledby="buttonDeleteTitle"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <form method="POST" action="{{ route('admin.posts.destroy', $post) }}" accept-charset="UTF-8"
                          class="form-inline pull-right" data-confirm="{{ __('forms.posts.delete') }}">
                        {{ method_field('DELETE') }}
                        @csrf
                        <button class="btn btn-danger" name="submit" type="submit">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                            @lang('posts.delete')
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </form>
                </div>
            </div>
        </div>


@endsection

