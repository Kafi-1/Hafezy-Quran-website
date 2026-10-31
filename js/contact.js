(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("form-submit");
  var endpoint =
    (window.HAFEZY_CONFIG && window.HAFEZY_CONFIG.contactFormUrl) ||
    "https://script.google.com/macros/s/AKfycbxGjpXTLBtMMMSBGNbTN1RZZYvaM3XTP50i0Sq_xVGs2mR2i11n_aia96HP2JH4VHblpQ/exec";

  function t(key, fallback) {
    var lang = localStorage.getItem("hq-language") === "bn" ? "bn" : "en";
    var dict = (window.HQ_TRANSLATIONS && window.HQ_TRANSLATIONS[lang]) || {};
    return dict[key] || fallback || key;
  }

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (type ? " is-" + type : "");
  }

  /** Reliable for Google Apps Script: classic form POST into hidden iframe (avoids CORS). */
  function submitViaIframe(payload) {
    return new Promise(function (resolve) {
      var frameName = "hq_gas_" + Date.now();
      var iframe = document.createElement("iframe");
      iframe.name = frameName;
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
      document.body.appendChild(iframe);

      var f = document.createElement("form");
      f.method = "POST";
      f.action = endpoint;
      f.target = frameName;
      f.acceptCharset = "UTF-8";
      f.style.display = "none";

      Object.keys(payload).forEach(function (key) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payload[key] == null ? "" : String(payload[key]);
        f.appendChild(input);
      });

      document.body.appendChild(f);
      f.submit();

      setTimeout(function () {
        try { f.remove(); } catch (e1) {}
        try { iframe.remove(); } catch (e2) {}
        resolve(true);
      }, 2500);
    });
  }

  /** Also try fetch; if CORS blocks, iframe path still used as primary. */
  function submitViaFetch(payload) {
    return fetch(endpoint, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.text().then(function (text) {
        try {
          var data = JSON.parse(text);
          if (data && data.ok) return true;
          if (data && data.ok === false) throw new Error(data.error || "fail");
        } catch (err) {
          if (res.ok) return true;
          throw err;
        }
        return true;
      });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = (form.name.value || "").trim();
    var email = (form.email.value || "").trim();
    var phone = (form.phone.value || "").trim();
    var subject = (form.subject.value || "").trim();
    var message = (form.message.value || "").trim();

    if (!name || !email || !message) {
      setStatus(t("formRequired", "Please fill in name, email and message."), "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus(t("formInvalidEmail", "Please enter a valid email address."), "error");
      return;
    }

    var payload = {
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message
    };

    submitBtn.disabled = true;
    setStatus(t("formSending", "Sending…"), "pending");

    // Primary: iframe form POST (works with GAS + e.parameter)
    submitViaIframe(payload)
      .then(function () {
        setStatus(t("formSuccess", "Message sent. Thank you!"), "success");
        form.reset();
      })
      .catch(function () {
        // Fallback fetch
        return submitViaFetch(payload).then(function () {
          setStatus(t("formSuccess", "Message sent. Thank you!"), "success");
          form.reset();
        });
      })
      .catch(function () {
        setStatus(t("formError", "Could not send. Please try again or email support."), "error");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
