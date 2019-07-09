Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.match(/Error: 400: Userid reset successfully/)) {
    return false;
  } else {
    return true;
  }
});
