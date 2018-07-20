'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarUpload = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var avatarDefaultSrc = avatarPreview.children[0].src;
  var avatarDropzone = document.querySelector('.ad-form-header__drop-zone');
  var photosUpload = document.querySelector('#images');
  var photosPreview = document.querySelector('.ad-form__photo');
  var photosDropzone = document.querySelector('.ad-form__drop-zone');
  var dragErrorMessage = 'Перетаскивание не работает в этом браузере, кликните по полю загрузки.';
  var uploadErrorMessage = 'Можно загружать только изображения!';
  window.upload = {
    enable: function () {
      createUploadListeners();
    },

    reset: function () {
      avatarPreview.children[0].src = avatarDefaultSrc;
      photosPreview.innerHTML = '';
    }
  };

  function createUploadListeners() {
    avatarUpload.addEventListener('change', onAvatarFileUpload);
    avatarDropzone.addEventListener('dragover', onFileDragOver);
    avatarDropzone.addEventListener('dragleave', onFileDragLeave);
    avatarDropzone.addEventListener('drop', onAvatarDrop);
    photosUpload.addEventListener('change', onPhotosFileUpload);
    photosDropzone.addEventListener('dragover', onFileDragOver);
    photosDropzone.addEventListener('dragleave', onFileDragLeave);
    photosDropzone.addEventListener('drop', onPhotosDrop);
  }

  function onAvatarFileUpload(evt) {
    if (checkFile(evt.target.value.toLowerCase())) {
      renderPreview(avatarUpload.files[0], avatarPreview);
    } else {
      window.modal.error(uploadErrorMessage);
      evt.target.value = null;
    }
  }

  function onPhotosFileUpload(evt) {
    if (checkFile(evt.target.value.toLowerCase())) {
      renderPreview(photosUpload.files[0], photosPreview);
    } else {
      window.modal.error(uploadErrorMessage);
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
    try { // firefox workaround
      evt.target.classList.remove('dragged-over');
    } catch (err) {
      toString(err);
    }
  }

  function onAvatarDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.classList.remove('dragged-over');
    try {
      avatarUpload.files = evt.dataTransfer.files;
    } catch (err) {
      window.modal.error(dragErrorMessage);
    }
  }

  function onPhotosDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.classList.remove('dragged-over');
    try {
      photosUpload.files = evt.dataTransfer.files;
    } catch (err) {
      window.modal.error(dragErrorMessage);
    }
  }

  function checkFile(file) {
    if (FILE_TYPES.some(function (elem) {
      return file.substring(file.length - elem.length, file.length) === elem;
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
