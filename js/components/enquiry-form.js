/* Course-page "Get Course Details" form.
   Submits via the same verified FormSubmit.co AJAX endpoint
   used by the contact page and swaps in a success panel. */

(function () {
  function init() {
    var form = document.querySelector(".admission-form");
    if (!form) return;

    form.setAttribute("novalidate", "");

    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input, select")
    );
    var submit = form.querySelector('button[type="submit"]');

    function fieldError(el) {
      var next = el.nextElementSibling;
      return next && next.classList.contains("form-error") ? next : null;
    }

    function setInvalid(el, message) {
      el.classList.add("invalid");
      var box = fieldError(el);
      if (!box) {
        box = document.createElement("p");
        box.className = "form-error";
        el.parentNode.insertBefore(box, el.nextSibling);
      }
      box.textContent = message;
    }

    function clearInvalid(el) {
      el.classList.remove("invalid");
      var box = fieldError(el);
      if (box) box.textContent = "";
    }

    function checkField(el) {
      var val = (el.value || "").trim();
      var type = el.type;

      if (el.tagName === "SELECT") {
        if (el.selectedIndex <= 0) {
          setInvalid(el, "Please choose an option.");
          return false;
        }
      } else if (!val) {
        setInvalid(el, "This field is required.");
        return false;
      } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setInvalid(el, "Please enter a valid email address.");
        return false;
      } else if (type === "tel" && val.replace(/\D/g, "").length < 7) {
        setInvalid(el, "Please enter a valid phone number.");
        return false;
      }

      clearInvalid(el);
      return true;
    }

    fields.forEach(function (el) {
      el.addEventListener("blur", function () {
        if (el.classList.contains("invalid")) checkField(el);
      });
      el.addEventListener("input", function () {
        if (el.classList.contains("invalid")) checkField(el);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstBad = null;
      fields.forEach(function (el) {
        if (!checkField(el) && !firstBad) firstBad = el;
      });

      if (firstBad) {
        firstBad.focus();
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      fetch("https://formsubmit.co/ajax/af26ba6712e7d1bda9b2165add0922ab", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      }).then(function (data) {
        if (data.success !== true && data.success !== "true") throw new Error("not delivered");
        var panel = document.createElement("div");
        panel.className = "form-success";
        panel.setAttribute("role", "status");
        panel.innerHTML =
          "<strong>Thank you!</strong>" +
          "<span>We’ve received your details — our team will call you shortly.</span>";
        form.replaceChildren(panel);
      }).catch(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = "Get Course Details →";
        }
        var box = document.createElement("p");
        box.className = "form-error form-error-general";
        box.setAttribute("role", "alert");
        box.textContent = "Something went wrong. Please try again or call us directly.";
        var existing = form.querySelector(".form-error-general");
        if (existing) existing.remove();
        form.insertBefore(box, form.firstChild);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
