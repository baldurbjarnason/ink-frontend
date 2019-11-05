export function getCookie(name) {
  return decodeURIComponent(
    document.cookie.replace(
      new RegExp(
        "(?:(?:^|.*;)\\s*" +
          encodeURIComponent(name).replace(/[-.+*]/g, "\\$&") +
          "\\s*\\=\\s*([^;]*).*$)|^.*$"
      ),
      "$1"
    )
  );
}

export function getToken() {
  return document.querySelector('[name="csrftoken"]').getAttribute("content")
}
