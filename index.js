  /* script.js */
  
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    alert(`Thank you ${name}, your message has been sent!`);
    form.reset();
  });
  