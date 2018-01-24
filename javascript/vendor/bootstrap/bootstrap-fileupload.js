/* ===========================================================
 * bootstrap-fileupload.js j2
 * http://jasny.github.com/bootstrap/javascript.html#fileupload
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  var Fileupload = function (element, options) {
    this.$element = $(element);
    this.$input = this.$element.find(':file');
    this.$preview = this.$element.find('.fileupload-preview');
    this.$element.find('[data-trigger="fileupload"]').on('click.fileupload', $.proxy(this.trigger, this));

    this.listen();
  };

  Fileupload.prototype = {

    listen: function() {
      this.$input.on('change.fileupload', $.proxy(this.change, this));
    },

    change: function(e, invoked) {
      var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? { name: e.target.value.replace(/^.+\\/, '') } : null);

      if (!file) {
        this.clear();
        return;
      }

      this.$input.attr('name', this.name);

      this.$preview.text(file.name);
      $(".file-upload-warning").html("");
    },

    clear: function() {
      this.$preview.html('choose a file');

    },

    trigger: function(e) {
      this.$input.trigger('click');
      e.preventDefault();
    }
  };


  $.fn.fileupload = function (options) {
    return this.each(function () {
      var $this = $(this);
      data = $this.data('fileupload');
      if (!data) $this.data('fileupload', (data = new Fileupload(this, options)));
      if (typeof options == 'string') data[options]();
    });
  };

  $.fn.fileupload.Constructor = Fileupload;


  $(document).on('click.fileupload.data-api', '[data-provides="fileupload"]', function (e) {
    var $this = $(this);
    if ($this.data('fileupload')) return;
    $this.fileupload($this.data());

    var $target = $(e.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');
    if ($target.length > 0) {
      $target.trigger('click.fileupload');
      e.preventDefault();
    }
  });

}(window.jQuery);
