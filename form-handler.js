function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: data,
    headers: {
      Accept: "application/json"
    }
  }).then(response => {
    if (response.ok) {
      form.reset();
      document.getElementById("thank-you-message").style.display = "block";
    } else {
      alert("Something went wrong. Please try again.");
    }
  });

  return false;
}
