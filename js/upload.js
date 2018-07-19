'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  window.upload = {
    enable: function () {
      createUploadListeners();
    }
  };
  var avatarUpload = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var avatarDropzone = document.querySelector('.ad-form-header__drop-zone');
  var photosUpload = document.querySelector('#images');
  var photosPreview = document.querySelector('.ad-form__photo');
  var photosDropzone = document.querySelector('.ad-form__drop-zone');

  function createUploadListeners() {
    avatarUpload.addEventListener('change', onFileUpload);
    avatarDropzone.addEventListener('dragover', onFileDragOver);
    avatarDropzone.addEventListener('dragleave', onFileDragLeave);
    avatarDropzone.addEventListener('drop', onAvatarDrop);
    photosUpload.addEventListener('change', onFileUpload);
    photosDropzone.addEventListener('dragover', onFileDragOver);
    photosDropzone.addEventListener('dragleave', onFileDragLeave);
    photosDropzone.addEventListener('drop', onPhotosDrop);
  }

  function onFileUpload(evt) {
    if (checkFile(evt.target.value.toLowerCase())) {
      switch (evt.target) {
        case avatarUpload:
          renderPreview(avatarUpload.files[0], avatarPreview);
          break;
        case photosUpload:
          renderPreview(photosUpload.files[0], photosPreview);
          break;
      }
    } else {
      window.modal.error('Можно загружать только изображения!');
      evt.target.value = null;
    }
  }

  function onFileDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.classList.add('dragged-over');
    evt.dataTransfer.dropEffect = 'copy';
  }

  function onFileDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.classList.remove('dragged-over');
  }

  function onAvatarDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.classList.remove('dragged-over');
    avatarUpload.files = evt.dataTransfer.files;
  }

  function onPhotosDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.style = '';
    photosUpload.files = evt.dataTransfer.files;
  }

  function checkFile(file) {
    if (FILE_TYPES.some(function (elem) {
      return file.endsWith(elem);
    })) {
      return true;
    }
    return false;
  }

  function renderPreview(file, block) {
    if (!block.childElementCount) {
      block.appendChild(document.createElement('img'));
    }
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      block.children[0].src = reader.result;
    });
    reader.readAsDataURL(file);
  }
})();
