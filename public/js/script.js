document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("g_btn");

  btn.addEventListener("click", (e) => {
    window.location.href = "/auth/google";
  });
});
