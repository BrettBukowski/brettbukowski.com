/* global $,Component */
// Handles the contact form interaction.
$(function() {
  var FormDealer = Component.extend({
    submitButton: null,

    form: null,

    constructor: function() {
      $(document).delegate('form', 'submit', Component.bind(this.onSubmit, this));
    },

    onSubmit: function(e) {
      this.form = $(e.target);

      e.preventDefault();

      this.submitButton = this.form.find('input[type="submit"]');
      this.submitButton
        .val('Sending...')
        .prop('disabled', true);

      this.submitForm(this.form);
    },

    submitForm: function(form) {
      $.ajax(form.attr('action'), {
        data: form.serializeArray(),
        type: form.attr('method') || 'POST',
        dataType: 'json',
        context: this
      })
        .done(this.onSuccess)
        .fail(this.onFail);
    },

    onSuccess: function(response) {
      if (response.sent) {
        this.form.animate({ height: 0 }, 'slow', 'linear', function() {
          $('#formMessage').html("Thanks for getting in touch! I'll respond to you presently.").removeClass('hidden');
          $(this).remove();
        });
      }
      else {
        this.onFail();
      }
    },

    onFail: function() {
      $('#formMessage').html('There was a problem. Check the form and please try again.').removeClass('hidden');
      this.submitButton.val('Send').prop('disabled', false);
    }
  });

  new FormDealer();
});