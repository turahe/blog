<!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="#" class="brand-link">
        {!! svg('turahe-light') !!}
        {{--        <img src="{{ Storage::url('turahe-light.svg') }}" alt="{{ config('blog.name') }}" class="brand-image img-circle elevation-3" style="opacity: .8">--}}
        {{--        <span class="brand-text font-weight-light">{{ config('blog.name') }}</span>--}}
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="{{ Auth::user()->avatar }}" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block">{{ Auth::user()->name }}</a>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <!-- Add icons to the links using the .nav-icon class
                     with font-awesome or any other icon font library -->
                <?php
                $content_route = ['admin.posts.index', 'admin.posts.create', 'admin.posts.edit', 'admin.categories.index', 'admin.categories.create', 'admin.categories.edit']
                ?>
                <li class="nav-item has-treeview {{ set_active($content_route, 'menu-open') }}">
                    <a href="#" class="nav-link {{ set_active($content_route) }}">
                        <i class="nav-icon fas fa-copy"></i>
                        <p>
                            Contents
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('admin.posts.index') }}"
                               class="nav-link {{ set_active(['admin.posts.index', 'admin.posts.create', 'admin.posts.edit']) }}">
                                <i class="far fa-circle nav-icon"></i>
                                <p>All posts</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('admin.categories.index') }}"
                               class="nav-link {{ set_active(['admin.categories.index', 'admin.categories.create', 'admin.categories.edit']) }}">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Categories</p>
                            </a>
                        </li>
                    </ul>
                </li>

                <?php
                $page_route = ['admin.pages.index', 'admin.pages.create', 'admin.pages.edit'];
                ?>

                <li class="nav-item has-treeview {{ set_active($page_route, 'menu-open') }}">
                    <a href="#" class="nav-link {{ set_active($page_route) }}">
                        <i class="nav-icon fas fa-copy"></i>
                        <p>
                            Pages
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('admin.pages.index') }}" class="nav-link {{ set_active($page_route) }}">
                                <i class="far fa-circle nav-icon"></i>
                                <p>All Pages</p>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
