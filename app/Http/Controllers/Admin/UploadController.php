<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Http\RedirectResponse;
use App\Libraries\Storage\UploadsManager;
use App\Http\Requests\Admin\UploadFileRequest;
use App\Http\Requests\Admin\UploadNewFolderRequest;

/**
 * Class UploadController.
 */
class UploadController extends Controller
{
    /**
     * @var UploadsManager
     */
    protected $manager;

    /**
     * UploadController constructor.
     * @param UploadsManager $manager
     */
    public function __construct(UploadsManager $manager)
    {
        $this->manager = $manager;
        parent::__construct();
    }

    /**
     * Show page of files / subfolders.
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request)
    {
        $folder = $request->get('folder');
        $data = $this->manager->folderInfo($folder);

        return view('admin.upload.index', $data);
    }

    /**
     * Create a new folder.
     * @param UploadNewFolderRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createFolder(UploadNewFolderRequest $request): RedirectResponse
    {
        $new_folder = $request->get('new_folder');
        $folder = $request->get('folder').'/'.$new_folder;

        $result = $this->manager->createDirectory($folder);

        if ($result === true) {
            return redirect()
                ->back()
                ->withSuccess("Folder '$new_folder' created.");
        }

        $error = $result ?: 'An error occurred creating directory.';

        return redirect()
            ->back()
            ->withErrors([$error]);
    }

    /**
     * Delete a file.
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteFile(Request $request): RedirectResponse
    {
        $del_file = $request->get('del_file');
        $path = $request->get('folder').'/'.$del_file;

        $result = $this->manager->deleteFile($path);

        if ($result === true) {
            return redirect()
                ->back()
                ->withSuccess("File '$del_file' deleted.");
        }

        $error = $result ?: 'An error occurred deleting file.';

        return redirect()
            ->back()
            ->withErrors([$error]);
    }

    /**
     * Delete a folder.
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteFolder(Request $request): RedirectResponse
    {
        $del_folder = $request->get('del_folder');
        $folder = $request->get('folder').'/'.$del_folder;

        $result = $this->manager->deleteDirectory($folder);

        if ($result === true) {
            return redirect()
                ->back()
                ->withSuccess("Folder '$del_folder' deleted.");
        }

        $error = $result ?: 'An error occurred deleting directory.';

        return redirect()
            ->back()
            ->withErrors([$error]);
    }

    /**
     * Upload new file.
     * @param UploadFileRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function uploadFile(UploadFileRequest $request): RedirectResponse
    {
        $file = $_FILES['file'];
        $fileName = $request->get('file_name');
        $fileName = $fileName ?: $file['name'];
        $path = Str::finish($request->get('folder'), '/').$fileName;
        $content = File::get($file['tmp_name']);

        $result = $this->manager->saveFile($path, $content);

        if ($result === true) {
            return redirect()
                ->back()
                ->withSuccess("File '$fileName' uploaded.");
        }

        $error = $result ?: 'An error occurred uploading file.';

        return redirect()
            ->back()
            ->withErrors([$error]);
    }
}
